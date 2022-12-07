import { Comment, User } from '@prisma/client'
import { useState } from 'react'
import CommentBox from './CommentBox'
import CommentInput from './CommentInput'

interface props {
  comment: Comment & {
    user: User
    replies: (Comment & {
      user: User
      isLiked: boolean
    })[]
    isLiked: boolean
  }

  episodeId: string
}

export default function WholeComment({ comment, episodeId }: props) {
  const [showInput, setShowInput] = useState(false)
  return (
    <div
      key={'comment:' + comment.id}
      className="flex w-full flex-col space-y-4"
    >
      {/* OG COMMENT */}
      <div className="space-y-2">
        <CommentBox
          comment={comment}
          setShowInput={setShowInput}
          isReplying={showInput}
        />
        {showInput && (
          <CommentInput
            episodeId={episodeId}
            reply
            replyToId={comment.id}
            onFinish={() => setShowInput(false)}
          />
        )}
      </div>
      {/* REPLIES */}
      {comment.replies.length ? (
        <div className="ml-2 flex flex-col space-y-4 border-l-2 pl-3 dark:border-zinc-700">
          {comment.replies.map((reply) => (
            <Reply key={'reply:' + reply.id} comment={reply} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

const Reply = ({
  comment,
}: {
  comment: Comment & {
    user: User
    isLiked: boolean
  }
}) => {
  // const [showInput, setShowInput] = useState(false)
  return (
    <div className="space-y-2">
      <CommentBox
        comment={comment}
        // isReplying={showInput}
        isReply
      />
      {/* {showInput && <CommentInput reply replyToId={comment.id} />} */}
    </div>
  )
}
