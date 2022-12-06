import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const interactionRouter = router({
  addComment: protectedProcedure
    .input(
      z.object({
        episodeSlug: z.string(),
        podcastSlug: z.string(),
        text: z.string(),
        replyToId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: implement podcastSlug and make episode slug not unique.
        // make unique pair episode slug and podcastId
        const episode = await ctx.prisma.episode.findUnique({
          where: { slug: input.episodeSlug },
        })
        if (!episode) throw 'Episode not found'

        const comment = await ctx.prisma.comment.create({
          data: {
            userId: ctx.session.user.id,
            episodeId: episode.id,
            text: input.text,
            replyToId: input.replyToId,
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
  addLike: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const like = await ctx.prisma.like.create({
          data: {
            commentId: input.commentId,
            userId: ctx.session.user.id,
          },
        })

        console.log(like)
        return { error: false, data: like }
      } catch (e) {
        console.error(e)
        return {
          error: false,
          message:
            e instanceof Error
              ? e.message
              : 'There was an error creating your like',
        }
      }
    }),
  deleteComment: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: { id: input.commentId },
      })
      if (!comment) throw 'Comment not found'
      if (comment.userId !== ctx.session.user.id) throw 'Unauthorized'
      return await ctx.prisma.comment.delete({
        where: { id: input.commentId },
      })
    }),
})
