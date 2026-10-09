<template>
  <section class="dashboard-view">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">TASKS CLEARED</span>
        <div class="stat-value">{{ completedTasksCount }}/{{ tasks.length }}</div>
        <span class="stat-footer">Efficiency: {{ taskEfficiency }}%</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">EVENTS SCHEDULED</span>
        <div class="stat-value">{{ totalEventsCount }} EVENTS</div>
        <span class="stat-footer">Active Calendar Grid</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">FLAPPY HIGH SCORE</span>
        <div class="stat-value">{{ highScore }} PTS</div>
        <span class="stat-footer">Status: {{ highScore > 10 ? 'LEGEND' : 'ROOKIE' }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">TETRIS HIGH SCORE</span>
        <div class="stat-value">{{ tetrisHighScore }} PTS</div>
        <span class="stat-footer">Status: {{ tetrisHighScore > 500 ? 'BLOCK MASTER' : 'NOOB' }}</span>
      </div>
    </div>

    <div class="dash-layout">
      <!-- Activity bar chart -->
      <div class="dash-card">
        <div class="card-header">
          <h2>WEEKLY VIBE ANALYTICS</h2>
          <span class="tag">BAR CHART</span>
        </div>
        <div class="chart-container">
          <div v-for="(val, day) in weeklyData" :key="day" class="chart-bar-wrapper">
            <div class="bar-value">{{ val }}%</div>
            <div class="chart-bar" :style="{ height: val + '%' }"></div>
            <div class="bar-label">{{ day.toUpperCase() }}</div>
          </div>
        </div>
      </div>

      <!-- SVG donut -->
      <div class="dash-card">
        <div class="card-header">
          <h2>TIME SPLIT DIAGRAM</h2>
          <span class="tag">DONUT CHART</span>
        </div>
        <div class="donut-chart-wrapper">
          <svg viewBox="0 0 42 42" class="donut-svg">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--bg-card-alt)" stroke-width="5"></circle>
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--accent-primary)" stroke-width="5" stroke-dasharray="60 40" stroke-dashoffset="25"></circle>
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--accent-secondary)" stroke-width="5" stroke-dasharray="25 75" stroke-dashoffset="65"></circle>
          </svg>
          <div class="donut-center-text">
            <span class="donut-val">100%</span>
            <span class="donut-lbl">FOCUS</span>
          </div>
        </div>
        <div class="chart-legend">
          <div class="legend-item"><span class="box primary"></span> Deep Work (60%)</div>
          <div class="legend-item"><span class="box secondary"></span> Gaming Arcade (25%)</div>
          <div class="legend-item"><span class="box alt"></span> Vibe & Chill (15%)</div>
        </div>
      </div>
    </div>

    <!-- Task checklist -->
    <div class="dash-card margin-top">
      <div class="card-header">
        <h2>QUEST CHECKLIST</h2>
        <span class="tag">{{ tasks.length }} REMAINING</span>
      </div>

      <div class="add-task-form">
        <input
          v-model="newTaskText"
          type="text"
          placeholder="Tambah agenda baru..."
          @keyup.enter="addTask"
        />
        <button class="btn-brutal primary" @click="addTask">+</button>
      </div>

      <ul class="task-list">
        <li
          v-for="task in tasks"
          :key="task.id"
          :class="['task-item', { done: task.done }]"
        >
          <label class="checkbox-container">
            <input type="checkbox" v-model="task.done" />
            <span class="task-title">{{ task.title }}</span>
          </label>
          <button class="btn-delete" @click="deleteTask(task.id)">✕</button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useTasks } from '../composables/useTasks'
import { useScores } from '../composables/useScores'
import { useCalendar } from '../composables/useCalendar'

const { tasks, newTaskText, completedTasksCount, taskEfficiency, addTask, deleteTask } = useTasks()
const { highScore, tetrisHighScore } = useScores()
const { totalEventsCount } = useCalendar()

const weeklyData = ref({ Mon: 70, Tue: 85, Wed: 45, Thu: 95, Fri: 60, Sat: 100, Sun: 90 })
</script>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { border: 4px solid var(--border-color); padding: 1.25rem; box-shadow: 6px 6px 0px var(--shadow-color); background: var(--bg-card); }
.stat-label { font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; }
.stat-value { font-size: 2rem; font-weight: 800; margin: 0.25rem 0; }
.stat-footer { font-size: 0.85rem; font-weight: 700; text-decoration: underline; }

.dash-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.margin-top { margin-top: 1.5rem; }
@media (max-width: 768px) { .dash-layout { grid-template-columns: 1fr; } }

.chart-container { display: flex; justify-content: space-between; align-items: flex-end; height: 180px; padding-top: 1rem; }
.chart-bar-wrapper { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; height: 100%; justify-content: flex-end; flex: 1; }
.bar-value { font-size: 0.65rem; font-family: 'Space Mono', monospace; font-weight: 700; }
.chart-bar { width: 22px; background: var(--accent-primary); border: 2px solid var(--border-color); transition: height 0.3s ease; }
.bar-label { font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; }

.donut-chart-wrapper { position: relative; width: 160px; height: 160px; margin: 0 auto 1.5rem auto; }
.donut-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.donut-center-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; }
.donut-val { font-size: 1.4rem; font-weight: 800; }
.donut-lbl { font-family: 'Space Mono', monospace; font-size: 0.65rem; font-weight: 700; }

.chart-legend { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; font-weight: 700; }
.legend-item { display: flex; align-items: center; gap: 0.5rem; }
.legend-item .box { width: 12px; height: 12px; border: 2px solid var(--border-color); }
.legend-item .box.primary { background: var(--accent-primary); }
.legend-item .box.secondary { background: var(--accent-secondary); }
.legend-item .box.alt { background: var(--bg-card-alt); }

.add-task-form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.add-task-form input { flex: 1; border: 3px solid var(--border-color); padding: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-weight: 700; outline: none; background: var(--bg-main); color: var(--text-main); }

.task-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
.task-item { display: flex; align-items: center; justify-content: space-between; border: 3px solid var(--border-color); padding: 0.6rem 0.8rem; box-shadow: 3px 3px 0px var(--shadow-color); background: var(--bg-card); }
.task-item.done { background: var(--bg-card-alt); text-decoration: line-through; opacity: 0.7; }
.checkbox-container { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 700; }
</style>
