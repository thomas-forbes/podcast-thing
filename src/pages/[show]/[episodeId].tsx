import { useRouter } from 'next/router'
import { useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import Background from '../../components/Background'
import Comment from '../../components/episode/Comment'
import CommentBox from '../../components/episode/CommentBox'
import { trpc } from '../../utils/trpc'

interface RatingType {
  label: string
  rating: number
}

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-2xl font-bold dark:text-white">Loading...</div>
  </div>
)

export default function Home() {
  const router = useRouter()
  const { show, episodeId } = router.query

  const { data: podcast, isLoading } = trpc.podcast.getEpisode.useQuery(
    {
      show: show as string,
      episodeId: episodeId as string,
    },
    { enabled: typeof show == 'string' && typeof episodeId == 'string' }
  )

  const [ratings, setRatings] = useState<RatingType[]>([
    { label: 'Overall', rating: -1 },
    { label: 'Content', rating: -1 },
    { label: 'Production', rating: -1 },
  ])

  if (!router.isReady || isLoading || podcast == undefined) return <Loading />
  return (
    <>
      <Background mainColumn>
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
          <p className="text-center dark:text-slate-200">{podcast.showNotes}</p>
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
                setRatings((ratings: RatingType[]) => {
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
            {podcast.comments.map((comment: any) => (
              <div
                key={'comment:' + comment.id}
                className="flex w-full flex-col space-y-4"
              >
                {/* OG COMMENT */}
                <Comment comment={comment} />
                {/* REPLIES */}
                <div className="ml-4 flex flex-col">
                  {comment?.replies?.map((reply: any) => (
                    <Comment key={'reply:' + reply.id} comment={reply} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Background>
    </>
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
