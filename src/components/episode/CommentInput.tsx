// @ts-expect-error the lib is not typed
import MicRecorder from 'mic-recorder-to-mp3'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useContext, useEffect, useRef, useState } from 'react'
import {
  FaMicrophone,
  FaPause,
  FaPlay,
  FaStopCircle,
  FaTrash,
} from 'react-icons/fa'
import TextareaAutosize from 'react-textarea-autosize'
import { useCookie } from 'react-use'
import { DataContext } from '../../pages/[showSlug]/[episodeSlug]'
import { trpc } from '../../utils/trpc'
import Spinner from '../Spinner'

interface props {
  reply?: boolean
  replyToId?: string
  episodeId: string
}

const Mp3Recorder = new MicRecorder({ bitRate: 128 })
export default function CommentInput({
  reply = false,
  replyToId,
  episodeId,
}: props) {
  const router = useRouter()
  const addComment = trpc.interactions.addComment.useMutation()
  const { data: session } = useSession()

  const [commentCookie, updateCommentCookie, deleteCookie] = useCookie(
    `${episodeId + (replyToId ?? '')}-comment`
  )
  const [commentText, setCommentText] = useState<string>(commentCookie || '')
  const [isRecording, setIsRecording] = useState(false)
  const [recURL, setRecURL] = useState<string | null>(null)

  const { refetch } = useContext(DataContext)

  const startRecording = async () => {
    setIsRecording(true)
    Mp3Recorder.start().catch((e: Error) => console.error(e))
  }
  const stopRecording = async () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([_, blob]: [Buffer, Blob]) => {
        setRecURL(URL.createObjectURL(blob))
        setIsRecording(false)
      })
      .catch((e: Error) => console.log(e))
  }
  return (
    <div className={`w-full ${reply && 'ml-4'}`}>
      {/* {recURL && <audio src={recURL} controls />} */}
      {/* RECORD / STOP */}
      <button
        onClick={() => (isRecording ? stopRecording() : startRecording())}
        className={`flex w-full appearance-none flex-row items-center justify-center space-x-1 rounded-t-md py-2 px-3 text-zinc-100 outline-offset-2 transition duration-200 active:text-zinc-100/80 active:transition-none dark:active:text-zinc-100/70 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-400 active:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:active:bg-red-700'
            : 'bg-green-600 hover:bg-green-500 active:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 dark:active:bg-green-700'
        }`}
      >
        <div className="text-lg">
          {isRecording ? <FaStopCircle /> : <FaMicrophone />}
        </div>
        <p className="text-sm font-semibold">
          {isRecording ? 'Stop' : 'Record'}
        </p>
      </button>
      {/* TEXT BOX */}
      {recURL ? (
        <VoiceWave src={recURL || ''} trash={() => setRecURL(null)} />
      ) : (
        <TextareaAutosize
          className="w-full resize-none appearance-none border-x border-zinc-900/10 bg-white p-3 shadow-md shadow-zinc-800/5 transition-colors placeholder:text-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500"
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value)
            updateCommentCookie(e.target.value)
          }}
          placeholder="Comment..."
          minRows={reply ? 1 : 3}
        />
      )}
      {/* TODO: save user text while they sign up maybe save in url param */}
      <button
        onClick={
          session?.user
            ? async () => {
                await addComment.mutateAsync({
                  episodeSlug: (router.query.episodeSlug as string) ?? '',
                  podcastSlug: (router.query.podcastSlug as string) ?? '',
                  text: commentText,
                  ...(reply && { replyToId }),
                })
                refetch()
                setCommentText('')
                deleteCookie()
              }
            : () => signIn()
        }
        disabled={commentText.length === 0 || addComment.isLoading}
        className="-mt-1 flex w-full items-center justify-center rounded-b-md bg-zinc-500 py-2 px-3 text-sm font-semibold text-zinc-100 outline-offset-2 transition enabled:hover:bg-zinc-400 enabled:active:bg-zinc-500 enabled:active:text-zinc-100/80 enabled:active:transition-none disabled:opacity-60 dark:bg-zinc-700 enabled:dark:hover:bg-zinc-600 enabled:dark:active:bg-zinc-700 enabled:dark:active:text-zinc-100/70"
      >
        {addComment.isLoading ? <Spinner /> : reply ? 'Reply' : 'Comment'}
      </button>
    </div>
  )
}

const VoiceWave = ({ src, trash }: { src: string; trash: () => void }) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const hasMounted = useRef(false)

  useEffect(() => {
    if (hasMounted.current == false) {
      const initWave = async () => {
        const WaveSurfer = (await import('wavesurfer.js')).default

        const tWavesurfer = WaveSurfer.create({
          container: '#waveform',
          waveColor: '#a1a1aa',
          progressColor: '#e4e4e7',
          barWidth: 4,
          barRadius: 4,
          cursorWidth: 1,
          height: 50,
          barGap: 3,
          barMinHeight: 5,
          cursorColor: 'transparent',
          normalize: true,
          interact: false,
        })
        tWavesurfer.on('finish', () => setIsPlaying(false))
        tWavesurfer.on('play', () => setIsPlaying(true))
        tWavesurfer.on('pause', () => setIsPlaying(false))
        tWavesurfer.on('ready', () => setIsPlaying(false))
        setWavesurfer(tWavesurfer)
      }

      initWave()
      return () => {
        hasMounted.current = true
      }
    }
  }, [])

  useEffect(() => {
    if (wavesurfer && src) wavesurfer.load(src)
  }, [wavesurfer, src])

  return (
    <div className="flex w-full appearance-none flex-row items-center space-x-4 border-x border-zinc-900/10 bg-white p-3 shadow-md shadow-zinc-800/5 transition-colors placeholder:text-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500">
      <button
        className="p-1 dark:text-zinc-200 dark:hover:text-zinc-300 dark:active:text-zinc-200"
        onClick={() => wavesurfer?.playPause()}
        disabled={!src}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <div id="waveform" className="flex-1"></div>
      <button
        className="p-1 dark:text-zinc-200 dark:hover:text-zinc-300 dark:active:text-zinc-200"
        onClick={() => {
          trash()
          wavesurfer?.empty()
        }}
      >
        <FaTrash />
      </button>
    </div>
  )
}
