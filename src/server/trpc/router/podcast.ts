import Parser from 'rss-parser'
import { z } from 'zod'
import { Slugify } from '../../../utils/funcs'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const podcastRouter = router({
  getEpisode: publicProcedure
    .input(z.object({ showSlug: z.string(), episodeSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const show = await ctx.prisma.show.findUnique({
        where: { slug: input.showSlug },
      })
      if (!show) throw new Error('Show not found')

      const episode = await ctx.prisma.episode.findUnique({
        where: { showId_slug: { showId: show.id, slug: input.episodeSlug } },
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
        id: episode.id,
        title: episode.title,
        description: episode.description,
        imageUrl: show.imageUrl,
        comments: episode.comments
          .filter((c) => !c.replyToId)
          .map((c) => ({
            ...c,
            ...(c.deleted && {
              text: '[deleted]',
              userId: '',
              user: {
                ...c.user,
                id: 'deleted',
                name: '[deleted]',
                image: null,
              },
            }),
            isLiked: likes?.some((l) => l.commentId === c.id) ?? false,
            replies: c.replies.map((r) => ({
              ...r,
              isLiked: likes?.some((l) => l.commentId === r.id) ?? false,
            })),
          })),
        ratings,
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
  getOwnedShows: protectedProcedure.query(async ({ ctx }) => {
    const shows = await ctx.prisma.show.findMany({
      where: { ownerId: ctx.session.user.id },
    })
    return shows
  }),
  addShow: protectedProcedure
    .input(z.object({ rssLink: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const parser = new Parser()
      const feed = await parser.parseURL(input.rssLink)

      // TODO: validate slug
      const show = z
        .object({
          slug: z.string(),
          title: z.string(),
          description: z.string(),
          link: z.string(),
          feedUrl: z.string(),
          imageUrl: z.string(),
          ownerId: z.string(),
        })
        .parse({
          slug: Slugify(feed?.title ?? ''),
          title: feed?.title,
          description: feed?.description,
          link: feed?.link,
          feedUrl: feed?.feedUrl,
          imageUrl: feed?.image?.url,
          ownerId: ctx.session.user.id,
        })

      await ctx.prisma.show.create({
        data: show,
      })
      return show
    }),
  addEpisode: protectedProcedure
    .input(
      z.object({
        showId: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const show = await ctx.prisma.show.findUnique({
        where: { id: input.showId },
      })
      if (!show) throw new Error('Show not found')
      if (show.ownerId !== ctx.session.user.id) throw new Error('Unauthorised')

      const slug = Slugify(input.title)
      // TODO: make sure showId is valid
      const episode = await ctx.prisma.episode.create({
        data: { ...input, slug },
      })
      return episode
    }),
})
