import { useState } from 'react'
import CommentBox from './CommentBox'
import CommentInput from './CommentInput'

interface props {
  comment: {
    text: string
    id: string
    name: string
    replies: {
      text: string
      id: string
      name: string
    }[]
  }
}

export default function WholeComment({ comment }: props) {
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
          onReply={() => setShowInput(!showInput)}
          isReplying={showInput}
        />
        {showInput && <CommentInput reply />}
      </div>
      {/* REPLIES */}
      <div className="ml-4 flex flex-col">
        {comment.replies.map((reply) => {
          return (
            <>
              <CommentBox key={'reply:' + reply.id} comment={reply} />
            </>
          )
        })}
      </div>
    </div>
  )
}
