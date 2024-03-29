import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import Background from '../components/Background'
import Loading from '../components/Loading'
import StyledLink from '../components/StyledLink'
import { trpc } from '../utils/trpc'

export default function Home() {
  const { data: shows, isLoading } = trpc.podcast.getShows.useQuery()

  if (isLoading || shows === undefined) return <Loading />
  return (
    <>
      <NextSeo title={'Pod Thing'} />
      <Background mainColumn>
        <h1 className="text-3xl font-extrabold">Home</h1>
        <div className="flex flex-col items-stretch">
          {shows
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((show) => (
              <Link
                key={show.title}
                href={`/${show.slug}`}
                className="flex flex-row items-center space-x-4 py-4 px-2"
              >
                <Image
                  src={show.imageUrl ?? ''}
                  alt="Podcast Image"
                  width={96}
                  height={96}
                  className="flex-shrink-0 overflow-hidden rounded-md shadow-xl shadow-slate-800"
                />
                <div className="flex flex-col space-y-2">
                  <h3 className="text-2xl font-bold leading-6">{show.title}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-200">
                    {show.description}
                  </p>
                </div>
              </Link>
            ))}
        </div>
        <div className="flex flex-row items-center space-x-4">
          <StyledLink href="/addShow">Create Show</StyledLink>
          <StyledLink href="/addEpisode">Create Episode</StyledLink>
        </div>
      </Background>
    </>
  )
}
