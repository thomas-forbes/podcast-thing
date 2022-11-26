import { twMerge } from 'tailwind-merge'

interface props {
  children?: React.ReactNode
  mainColumn?: boolean
  className?: string
}

export default function Background({ children, mainColumn, className }: props) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white p-8 dark:bg-zinc-900">
      {mainColumn ? (
        <div
          className={twMerge(
            'flex w-full max-w-lg flex-col items-center space-y-8',
            className
          )}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  )
}
