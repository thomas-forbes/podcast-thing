import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const interactionRouter = router({
  addComment: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        episodeSlug: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const episode = await ctx.prisma.episode.findUnique({
          where: { slug: input.episodeSlug },
        })
        if (!episode) throw 'Episode not found'

        const comment = await ctx.prisma.comment.create({
          data: {
            userId: input.userId,
            episodeId: episode.id,
            text: input.text,
          },
        })
        console.log(comment)
        return { error: false, data: comment }
      } catch (e) {
        console.error(e)
        return {
          error: false,
          message:
            e instanceof Error
              ? e.message
              : 'There was an error creating your comment',
        }
      }
    }),
})
