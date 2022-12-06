import { useRouter } from 'next/router'
import Background from '../../components/Background'
import Loading from '../../components/Loading'
import { trpc } from '../../utils/trpc'

export default function Show() {
  const router = useRouter()
  const { showSlug } = router.query
  const { data: show, isLoading } = trpc.podcast.getShow.useQuery(
    {
      showSlug: showSlug as string,
    },
    { enabled: typeof showSlug == 'string' }
  )
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
      <div className="flex flex-col items-stretch space-y-4">
        {show.episodes.map((episode) => (
          <div
            key={episode.title}
            className="flex flex-row items-center space-x-4"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-md shadow-xl shadow-slate-800">
              <img src={show.imageUrl ?? ''} alt="Podcast Image" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">{episode.title}</h3>
              <p className="text-sm">{episode.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Background>
  )
}
