import { ref, computed } from 'vue'

export const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
export const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const todayDate = new Date()
const currentMonth = ref(todayDate.getMonth())
const currentYear = ref(todayDate.getFullYear())
const selectedDate = ref(new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()))
const newEventText = ref('')

export const getDateKey = (dateObj) => {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const isSameDate = (d1, d2) => {
  if (!d1 || !d2) return false
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

// Events store keyed by 'YYYY-MM-DD'
const eventsMap = ref({
  [getDateKey(todayDate)]: [
    { id: 'e1', title: 'Launch Neo-Brutalism System ⚡' },
    { id: 'e2', title: 'Review Code & Test Tetris Game 🎮' }
  ]
})

const calendarDays = computed(() => {
  const days = []
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate()

  const makeCell = (d, isCurrentMonth) => ({
    date: d,
    isCurrentMonth,
    isToday: isSameDate(d, todayDate),
    events: eventsMap.value[getDateKey(d)] || []
  })

  // Previous month
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push(makeCell(new Date(currentYear.value, currentMonth.value - 1, prevMonthLastDay - i), false))
  }
  // Current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push(makeCell(new Date(currentYear.value, currentMonth.value, i), true))
  }
  // Next month (fill to multiple of 7)
  const totalSlots = Math.ceil(days.length / 7) * 7
  const nextMonthDaysCount = totalSlots - days.length
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    days.push(makeCell(new Date(currentYear.value, currentMonth.value + 1, i), false))
  }
  return days
})

const selectedDateEvents = computed(() => {
  if (!selectedDate.value) return []
  return eventsMap.value[getDateKey(selectedDate.value)] || []
})

const totalEventsCount = computed(() =>
  Object.values(eventsMap.value).reduce((acc, curr) => acc + curr.length, 0)
)

const selectDate = (d) => {
  selectedDate.value = new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const goToToday = () => {
  currentMonth.value = todayDate.getMonth()
  currentYear.value = todayDate.getFullYear()
  selectedDate.value = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())
}

const addEvent = () => {
  if (!newEventText.value.trim() || !selectedDate.value) return
  const k = getDateKey(selectedDate.value)
  if (!eventsMap.value[k]) eventsMap.value[k] = []
  eventsMap.value[k].push({ id: 'evt_' + Date.now(), title: newEventText.value.trim() })
  newEventText.value = ''
}

const deleteEvent = (evtId) => {
  if (!selectedDate.value) return
  const k = getDateKey(selectedDate.value)
  if (eventsMap.value[k]) {
    eventsMap.value[k] = eventsMap.value[k].filter(e => e.id !== evtId)
  }
}

const formatDateFormatted = (d) => {
  if (!d) return ''
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
}

export function useCalendar() {
  return {
    monthNames, dayNames,
    currentMonth, currentYear, selectedDate, newEventText,
    calendarDays, selectedDateEvents, totalEventsCount,
    isSameDate, selectDate, prevMonth, nextMonth, goToToday,
    addEvent, deleteEvent, formatDateFormatted
  }
}
