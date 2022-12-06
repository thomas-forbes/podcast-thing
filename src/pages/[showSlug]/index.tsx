import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Background from '../../components/Background'
import Loading from '../../components/Loading'
import { trpc } from '../../utils/trpc'

export default function Show() {
  const router = useRouter()
  const { showSlug } = router.query
  const {
    data: show,
    isLoading,
    error,
  } = trpc.podcast.getShow.useQuery(
    {
      showSlug: showSlug as string,
    },
    { enabled: typeof showSlug == 'string', retry: 1 }
  )

  if (error?.message == 'Show not found') router.push('/')
  if (!router.isReady || isLoading || show == undefined) return <Loading />
  return (
    <Background mainColumn>
      {/* IMAGE */}
      <div className="relative h-32 w-32 overflow-hidden rounded-md shadow-xl shadow-slate-800">
        <img src={show.imageUrl ?? ''} alt="Podcast Image" />
      </div>
      {/* TEXT */}
      <div className="flex w-full flex-col items-center space-y-4">
        <h1 className="text-center text-4xl font-extrabold">{show.title}</h1>
        {/* TODO: make into 2 lines with expandability */}
        <p className="text-center dark:text-slate-200">{show.description}</p>
      </div>
      {/* EPISODES */}
      <h2 className="text-xl font-bold">Episodes:</h2>
      <div className="flex flex-col items-stretch">
        {show.episodes
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((episode) => (
            <Link
              key={episode.title}
              href={`/${showSlug}/${episode.slug}`}
              className="flex flex-row items-center space-x-4 py-4 px-2"
            >
              <Image
                src={show.imageUrl ?? ''}
                alt="Podcast Image"
                width={64}
                height={64}
                className="flex-shrink-0 overflow-hidden rounded-md shadow-xl shadow-slate-800"
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-bold leading-6">{episode.title}</h3>
                <p className="text-sm leading-6 dark:text-slate-200">
                  {episode.description}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </Background>
  )
}
