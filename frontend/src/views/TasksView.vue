<template>
  <v-container class="py-6" max-width="800">

    <!-- Cabeçalho com contador de pendentes -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h1 class="text-h5 font-weight-bold">Minhas Tarefas</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ pendingCount }} pendente{{ pendingCount !== 1 ? 's' : '' }} de {{ tasks.length }} tarefa{{ tasks.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
        Nova Tarefa
      </v-btn>
    </div>

    <!-- Filtros por status -->
    <v-chip-group v-model="activeFilter" mandatory class="mb-4">
      <v-chip value="all"       filter>Todas ({{ tasks.length }})</v-chip>
      <v-chip value="pending"   filter color="warning">Pendentes ({{ pendingCount }})</v-chip>
      <v-chip value="completed" filter color="success">Concluídas ({{ completedCount }})</v-chip>
    </v-chip-group>

    <!-- Estado vazio -->
    <v-card v-if="filteredTasks.length === 0" variant="tonal" class="pa-8 text-center">
      <v-icon icon="mdi-clipboard-text-outline" size="48" color="medium-emphasis" />
      <p class="text-body-1 text-medium-emphasis mt-3">
        {{ activeFilter === 'all' ? 'Nenhuma tarefa ainda. Crie a primeira!' : 'Nenhuma tarefa nesta categoria.' }}
      </p>
    </v-card>

    <!-- Lista de tarefas -->
    <v-card v-else>
      <v-list lines="two">
        <template v-for="(task, index) in filteredTasks" :key="task.id">
          <v-divider v-if="index > 0" />

          <v-list-item>
            <!-- Checkbox de conclusão -->
            <template #prepend>
              <v-checkbox-btn
                :model-value="task.completed"
                color="success"
                @click="toggleTask(task)"
              />
            </template>

            <!-- Título e badges -->
            <v-list-item-title
              :class="{ 'text-decoration-line-through text-medium-emphasis': task.completed }"
              class="font-weight-medium"
            >
              {{ task.title }}
            </v-list-item-title>

            <v-list-item-subtitle class="mt-1">
              <!-- Chip de prioridade -->
              <v-chip
                :color="priorityColor(task.priority)"
                size="x-small"
                class="mr-2"
              >
                {{ priorityLabel(task.priority) }}
              </v-chip>

              <!-- Data de vencimento se existir -->
              <span v-if="task.due_date" class="text-caption text-medium-emphasis">
                <v-icon icon="mdi-calendar" size="12" class="mr-1" />
                {{ formatDate(task.due_date) }}
              </span>
            </v-list-item-subtitle>

            <!-- Botões de ação -->
            <template #append>
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="small"
                color="primary"
                @click="openEdit(task)"
              />
              <v-btn
                icon="mdi-trash-can-outline"
                variant="text"
                size="small"
                color="error"
                @click="confirmDelete(task)"
              />
            </template>
          </v-list-item>
        </template>
      </v-list>
    </v-card>

    <!-- Formulário de criação / edição -->
    <TaskForm
      v-model="showForm"
      :task="editingTask"
      @save="saveTask"
    />

    <!-- Dialog de confirmação de exclusão -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="pa-4">Excluir tarefa?</v-card-title>
        <v-card-text>
          Esta ação não pode ser desfeita. A tarefa
          <strong>"{{ taskToDelete?.title }}"</strong> será removida permanentemente.
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="showDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="executeDelete" :loading="deleting">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar de feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="bottom right">
      <v-icon :icon="snackbar.icon" class="mr-2" />
      {{ snackbar.message }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TaskForm from '../components/TaskForm.vue'
import { getTasks, createTask, updateTask, deleteTask } from '../services/api'

const tasks        = ref([])
const activeFilter = ref('all')
const showForm     = ref(false)
const editingTask  = ref(null)

const showDeleteDialog = ref(false)
const taskToDelete     = ref(null)
const deleting         = ref(false)

const snackbar = ref({ show: false, message: '', color: 'success', icon: 'mdi-check' })

// Computed — filtra tarefas de acordo com o chip selecionado
const filteredTasks = computed(() => {
  if (activeFilter.value === 'pending')   return tasks.value.filter(t => !t.completed)
  if (activeFilter.value === 'completed') return tasks.value.filter(t => t.completed)
  return tasks.value
})

const pendingCount   = computed(() => tasks.value.filter(t => !t.completed).length)
const completedCount = computed(() => tasks.value.filter(t => t.completed).length)

// Carrega tarefas ao montar o componente
onMounted(loadTasks)

async function loadTasks() {
  try {
    tasks.value = await getTasks()
  } catch (err) {
    showFeedback('Erro ao carregar tarefas. Verifique se o backend está rodando.', 'error', 'mdi-alert')
  }
}

function openCreate() {
  editingTask.value = null
  showForm.value = true
}

function openEdit(task) {
  editingTask.value = { ...task }
  showForm.value = true
}

async function saveTask(formData) {
  try {
    if (editingTask.value) {
      await updateTask(editingTask.value.id, formData)
      showFeedback('Tarefa atualizada!', 'success', 'mdi-check')
    } else {
      await createTask(formData)
      showFeedback('Tarefa criada!', 'success', 'mdi-check')
    }
    await loadTasks()
  } catch (err) {
    showFeedback(err.message || 'Erro ao salvar tarefa', 'error', 'mdi-alert')
  }
}

async function toggleTask(task) {
  try {
    await updateTask(task.id, { completed: !task.completed })
    await loadTasks()
  } catch (err) {
    showFeedback('Erro ao atualizar tarefa', 'error', 'mdi-alert')
  }
}

function confirmDelete(task) {
  taskToDelete.value = task
  showDeleteDialog.value = true
}

async function executeDelete() {
  try {
    deleting.value = true
    await deleteTask(taskToDelete.value.id)
    showDeleteDialog.value = false
    showFeedback('Tarefa excluída!', 'success', 'mdi-check')
    await loadTasks()
  } catch (err) {
    showFeedback('Erro ao excluir tarefa', 'error', 'mdi-alert')
  } finally {
    deleting.value = false
    taskToDelete.value = null
  }
}

function priorityColor(priority) {
  return { alta: 'error', media: 'warning', baixa: 'success' }[priority] || 'grey'
}

function priorityLabel(priority) {
  return { alta: 'Alta', media: 'Média', baixa: 'Baixa' }[priority] || priority
}

function formatDate(date) {
  if (!date) return ''
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

function showFeedback(message, color = 'success', icon = 'mdi-check') {
  snackbar.value = { show: true, message, color, icon }
}
</script>
