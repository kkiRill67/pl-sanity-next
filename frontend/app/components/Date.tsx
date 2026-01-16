import { parseISO, format } from 'date-fns'

interface DateProps {
  dateString?: string
}

export default function DateComponent({ dateString }: DateProps) {
  if (!dateString) {
    return null
  }

  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'MMM yyyy')}</time>
}
