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
    .input(z.object({ commentId: z.string(), add: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: { id: input.commentId },
        select: { episodeId: true },
      })
      if (!comment) throw 'Comment not found'

      if (input.add) {
        await ctx.prisma.like.create({
          data: {
            commentId: input.commentId,
            episodeId: comment.episodeId,
            userId: ctx.session.user.id,
          },
        })
      } else {
        await ctx.prisma.like.delete({
          where: {
            userId_commentId: {
              userId: ctx.session.user.id,
              commentId: input.commentId,
            },
          },
        })
      }
      // return
    }),
  addRating: protectedProcedure
    .input(
      z.object({
        episodeSlug: z.string(),
        showSlug: z.string(),
        rating: z.number().min(0).max(4),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const episode = await ctx.prisma.episode.findUnique({
        where: { slug: input.episodeSlug },
      })
      if (!episode) throw 'Episode not found'

      await ctx.prisma.rating.delete({
        where: {
          userId_episodeId_type: {
            userId: ctx.session.user.id,
            episodeId: episode.id,
            type: input.type,
          },
        },
      })
      const rating = await ctx.prisma.rating.create({
        data: {
          userId: ctx.session.user.id,
          episodeId: episode.id,
          rating: input.rating,
          type: input.type,
        },
      })
      console.log(rating)
      return rating
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
