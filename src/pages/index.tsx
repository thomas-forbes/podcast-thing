// @ts-expect-error the lib is not typed
import MicRecorder from 'mic-recorder-to-mp3'
import { useEffect, useRef, useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import {
  FaHeart,
  FaMicrophone,
  FaPause,
  FaPlay,
  FaRegHeart,
  FaStopCircle,
  FaTrash,
} from 'react-icons/fa'
import TextareaAutosize from 'react-textarea-autosize'

interface Comment {
  label: string
  rating: number
}

export default function Home() {
  // const hello = trpc.example.hello.useQuery({ text: 'from tRPC' })
  const podcast = {
    title:
      'Why you need a single focus (and ditch your portfolio of projects) - Chris Frantz, Loops',
    show: 'IndieBites',
    showNotes:
      "Chris Frantz is your agony aunt for your multiple projects. You've probably got multiple projects and it's just not working out. Chris is here to cut through your excuses and explain why you need to focus on a single thing to turn it into an actual business (and not just a hobby).",
    imgUrl: '/indiebites.png',
    comments: [
      {
        id: '1',
        text: 'This is a comment',
        user: {
          id: '1',
          name: 'Chris',
        },
        replies: [
          {
            id: '3',
            text: 'I disagree',
            user: {
              id: '3',
              name: 'Better Chris',
            },
          },
        ],
      },
      {
        id: '2',
        text: 'This is another comment',
        user: {
          id: '2',
          name: 'Chris',
        },
      },
    ],
  }

  const [ratings, setRatings] = useState<Comment[]>([
    { label: 'Overall', rating: -1 },
    { label: 'Content', rating: -1 },
    { label: 'Production', rating: -1 },
  ])

  return (
    <>
      {/* BG */}
      <div className="flex min-h-screen flex-col items-center bg-white p-8 dark:bg-zinc-900">
        {/* MAIN COL */}
        <div className="flex w-full max-w-lg flex-col items-center space-y-8">
          {/* IMAGE */}
          <div className="relative h-32 w-32 overflow-hidden">
            <img src={podcast.imgUrl} />
            {/* TEXT */}
          </div>
          <div className="flex w-full flex-col items-center space-y-4">
            <h1 className="text-center text-2xl font-extrabold dark:text-white">
              {podcast.title}
            </h1>
            {/* make into 2 lines with expandability */}
            <p className="text-center dark:text-slate-200">
              {podcast.showNotes}
            </p>
          </div>
          {/* RATING */}
          <div className="flex w-full flex-col items-center space-y-4">
            {/* HEADING */}
            <h2 className="text-xl font-bold dark:text-white">Ratings</h2>
            {/* RATINGS */}
            {ratings.map(({ label, rating }) => (
              <Rating
                key={label}
                label={label}
                rating={rating}
                setRating={(r) =>
                  setRatings((ratings: Comment[]) => {
                    const nRatings = [...ratings]
                    const index = ratings.findIndex((r) => r.label === label)
                    nRatings[index]!.rating = r
                    return nRatings
                  })
                }
              />
            ))}
          </div>
          {/* TODO: add ability to answer host questions */}
          {/* COMMENTS */}
          <div className="flex w-full flex-col items-center space-y-4">
            {/* HEADING */}
            <h2 className="text-xl font-bold dark:text-white">Comments</h2>
            {/* BOX */}
            <CommentBox />
            {/* COMMENTS */}
            <div className="flex w-full flex-col space-y-4">
              {podcast.comments.map((comment) => (
                <div
                  key={'comment:' + comment.id}
                  className="flex w-full flex-col space-y-4"
                >
                  {/* OG COMMENT */}
                  <Comment comment={comment} />
                  {/* REPLIES */}
                  <div className="ml-4 flex flex-col">
                    {comment?.replies?.map((reply) => (
                      <Comment key={'reply:' + reply.id} comment={reply} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Mp3Recorder = new MicRecorder({ bitRate: 128 })
const CommentBox = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [recURL, setRecURL] = useState<string | null>(null)

  const startRecording = async () => {
    setIsRecording(true)
    Mp3Recorder.start().catch((e: Error) => console.error(e))
  }
  const stopRecording = async () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([_, blob]: [any, Blob]) => {
        setRecURL(URL.createObjectURL(blob))
        setIsRecording(false)
      })
      .catch((e: Error) => console.log(e))
  }
  return (
    <div className="w-full">
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
          className="w-full resize-none appearance-none border-x border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 transition-colors placeholder:text-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500"
          placeholder="Comment..."
          minRows={3}
        />
      )}
      <button className="-mt-1 w-full rounded-b-md bg-zinc-500 py-2 px-3 text-sm font-semibold text-zinc-100 outline-offset-2 transition hover:bg-zinc-400 active:bg-zinc-500 active:text-zinc-100/80 active:transition-none dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70">
        Comment
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

const Rating = ({
  label,
  rating,
  setRating,
}: {
  label: string
  rating: number
  setRating: (rating: number) => void
}) => (
  <div className="flex w-11/12 flex-row items-center justify-between">
    {/* MAYBE https://mui.com/material-ui/react-rating/#main-content */}
    {/* LABEL */}
    <p className="flex-1 dark:text-white">{label}:</p>
    {/* STARS */}
    <div className="flex flex-1 flex-row items-center justify-center">
      {[...Array(5)].map((_, i) => (
        <button
          className="appearance-none p-1 text-3xl text-yellow-500 duration-75"
          key={label + i}
          onClick={() => setRating(i == rating ? -1 : i)}
        >
          {i <= rating ? <AiFillStar /> : <AiOutlineStar />}
        </button>
      ))}
    </div>
  </div>
)

const Comment = ({
  comment,
}: {
  comment: { user: { name: string; id: string }; text: string }
}) => (
  <div className="flex w-full flex-col space-y-1">
    <div className="flex flex-row space-x-2">
      {/* NAME */}
      <div className="h-5 w-5 rounded-full bg-white" />
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-bold dark:text-white">{comment.user.name}</p>
        {/* TEXT */}
        <p className="text-sm dark:text-zinc-200">{comment.text}</p>
      </div>
    </div>
    {/* BOTTOM ACTIONS */}
    <div className="flex flex-row items-center space-x-2 text-zinc-500/80 dark:text-zinc-400">
      <button className="appearance-none py-1 text-sm">
        {true ? <FaRegHeart /> : <FaHeart className="text-red-500" />}
      </button>
      <button className="appearance-none text-xs font-bold">Reply</button>
      <button className="appearance-none text-xs font-bold">Report</button>
    </div>
  </div>
)
