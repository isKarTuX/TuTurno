const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export function formatDateSpanish(date: Date): string {
  const day = DIAS_SEMANA[date.getDay()]
  const dayNum = date.getDate()
  const month = MESES[date.getMonth()]
  const year = date.getFullYear()
  return `${day}, ${dayNum} de ${month} de ${year}`
}

export function formatDateTimeSpanish(date: Date): string {
  const day = DIAS_SEMANA[date.getDay()]
  const dayNum = date.getDate()
  const month = MESES[date.getMonth()]
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}, ${dayNum} de ${month} de ${year} - ${hours}:${minutes}`
}

export function formatTimeSpanish(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
}

export function getRelativeTimeSpanish(date: Date): string {
  if (isToday(date)) {
    return `Hoy a las ${formatTimeSpanish(date)}`
  }
  if (isYesterday(date)) {
    return `Ayer a las ${formatTimeSpanish(date)}`
  }
  return formatDateTimeSpanish(date)
}