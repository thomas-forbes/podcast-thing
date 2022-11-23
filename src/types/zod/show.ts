import * as z from "zod"
import * as imports from "../../../prisma/null"
import { CompleteEpisode, RelatedEpisodeModel } from "./index"

export const ShowModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  link: z.string().nullish(),
  feedUrl: z.string(),
  imageUrl: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteShow extends z.infer<typeof ShowModel> {
  Episode: CompleteEpisode[]
}

/**
 * RelatedShowModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedShowModel: z.ZodSchema<CompleteShow> = z.lazy(() => ShowModel.extend({
  Episode: RelatedEpisodeModel.array(),
}))
