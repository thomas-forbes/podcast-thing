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
  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),
})
