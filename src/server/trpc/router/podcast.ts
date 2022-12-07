import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import Parser from 'rss-parser'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const podcastRouter = router({
  getEpisode: publicProcedure
    .input(z.object({ showSlug: z.string(), episodeSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const show = await ctx.prisma.show.findUnique({
        where: { slug: input.showSlug },
      })
      if (!show) throw new Error('Show not found')

      const episode = await ctx.prisma.episode.findUnique({
        where: { slug: input.episodeSlug },
        include: {
          comments: {
            include: { user: true, replies: { include: { user: true } } },
          },
        },
      })
      if (!episode) throw new Error('Episode not found')

      // get the Ratings for the episode if the user
      // is logged in
      const ratings = ctx?.session?.user
        ? await ctx.prisma.rating.findMany({
            where: {
              userId: ctx.session.user.id,
              episodeId: episode.id,
            },
          })
        : undefined

      const likes = ctx?.session?.user
        ? await ctx.prisma.like.findMany({
            where: {
              AND: [
                {
                  userId: ctx.session.user.id,
                },
                {
                  episodeId: episode.id,
                },
              ],
            },
          })
        : undefined

      return {
        data: {
          id: episode.id,
          title: episode.title,
          description: episode.description,
          imageUrl: show.imageUrl,
          comments: episode.comments
            .filter((c) => !c.replyToId)
            .map((c) => ({
              ...c,
              isLiked: likes?.some((l) => l.commentId === c.id) ?? false,
              replies: c.replies.map((r) => ({
                ...r,
                isLiked: likes?.some((l) => l.commentId === r.id) ?? false,
              })),
            })),
          ratings,
        },
      }
    }),
  getShow: publicProcedure
    .input(z.object({ showSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const show = await ctx.prisma.show.findUnique({
        where: { slug: input.showSlug },
        include: {
          episodes: true,
        },
      })
      if (!show) throw new Error('Show not found')
      return show
    }),
  getShows: publicProcedure.query(async ({ ctx }) => {
    // TODO: limit
    const shows = await ctx.prisma.show.findMany()
    return shows
  }),
  addShow: publicProcedure
    .input(z.object({ rssLink: z.string(), slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const parser = new Parser()
      try {
        const feed = await parser.parseURL(input.rssLink)

        // TODO: validate slug
        const show = {
          slug: input.slug,
          title: feed?.title,
          description: feed?.description,
          link: feed?.link,
          feedUrl: feed?.feedUrl,
          imageUrl: feed?.image?.url,
        }
        const showSchema = z.object({
          slug: z.string(),
          title: z.string(),
          description: z.string(),
          link: z.string(),
          feedUrl: z.string(),
          imageUrl: z.string(),
        })
        showSchema.parse(show)

        await ctx.prisma.show.create({
          data: show as z.infer<typeof showSchema>,
        })
        return show as z.infer<typeof showSchema>
      } catch (e) {
        console.error(e)
        return {
          error: true,
          message:
            e instanceof PrismaClientKnownRequestError && e.code == 'P2002'
              ? 'A show with that title already exists'
              : 'There was a problem getting data please email me',
        }
      }
    }),
  addEpisode: publicProcedure
    .input(
      z.object({
        showId: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = input.title
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '')

        // TODO: make sure showId is valid
        await ctx.prisma.episode.create({
          data: { ...input, slug },
        })
        return { error: false }
      } catch (e) {
        console.error(e)
        return {
          error: true,
          message: 'There was a problem adding the episode',
        }
      }
    }),
})
