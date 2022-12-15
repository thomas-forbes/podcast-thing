import { Combobox } from '@headlessui/react'
import { Show } from '@prisma/client'
import Fuse from 'fuse.js'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { NextSeo } from 'next-seo'
import { Dispatch, SetStateAction, useState } from 'react'
import Background from '../components/Background'
import Loading from '../components/Loading'
import Question from '../components/Question'
import StyledLink from '../components/StyledLink'
import { getServerAuthSession } from '../server/common/get-server-auth-session'
import { trpc } from '../utils/trpc'

export default function AddPodcast() {
  const { data: shows } = trpc.podcast.getOwnedShows.useQuery()
  const addEpisode = trpc.podcast.addEpisode.useMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selPod, setSelPod] = useState<Show | undefined>(shows?.[0])

  if (shows === undefined) return <Loading />
  return (
    <>
      <NextSeo title="Add Episode" />
      <Background mainColumn className="max-w-4xl">
        <h1 className="text-center text-5xl font-bold">
          Enter Episode Information
        </h1>
        {/* QUESTIONS */}
        <div className="flex w-full max-w-lg flex-col space-y-4">
          {/* PODCAST */}
          <SearchPods selPod={selPod} setSelPod={setSelPod} shows={shows} />
          {/* Title */}
          <Question
            label="Title"
            value={title}
            setValue={setTitle}
            placeholder={'Amazing podcast...'}
          />
          <Question
            label="Description"
            value={description}
            setValue={setDescription}
            placeholder="In this episode..."
            textArea
            minRows={3}
          />
          {/* ADD */}
          <button
            className="rounded-md bg-sky-500 py-2 px-4 text-lg font-semibold text-sky-100 outline-offset-2 transition active:transition-none enabled:hover:bg-sky-400 enabled:active:bg-sky-500 enabled:active:text-sky-100/80 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-600 enabled:dark:hover:bg-sky-500 enabled:dark:active:bg-sky-600 enabled:dark:active:text-sky-100/70"
            disabled={addEpisode.isLoading || selPod == undefined || !title}
            onClick={() =>
              addEpisode.mutate({
                title,
                description,
                showId: selPod?.id ?? '',
              })
            }
          >
            Add
          </button>
        </div>
        {/* SERVER RESPONSE */}
        <div className="flex flex-col items-center space-y-1">
          <p>
            {addEpisode.isLoading
              ? 'Loading...'
              : addEpisode.isError
              ? addEpisode.error.message || 'Error'
              : addEpisode.data
              ? 'Success!'
              : ''}
          </p>
          {addEpisode.data && (
            <StyledLink href={`/${selPod?.slug}/${addEpisode.data.slug}`}>
              Go to pod
            </StyledLink>
          )}
        </div>
      </Background>
    </>
  )
}

const SearchPods = ({
  selPod,
  setSelPod,
  shows,
}: {
  selPod: Show | undefined
  setSelPod: Dispatch<SetStateAction<Show | undefined>>
  shows: Show[]
}) => {
  const [query, setQuery] = useState('')
  const fuse = new Fuse(shows, {
    keys: ['title'],
  })
  return (
    <Combobox value={selPod} onChange={setSelPod}>
      <Combobox.Input
        className="w-full rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 transition-colors duration-300 placeholder:text-zinc-400 focus:border-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-600/10 dark:border-zinc-600 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500"
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(show: Show) => show?.title}
        placeholder="Podcast..."
      />
      <Combobox.Options className="w-full rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 transition-colors duration-300 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700/[0.15] dark:text-zinc-200">
        {(query.trim()
          ? fuse.search(query).map(({ item }) => item)
          : shows
        ).map((show) => (
          <Combobox.Option
            key={show.id}
            value={show}
            className="cursor-pointer p-1"
          >
            {show.title}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx)
  if (!session?.user) {
    return {
      redirect: {
        destination:
          '/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2FaddEpisode',
        permanent: false,
      },
    }
  }
  return { props: {} }
}
