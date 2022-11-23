import * as z from "zod"
import * as imports from "../../../prisma/null"
import { CompleteShow, RelatedShowModel, CompleteComment, RelatedCommentModel } from "./index"

export const EpisodeModel = z.object({
  id: z.string(),
  showId: z.string(),
  title: z.string(),
  showNotes: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteEpisode extends z.infer<typeof EpisodeModel> {
  show: CompleteShow
  Comment: CompleteComment[]
}

/**
 * RelatedEpisodeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEpisodeModel: z.ZodSchema<CompleteEpisode> = z.lazy(() => EpisodeModel.extend({
  show: RelatedShowModel,
  Comment: RelatedCommentModel.array(),
}))
