import { useState } from 'react'
import Background from '../components/Background'
import Question from '../components/Question'
import { trpc } from '../utils/trpc'

export default function AddPodcast() {
  const addEpisode = trpc.podcast.addEpisode.useMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  return (
    <Background mainColumn className="max-w-4xl">
      <h1 className="text-center text-5xl font-bold">
        Enter Episode Information
      </h1>
      {/* QUESTIONS */}
      <div className="flex w-full max-w-lg flex-col space-y-4">
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
          className="rounded-md bg-sky-500 py-2 px-4 text-lg font-semibold text-sky-100 outline-offset-2 transition hover:bg-sky-400 active:bg-sky-500 active:text-sky-100/80 active:transition-none dark:bg-sky-600 dark:hover:bg-sky-500 dark:active:bg-sky-600 dark:active:text-sky-100/70"
          onClick={() =>
            addEpisode.mutate({
              title,
              description,
              showId: 'clawgppts0002wupu3az3tu97',
            })
          }
        >
          Add
        </button>
      </div>
      {/* SERVER RESPONSE */}
      <p>
        {addEpisode.isLoading
          ? 'Loading...'
          : addEpisode.data?.error
          ? addEpisode.data.message
          : addEpisode.data?.error == false
          ? 'Success!'
          : null}
      </p>
    </Background>
  )
}
