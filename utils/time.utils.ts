export function formatMinutesToHoursAndMinutes(minutes: number): { hours: number; minutes: number } {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return { hours, minutes: mins }
}

export function formatEstimatedTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const { hours, minutes: mins } = formatMinutesToHoursAndMinutes(minutes)
  if (mins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${mins}min`
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export function isWithinOperatingHours(openTime: string, closeTime: string): boolean {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const [openHour, openMin] = openTime.split(':').map(Number)
  const [closeHour, closeMin] = closeTime.split(':').map(Number)

  const openMinutes = openHour * 60 + openMin
  const closeMinutes = closeHour * 60 + closeMin

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
}