// src/server/trpc/router/_app.ts
import { router } from '../trpc'
import { authRouter } from './auth'
import { interactionRouter } from './interactions'
import { podcastRouter } from './podcast'

export const appRouter = router({
  podcast: podcastRouter,
  auth: authRouter,
  interactions: interactionRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
