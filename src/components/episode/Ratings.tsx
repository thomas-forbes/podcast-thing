import { Rating } from '@prisma/client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  FaCircle,
  FaCircleNotch,
  FaRegCircle,
  FaTimesCircle,
} from 'react-icons/fa'
import { trpc } from '../../utils/trpc'

interface RatingType {
  type: string
  rating: number | null
}

interface props {
  ratings: Rating[] | undefined
}

export default function Ratings({ ratings: inRatings }: props) {
  const router = useRouter()
  const { data: session } = useSession()
  const addRating = trpc.interactions.addRating.useMutation()

  const [updating, setUpdating] = useState({ label: '', rating: -1 })
  const [ratings, setRatings] = useState<RatingType[]>([
    {
      type: 'Overall',
      rating: inRatings?.find((r) => r.type == 'Overall')?.rating ?? null,
    },
    {
      type: 'Content',
      rating: inRatings?.find((r) => r.type == 'Content')?.rating ?? null,
    },
    {
      type: 'Production',
      rating: inRatings?.find((r) => r.type == 'Production')?.rating ?? null,
    },
  ])
  const ratingsColours = [
    'text-red-500',
    'text-orange-500',
    'text-yellow-500',
    'text-lime-500',
    'text-emerald-500',
  ]
  return (
    <table className="w-fit">
      <thead>
        {['', 'Bad', 'Worse', 'Avg', 'Better', 'Great'].map((label) => (
          <th key={'heading' + label} className="px-1 text-xs sm:text-sm">
            {label}
          </th>
        ))}
      </thead>
      <tbody>
        {ratings.map(({ type: label, rating }) => (
          <tr key={'row:' + label}>
            <td className="text-sm font-extrabold sm:text-base">{label}</td>
            {[...Array(5)].map((_, i) => (
              <td key={'rating:' + label + i} className="text-center">
                <button
                  className={`appearance-none py-1 px-3 text-2xl duration-75 ${ratingsColours[i]}`}
                  key={label + i}
                  onClick={
                    session?.user
                      ? () => {
                          setUpdating({ label, rating: i })
                          addRating.mutate({
                            rating: i,
                            type: label,
                            episodeSlug: router.query.episodeSlug as string,
                            showSlug: router.query.showSlug as string,
                          })
                          setRatings((ratings: RatingType[]) =>
                            [...ratings].map((r) =>
                              r.type == label ? { ...r, rating: i } : r
                            )
                          )
                        }
                      : () => signIn()
                  }
                >
                  {updating.label == label &&
                  updating.rating == i &&
                  addRating.isError ? (
                    <FaTimesCircle />
                  ) : updating.label == label &&
                    updating.rating == i &&
                    addRating.isLoading ? (
                    <FaCircleNotch className="animate-spin" />
                  ) : i == rating ? (
                    <FaCircle />
                  ) : (
                    <FaRegCircle />
                  )}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
