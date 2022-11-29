import { FaHeart, FaRegHeart } from 'react-icons/fa'

interface props {
  comment: {
    text: string
    id: string
    name: string
  }
  onReply?: () => void
  isReplying?: boolean
}

export default function CommentBox({
  comment,
  onReply,
  isReplying = false,
}: props) {
  return (
    <div className="flex w-full flex-col space-y-1">
      <div className="flex flex-row space-x-2">
        {/* NAME */}
        <div className="h-5 w-5 rounded-full bg-white" />
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-bold">{comment.name}</p>
          {/* TEXT */}
          <p className="text-sm dark:text-zinc-200">{comment.text}</p>
        </div>
      </div>
      {/* BOTTOM ACTIONS */}
      <div className="flex flex-row items-center space-x-2 text-zinc-500/80 dark:text-zinc-400">
        <button className="appearance-none py-1 text-sm">
          {true ? <FaRegHeart /> : <FaHeart className="text-red-500" />}
        </button>
        <button className="appearance-none text-xs font-bold" onClick={onReply}>
          {isReplying ? 'Cancel' : 'Reply'}
        </button>
        <button className="appearance-none text-xs font-bold">Report</button>
      </div>
    </div>
  )
}
