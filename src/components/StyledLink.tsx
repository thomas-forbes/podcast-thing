import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

export default function StyledLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={twMerge(
        'text-zinc-500 underline decoration-2 duration-100 hover:opacity-90 dark:text-zinc-300',
        className
      )}
    >
      {children}
    </Link>
  )
}
