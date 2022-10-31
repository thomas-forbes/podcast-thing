import TextareaAutosize from 'react-textarea-autosize'
import { trpc } from '../utils/trpc'

export default function Home() {
  const hello = trpc.example.hello.useQuery({ text: 'from tRPC' })

  const podcast = {
    title:
      'Why you need a single focus (and ditch your portfolio of projects) - Chris Frantz, Loops',
    show: 'IndieBites',
    showNotes:
      "Chris Frantz is your agony aunt for your multiple projects. You've probably got multiple projects and it's just not working out. Chris is here to cut through your excuses and explain why you need to focus on a single thing to turn it into an actual business (and not just a hobby).",
    imgUrl: '/indiebites.png',
  }

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
          {/* COMMENT */}
          <div className="flex w-full flex-col space-y-4">
            <TextareaAutosize
              className="text-md w-full resize-none appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md  shadow-zinc-800/5 transition-colors placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-sky-400 dark:focus:ring-sky-400/10"
              placeholder="Comment..."
              minRows={3}
            />
            <button className="w-full rounded-md bg-zinc-500 py-2 px-3 text-sm font-semibold text-zinc-100 outline-offset-2 transition hover:bg-zinc-400 active:bg-zinc-500 active:text-zinc-100/80 active:transition-none dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70">
              Comment
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
