import { useState } from 'react'
import Background from '../components/Background'
import { trpc } from '../utils/trpc'

export default function AddPodcast() {
  const [rssLink, setRssLink] = useState('')
  const addPod = trpc.podcast.addPodcast.useMutation()
  return (
    <Background mainColumn className="max-w-4xl">
      <h1 className="text-center text-5xl font-bold dark:text-white">
        Enter Podcast Information
      </h1>
      {/* RSS */}
      <div className="flex w-full max-w-lg flex-col space-y-4">
        {/* RSS LINK */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold dark:text-slate-200">
            RSS Link
          </h2>
          <input
            className="w-full rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 transition-colors duration-300 placeholder:text-zinc-400 focus:border-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-600/10 dark:border-zinc-600 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500"
            placeholder="https://example.com/rss"
            value={rssLink}
            onChange={(e) => setRssLink(e.target.value)}
          />
        </div>
        {/* ADD */}
        <button
          className="rounded-md bg-sky-500 py-2 px-4 text-lg font-semibold text-sky-100 outline-offset-2 transition hover:bg-sky-400 active:bg-sky-500 active:text-sky-100/80 active:transition-none dark:bg-sky-600 dark:hover:bg-sky-500 dark:active:bg-sky-600 dark:active:text-sky-100/70"
          onClick={() => addPod.mutate(rssLink)}
        >
          Add
        </button>
      </div>
      {addPod.data?.error ? (
        <p className="dark:text-white">{addPod.data.error}</p>
      ) : addPod.data ? (
        <div className="flex flex-col items-center">
          <h2 className="dark:text-white">We got this information</h2>
          {Object.keys(addPod.data).map((key) => (
            <p className="dark:text-white">
              {key}: {addPod.data[key]}
            </p>
          ))}
        </div>
      ) : null}
    </Background>
  )
}
