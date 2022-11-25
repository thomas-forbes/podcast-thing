import ReactTextareaAutosize from 'react-textarea-autosize'
import { twMerge } from 'tailwind-merge'

interface props {
  className?: string
  placeholder?: string
  value?: string
  setValue?: (value: string) => void
  textArea?: boolean
  minRows?: number
}
export default function Input({
  className,
  placeholder,
  value,
  setValue,
  textArea,
  minRows,
}: props) {
  const styles = twMerge(
    'w-full rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 transition-colors duration-300 placeholder:text-zinc-400 focus:border-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-600/10 dark:border-zinc-600 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 resize-none',
    className
  )
  return (
    <>
      {textArea ? (
        <ReactTextareaAutosize
          minRows={minRows}
          className={styles}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={styles}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => setValue && setValue(e.target.value)}
        />
      )}
    </>
  )
}
