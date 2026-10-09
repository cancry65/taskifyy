<template>
  <section class="calendar-view">
    <div class="dash-card calendar-card">
      <div class="card-header">
        <div class="calendar-nav">
          <button class="btn-brutal secondary btn-sm" @click="prevMonth">◄ PREV</button>
          <h2>{{ monthNames[currentMonth] }} {{ currentYear }}</h2>
          <button class="btn-brutal secondary btn-sm" @click="nextMonth">NEXT ►</button>
        </div>
        <button class="btn-brutal primary btn-sm" @click="goToToday">TODAY 🎯</button>
      </div>

      <!-- Weekday headers -->
      <div class="calendar-grid headers">
        <div v-for="day in dayNames" :key="day" class="day-header">{{ day }}</div>
      </div>

      <!-- Day cells -->
      <div class="calendar-grid days">
        <div
          v-for="(dayObj, idx) in calendarDays"
          :key="idx"
          :class="[
            'day-cell',
            {
              'other-month': !dayObj.isCurrentMonth,
              'is-today': dayObj.isToday,
              'is-selected': isSameDate(dayObj.date, selectedDate),
              'has-events': dayObj.events.length > 0
            }
          ]"
          @click="selectDate(dayObj.date)"
        >
          <div class="day-num-wrapper">
            <span class="day-num">{{ dayObj.date.getDate() }}</span>
            <span v-if="dayObj.isToday" class="today-badge">TODAY</span>
          </div>

          <div class="event-dots">
            <div
              v-for="(evt, eIdx) in dayObj.events.slice(0, 3)"
              :key="eIdx"
              class="event-dot"
              :title="evt.title"
            ></div>
            <span v-if="dayObj.events.length > 3" class="more-events">+{{ dayObj.events.length - 3 }}</span>
          </div>
        </div>
      </div>

      <!-- Agenda panel -->
      <div class="event-panel">
        <div class="panel-header">
          <h3>AGENDA FOR {{ formatDateFormatted(selectedDate) }}</h3>
          <span class="tag">{{ selectedDateEvents.length }} EVENTS</span>
        </div>

        <div class="add-event-form">
          <input
            v-model="newEventText"
            type="text"
            placeholder="Tambah event / pengingat agenda..."
            @keyup.enter="addEvent"
          />
          <button class="btn-brutal primary" @click="addEvent">ADD EVENT +</button>
        </div>

        <ul v-if="selectedDateEvents.length > 0" class="event-list">
          <li v-for="evt in selectedDateEvents" :key="evt.id" class="event-item">
            <div class="event-content">
              <span class="event-time">📌 SCHEDULED</span>
              <span class="event-text">{{ evt.title }}</span>
            </div>
            <button class="btn-delete" @click="deleteEvent(evt.id)">✕</button>
          </li>
        </ul>
        <div v-else class="empty-events">
          <span>Belum ada agenda untuk tanggal ini. Tambahkan sekarang! 🚀</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCalendar } from '../composables/useCalendar'

const {
  monthNames, dayNames,
  currentMonth, currentYear, selectedDate, newEventText,
  calendarDays, selectedDateEvents,
  isSameDate, selectDate, prevMonth, nextMonth, goToToday,
  addEvent, deleteEvent, formatDateFormatted
} = useCalendar()
</script>

<style scoped>
.calendar-card { width: 100%; }
.calendar-nav { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.calendar-grid.headers { margin-bottom: 8px; border-bottom: 3px solid var(--border-color); padding-bottom: 6px; }

.day-header { font-family: 'Space Mono', monospace; font-weight: 800; font-size: 0.85rem; text-align: center; }

.day-cell {
  min-height: 80px;
  border: 3px solid var(--border-color);
  background: var(--bg-card);
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.1s ease;
}
.day-cell:hover { transform: translate(-2px, -2px); box-shadow: 3px 3px 0px var(--shadow-color); }
.day-cell.other-month { opacity: 0.35; background: var(--bg-card-alt); }
.day-cell.is-today { border-width: 4px; background: var(--bg-card-alt); }
.day-cell.is-selected { background: var(--accent-primary); color: var(--accent-text); }
.day-cell.is-selected .day-num { font-weight: 800; }

.day-num-wrapper { display: flex; justify-content: space-between; align-items: center; }
.day-num { font-family: 'Space Mono', monospace; font-weight: 700; font-size: 0.9rem; }
.today-badge { font-size: 0.55rem; font-family: 'Space Mono', monospace; font-weight: 800; background: var(--accent-secondary); color: #ffffff; padding: 1px 3px; }

.event-dots { display: flex; gap: 3px; align-items: center; flex-wrap: wrap; margin-top: 4px; }
.event-dot { width: 8px; height: 8px; border: 1px solid var(--border-color); background: var(--accent-secondary); border-radius: 50%; }
.day-cell.is-selected .event-dot { background: var(--accent-text); border-color: var(--accent-text); }
.more-events { font-size: 0.6rem; font-family: 'Space Mono', monospace; font-weight: 700; }

.event-panel { margin-top: 2rem; border-top: 3px dashed var(--border-color); padding-top: 1.5rem; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
.panel-header h3 { font-size: 1.1rem; font-weight: 800; }

.add-event-form { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; }
.add-event-form input { flex: 1; border: 3px solid var(--border-color); padding: 0.6rem; font-family: 'Space Grotesk', sans-serif; font-weight: 700; outline: none; background: var(--bg-main); color: var(--text-main); }

.event-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
.event-item { display: flex; align-items: center; justify-content: space-between; border: 3px solid var(--border-color); padding: 0.75rem 1rem; box-shadow: 4px 4px 0px var(--shadow-color); background: var(--bg-card); }
.event-content { display: flex; flex-direction: column; gap: 0.2rem; }
.event-time { font-family: 'Space Mono', monospace; font-size: 0.7rem; font-weight: 700; opacity: 0.8; }
.event-text { font-weight: 700; font-size: 0.95rem; }
.empty-events { font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 700; opacity: 0.7; padding: 1rem 0; }
</style>
