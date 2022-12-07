import { Comment, User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useContext, useState } from 'react'
import { FaHeart, FaRegHeart, FaUserCircle } from 'react-icons/fa'
import { DataContext } from '../../pages/[showSlug]/[episodeSlug]'
import { trpc } from '../../utils/trpc'

interface props {
  comment: Comment & {
    user: User
  }
  onReply?: () => void
  isReplying?: boolean
  isReply?: boolean
}

export default function CommentBox({
  comment,
  onReply,
  isReplying = false,
  isReply = false,
}: props) {
  const addLike = trpc.interactions.addLike.useMutation()
  const deleteComment = trpc.interactions.deleteComment.useMutation()

  const { refetch } = useContext(DataContext)
  const { data: session } = useSession()
  const [deleting, setDeleting] = useState(false)
  return (
    <div className="flex w-full flex-col space-y-1">
      <div className="flex flex-row space-x-2">
        {/* NAME */}
        {comment.user.image ? (
          <Image
            src={comment.user.image}
            alt={`${comment.user.name}'s profile picture`}
            className="h-5 w-5 rounded-full"
            height={20}
            width={20}
          />
        ) : (
          // <div className="h-5 w-5 rounded-full bg-black dark:bg-white" />
          <FaUserCircle className="text-xl" />
        )}
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-bold">{comment.user.name ?? 'No name'}</p>
          {/* TEXT */}
          <p className="text-sm dark:text-zinc-200">{comment.text}</p>
        </div>
      </div>
      {/* BOTTOM ACTIONS */}
      <div className="ml-[2px] flex flex-row items-center space-x-2 text-zinc-500/80 dark:text-zinc-400">
        <button
          className="appearance-none py-1 text-sm"
          onClick={() => addLike.mutate({ commentId: comment.id })}
        >
          {true ? <FaRegHeart /> : <FaHeart className="text-red-500" />}
        </button>
        {!isReply && (
          <button
            className="appearance-none text-xs font-bold"
            onClick={onReply}
          >
            {isReplying ? 'Cancel' : 'Reply'}
          </button>
        )}
        {session?.user?.id == comment.userId ? (
          <button
            className="appearance-none text-xs font-bold"
            onClick={async () => {
              setDeleting(true)
              await deleteComment.mutateAsync({ commentId: comment.id })
              refetch()
            }}
          >
            {deleting ? 'Loading...' : 'Delete'}
          </button>
        ) : (
          <button className="appearance-none text-xs font-bold">Report</button>
        )}
      </div>
    </div>
  )
}
