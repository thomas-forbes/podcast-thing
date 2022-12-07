import { useRouter } from 'next/router'
import React from 'react'
import Background from '../../components/Background'
import CommentInput from '../../components/episode/CommentInput'
import Ratings from '../../components/episode/Ratings'
import WholeComment from '../../components/episode/WholeComment'
import Loading from '../../components/Loading'
import { trpc } from '../../utils/trpc'

export const DataContext = React.createContext<{
  refetch: () => void
  isLoading: boolean
  isRefetching: boolean
}>({
  refetch: () => {},
  isLoading: true,
  isRefetching: false,
})

export default function Episode() {
  const router = useRouter()
  const { showSlug, episodeSlug } = router.query

  const {
    data: episode,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = trpc.podcast.getEpisode.useQuery(
    {
      showSlug: showSlug as string,
      episodeSlug: episodeSlug as string,
    },
    {
      enabled: typeof showSlug == 'string' && typeof episodeSlug == 'string',
      retry: 1,
    }
  )

  if (error?.message == 'Episode not found') router.push(`/${showSlug}`)
  else if (error?.message == 'Show not found') router.push('/')

  if (!router.isReady || isLoading || episode == undefined) return <Loading />
  return (
    <>
      <DataContext.Provider value={{ refetch, isLoading, isRefetching }}>
        <Background mainColumn>
          {/* IMAGE */}
          <div className="relative h-32 w-32 overflow-hidden rounded-md shadow-xl shadow-slate-800">
            <img src={episode.data.imageUrl ?? ''} alt="Podcast Image" />
          </div>
          {/* TEXT */}
          <div className="flex w-full flex-col items-center space-y-4">
            <h1 className="text-center text-2xl font-extrabold">
              {episode.data.title}
            </h1>
            {/* make into 2 lines with expandability */}
            <p className="text-center dark:text-slate-200">
              {episode.data.description}
            </p>
          </div>
          {/* RATING */}
          <div className="flex w-full flex-col items-center space-y-4">
            {/* HEADING */}
            <h2 className="text-xl font-bold">Ratings</h2>
            {/* RATINGS */}
            <Ratings ratings={episode.data.ratings} />
          </div>
          {/* TODO: add ability to answer host questions */}
          {/* COMMENTS */}
          <div className="flex w-full flex-col items-center space-y-4">
            {/* HEADING */}
            <h2 className="text-xl font-bold">Comments</h2>
            {/* INPUT */}
            <CommentInput episodeId={episode.data.id ?? ''} />
            {/* COMMENTS */}
            <div className="flex w-full flex-col space-y-4">
              {episode.data.comments
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((comment) => (
                  <WholeComment
                    key={comment.id}
                    episodeId={episode.data.id ?? ''}
                    comment={comment}
                  />
                ))}
            </div>
          </div>
        </Background>
      </DataContext.Provider>
    </>
  )
}
