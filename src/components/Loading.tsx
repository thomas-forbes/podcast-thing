import Spinner from './Spinner'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size={10} />
    </div>
  )
}
