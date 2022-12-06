import { useRouter } from 'next/router'
import { useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import Background from '../../components/Background'
import CommentInput from '../../components/episode/CommentInput'
import WholeComment from '../../components/episode/WholeComment'
import Loading from '../../components/Loading'
import { trpc } from '../../utils/trpc'

interface RatingType {
  label: string
  rating: number
}

export default function Home() {
  const router = useRouter()
  const { showSlug, episodeSlug } = router.query

  const {
    data: episode,
    isLoading,
    error,
    refetch,
  } = trpc.podcast.getEpisode.useQuery(
    {
      showSlug: showSlug as string,
      episodeSlug: episodeSlug as string,
    },
    {
      enabled: typeof showSlug == 'string' && typeof episodeSlug == 'string',
      retry: 1,
    }
  )

  const [ratings, setRatings] = useState<RatingType[]>([
    { label: 'Overall', rating: -1 },
    { label: 'Content', rating: -1 },
    { label: 'Production', rating: -1 },
  ])

  if (error?.message == 'Episode not found') router.push(`/${showSlug}`)
  else if (error?.message == 'Show not found') router.push('/')

  if (!router.isReady || isLoading || episode == undefined) return <Loading />
  return (
    <>
      <Background mainColumn>
        {/* IMAGE */}
        <div className="relative h-32 w-32 overflow-hidden rounded-md shadow-xl shadow-slate-800">
          <img src={episode.data.imgUrl ?? ''} alt="Podcast Image" />
        </div>
        {/* TEXT */}
        <div className="flex w-full flex-col items-center space-y-4">
          <h1 className="text-center text-2xl font-extrabold">
            {episode.data.title}
          </h1>
          {/* make into 2 lines with expandability */}
          <p className="text-center dark:text-slate-200">
            {episode.data.description}
          </p>
        </div>
        {/* RATING */}
        <div className="flex w-full flex-col items-center space-y-4">
          {/* HEADING */}
          <h2 className="text-xl font-bold">Ratings</h2>
          {/* RATINGS */}
          {ratings.map(({ label, rating }) => (
            <Rating
              key={label}
              label={label}
              rating={rating}
              setRating={(newRating) =>
                setRatings((ratings: RatingType[]) =>
                  [...ratings].map((r) =>
                    r.label == label ? { ...r, rating: newRating } : r
                  )
                )
              }
            />
          ))}
        </div>
        {/* TODO: add ability to answer host questions */}
        {/* COMMENTS */}
        <div className="flex w-full flex-col items-center space-y-4">
          {/* HEADING */}
          <h2 className="text-xl font-bold">Comments</h2>
          {/* INPUT */}
          <CommentInput episodeId={episode.data.id ?? ''} refetch={refetch} />
          {/* COMMENTS */}
          <div className="flex w-full flex-col space-y-4">
            {episode.data.comments
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
              .map((comment) => (
                <WholeComment
                  key={comment.id}
                  episodeId={episode.data.id ?? ''}
                  comment={comment}
                  refetch={refetch}
                />
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
    <p className="flex-1">{label}:</p>
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
