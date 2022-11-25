import Parser from 'rss-parser'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const podcastRouter = router({
  getEpisode: publicProcedure
    .input(z.object({ show: z.string(), episode: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const show = await ctx.prisma.show.findUnique({
          where: { title: input.show },
        })
        if (!show) throw new Error('Show not found')

        const episode = await ctx.prisma.episode.findFirst({
          where: { AND: [{ title: input.episode }, { showId: show.id }] },
        })
        if (!episode) throw new Error('Episode not found')

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
      let parser = new Parser()
      try {
        let feed = await parser.parseURL(input.rssLink)
        console.log(JSON.stringify(feed))

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
        await ctx.prisma.episode.create({
          data: input,
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
