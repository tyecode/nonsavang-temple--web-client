export const formatDate = (date: Date | string) => {
  const datePattern = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} (AM|PM)$/

  if (datePattern.test(date as string)) {
    return date as string
  }

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return `${formattedDate} ${formattedTime}`
}
