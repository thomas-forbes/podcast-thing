import { NextSeo } from 'next-seo'
import Spinner from './Spinner'

export default function Loading() {
  return (
    <>
      <NextSeo title="Loading..." />
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    </>
  )
}
