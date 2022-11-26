import Parser from 'rss-parser'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const podcastRouter = router({
  getEpisode: publicProcedure
    .input(z.object({ showSlug: z.string(), episodeSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const show = await ctx.prisma.show.findUnique({
          where: { slug: input.showSlug },
        })
        if (!show) throw new Error('Show not found')

        const episode = await ctx.prisma.episode.findUnique({
          where: { slug: input.episodeSlug },
          include: { Comment: true },
        })
        if (!episode) throw new Error('Episode not found')
        console.log(episode)

        return {
          error: false,
          data: {
            title: episode.title,
            description: episode.description,
            imgUrl: show.imageUrl,
          },
        }
      } catch (e: any) {
        console.error(e)
        return { error: true, message: e?.message, data: {} }
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return { test: await ctx.prisma.show.findMany() }
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
      } catch (e: any) {
        console.error(e)
        return {
          error: true,
          message:
            e?.code == 'P2002'
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
      } catch (e: any) {
        console.log(e)
        return {
          error: true,
          message: 'There was a problem adding the episode',
        }
      }
    }),
})
