import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import TextareaAutosize from 'react-textarea-autosize'

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
            {['Overall', 'Content', 'Production'].map((label) => (
              <div className="flex w-11/12 flex-row items-center justify-between">
                {/* LABEL */}
                <p className="flex-1 dark:text-white">{label}:</p>
                {/* STARS */}
                <div className="flex flex-1 flex-row items-center justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button className="appearance-none p-1 text-3xl text-yellow-500">
                      {rating <= 3 ? <AiFillStar /> : <AiOutlineStar />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* TODO: add ability to answer host questions */}
          {/* COMMENTS */}
          <div className="flex w-full flex-col items-center space-y-4">
            {/* HEADING */}
            <h2 className="text-xl font-bold dark:text-white">Comments</h2>
            {/* BOX */}
            <div>
              <TextareaAutosize
                // className="text-md w-full resize-none appearance-none rounded-t-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 transition-colors placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-sky-400 dark:focus:ring-sky-400/10"
                className="text-md w-full resize-none appearance-none rounded-t-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 transition-colors placeholder:text-zinc-400 focus:outline-none   dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500"
                placeholder="Comment..."
                minRows={3}
              />
              <button className="-mt-1 w-full rounded-b-md bg-zinc-500 py-2 px-3 text-sm font-semibold text-zinc-100 outline-offset-2 transition hover:bg-zinc-400 active:bg-zinc-500 active:text-zinc-100/80 active:transition-none dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70">
                Comment
              </button>
            </div>
            {/* COMMENTS */}
            <div className="flex w-full flex-col space-y-4">
              {podcast.comments.map((comment) => (
                <div className="flex w-full flex-col space-y-4">
                  {/* OG COMMENT */}
                  <div className="flex w-full flex-col space-y-1">
                    {/* NAME */}
                    <div className="flex items-center space-x-2">
                      {/* <div className="h-8 w-8 rounded-full bg-white" /> */}
                      <p className="text-sm font-bold dark:text-white">
                        {comment.user.name}
                      </p>
                    </div>
                    {/* TEXT */}
                    <div>
                      <p className="text-sm dark:text-zinc-200">
                        {comment.text}
                      </p>
                    </div>
                    {/* BOTTOM ACTIONS */}
                    <div className="flex flex-row items-center space-x-2 dark:text-zinc-400">
                      <button className="appearance-none py-1 text-sm">
                        {true ? <FaRegHeart /> : <FaHeart />}
                      </button>
                      <button className="appearance-none text-xs font-bold">
                        Reply
                      </button>
                      <button className="appearance-none text-xs font-bold">
                        Report
                      </button>
                    </div>
                  </div>
                  {/* REPLIES */}
                  <div className="ml-4 flex flex-col">
                    {comment?.replies?.map((reply) => (
                      <div className="flex w-full flex-col space-y-1">
                        {/* NAME */}
                        <div className="flex items-center space-x-2">
                          {/* <div className="h-8 w-8 rounded-full bg-white" /> */}
                          <p className="text-sm font-bold dark:text-white">
                            {reply.user.name}
                          </p>
                        </div>
                        {/* TEXT */}
                        <div>
                          <p className="text-sm dark:text-zinc-200">
                            {reply.text}
                          </p>
                        </div>
                        {/* BOTTOM ACTIONS */}
                        <div className="flex flex-row items-center space-x-2 dark:text-zinc-400">
                          <button className="appearance-none py-1 text-sm">
                            {true ? <FaRegHeart /> : <FaHeart />}
                          </button>
                          <button className="appearance-none text-xs font-bold">
                            Reply
                          </button>
                          <button className="appearance-none text-xs font-bold">
                            Report
                          </button>
                        </div>
                      </div>
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
