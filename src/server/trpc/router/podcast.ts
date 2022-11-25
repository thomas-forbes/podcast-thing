import { Show } from '@prisma/client'
import Parser from 'rss-parser'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const podcastRouter = router({
  getEpisode: publicProcedure
    .input(z.object({ show: z.string(), episodeId: z.string() }))
    .query(({ input }) => {
      return {
        title:
          'Why you need a single focus (and ditch your portfolio of projects) - Chris Frantz, Loops',
        show: 'IndieBites',
        showNotes:
          "Chris Frantz is your agony aunt for your multiple projects. You've probably got multiple projects and it's just not working out. Chris is here to cut through your excuses and explain why you need to focus on a single thing to turn it into an actual business (and not just a hobby).",
        imgUrl: '/indiebites.png',
        comments: [
          {
            id: '1',
            text: 'This is a comment',
            user: {
              id: '1',
              name: 'Chris',
            },
            replies: [
              {
                id: '3',
                text: 'I disagree',
                user: {
                  id: '3',
                  name: 'Better Chris',
                },
              },
            ],
          },
          {
            id: '2',
            text: 'This is another comment',
            user: {
              id: '2',
              name: 'Chris',
            },
          },
        ],
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return { test: await ctx.prisma.show.findMany() }
  }),
  addShow: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      let parser = new Parser()
      try {
        let feed = await parser.parseURL(input)

        const show = {
          title: feed?.title,
          description: feed?.description,
          link: feed?.link,
          feedUrl: feed?.feedUrl,
          imageUrl: feed?.image?.url,
        }
        const ValidShow = z.object({
          title: z.string(),
          description: z.string(),
          link: z.string(),
          feedUrl: z.string(),
          imageUrl: z.string(),
        })
        ValidShow.parse(show)

        console.log(show)
        await ctx.prisma.show.create({
          data: show as Show,
        })
        return show as z.infer<typeof ValidShow>
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
