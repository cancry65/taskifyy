import { ref, computed } from 'vue'

const newTaskText = ref('')
const tasks = ref([
  { id: 1, title: 'Bikin UI brutalism pakai Vue.js', done: true },
  { id: 2, title: 'Coba ganti tema Neon Cyberpunk & Dark Mode', done: false },
  { id: 3, title: 'Main Tetris rekor baru 800 poin', done: false }
])

const completedTasksCount = computed(() => tasks.value.filter(t => t.done).length)
const taskEfficiency = computed(() =>
  tasks.value.length === 0 ? 0 : Math.round((completedTasksCount.value / tasks.value.length) * 100)
)

const addTask = () => {
  if (!newTaskText.value.trim()) return
  tasks.value.push({ id: Date.now(), title: newTaskText.value.trim(), done: false })
  newTaskText.value = ''
}

const deleteTask = (id) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

export function useTasks() {
  return { tasks, newTaskText, completedTasksCount, taskEfficiency, addTask, deleteTask }
}
