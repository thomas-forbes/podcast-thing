import { NextSeo } from 'next-seo'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { MdIosShare } from 'react-icons/md'
import Background from '../../components/Background'
import CommentInput from '../../components/episode/CommentInput'
import Ratings from '../../components/episode/Ratings'
import WholeComment from '../../components/episode/WholeComment'
import Loading from '../../components/Loading'
import { trpc } from '../../utils/trpc'

export const DataContext = React.createContext<{
  refetch: () => Promise<any>
  isLoading: boolean
  isRefetching: boolean
}>({
  refetch: async () => {
    new Promise((resolve) => resolve(''))
  },
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
      refetchInterval: 1000 * 30,
    }
  )

  if (error?.message == 'Episode not found') router.push(`/${showSlug}`)
  else if (error?.message == 'Show not found') router.push('/')

  if (!router.isReady || isLoading || episode == undefined) return <Loading />
  return (
    <>
      <NextSeo title={episode.title} description={episode.description ?? ''} />
      <DataContext.Provider value={{ refetch, isLoading, isRefetching }}>
        <Background mainColumn>
          {/* IMAGE */}
          <Image
            src={episode.imageUrl}
            alt="Podcast Image"
            width={128}
            height={128}
            className="overflow-hidden rounded-md shadow-xl shadow-slate-800"
          />
          {/* TEXT */}
          <div className="flex w-full flex-col items-center space-y-4">
            <h1 className="text-center text-2xl font-extrabold">
              {episode.title}
            </h1>
            {/* make into 2 lines with expandability */}
            <p className="text-center text-slate-700 dark:text-slate-200">
              {episode.description}
            </p>
          </div>
          {/* RATING */}
          <div className="flex w-full flex-col items-center space-y-4">
            {/* HEADING */}
            <h2 className="text-xl font-bold">Ratings</h2>
            {/* RATINGS */}
            <Ratings ratings={episode.ratings} />
          </div>
          {/* TODO: add ability to answer host questions */}
          {/* COMMENTS */}
          <div className="flex w-full flex-col items-center space-y-4">
            {/* HEADING */}
            <h2 className="text-xl font-bold">Comments</h2>
            {/* INPUT */}
            <CommentInput episodeId={episode.id ?? ''} />
            {/* COMMENTS */}
            <div className="flex w-full flex-col space-y-4">
              {episode.comments
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((comment) => (
                  <WholeComment
                    key={comment.id}
                    episodeId={episode.id ?? ''}
                    comment={comment}
                  />
                ))}
            </div>
          </div>
          {/* SHARE */}
          <button
            className="fixed bottom-4 right-4 flex flex-row items-center justify-center space-x-1 rounded-full bg-zinc-500 py-2 px-3 text-sm font-bold text-zinc-100 outline-offset-2 transition enabled:hover:bg-zinc-400 enabled:active:bg-zinc-500 enabled:active:text-zinc-100/80 enabled:active:transition-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-700 enabled:dark:hover:bg-zinc-600 enabled:dark:active:bg-zinc-700 enabled:dark:active:text-zinc-100/70"
            onClick={
              'share' in navigator
                ? () =>
                    navigator?.share({
                      url: window.location.href,
                    })
                : () => navigator.clipboard.writeText(window.location.href)
            }
          >
            <MdIosShare className="text-lg" />
            <span>{'share' in navigator ? 'Share' : 'Copy Link'}</span>
          </button>
        </Background>
      </DataContext.Provider>
    </>
  )
}
