<template>
  <!-- Dialog reutilizável para criação e edição de tarefas -->
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="pa-4 bg-primary text-white">
        <v-icon :icon="isEditing ? 'mdi-pencil' : 'mdi-plus-circle'" class="mr-2" />
        {{ isEditing ? 'Editar Tarefa' : 'Nova Tarefa' }}
      </v-card-title>

      <v-card-text class="pa-4 pt-6">
        <v-text-field
          v-model="form.title"
          label="Título da tarefa"
          variant="outlined"
          :error-messages="errors.title"
          @keyup.enter="submit"
          autofocus
        />

        <v-select
          v-model="form.priority"
          :items="priorityOptions"
          item-title="label"
          item-value="value"
          label="Prioridade"
          variant="outlined"
          class="mt-2"
        >
          <!-- Exibe chip colorido na seleção -->
          <template #selection="{ item }">
            <v-chip :color="priorityColor(item.value)" size="small" class="mr-1">
              {{ item.title }}
            </v-chip>
          </template>
        </v-select>

        <v-text-field
          v-model="form.due_date"
          label="Data de vencimento (opcional)"
          type="date"
          variant="outlined"
          class="mt-2"
        />
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="close">Cancelar</v-btn>
        <v-btn color="primary" variant="elevated" @click="submit" :loading="loading">
          {{ isEditing ? 'Salvar' : 'Adicionar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,   // controla se o dialog está aberto
  task: Object,          // se preenchido, entra em modo de edição
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEditing = computed(() => !!props.task)

const loading = ref(false)
const errors = ref({})

const form = ref({
  title: '',
  priority: 'media',
  due_date: '',
})

const priorityOptions = [
  { label: 'Alta',  value: 'alta'  },
  { label: 'Média', value: 'media' },
  { label: 'Baixa', value: 'baixa' },
]

function priorityColor(priority) {
  return { alta: 'error', media: 'warning', baixa: 'success' }[priority] || 'grey'
}

// Preenche o formulário quando entrar em modo de edição
watch(() => props.task, (task) => {
  if (task) {
    form.value = {
      title:    task.title,
      priority: task.priority,
      due_date: task.due_date || '',
    }
  } else {
    resetForm()
  }
}, { immediate: true })

function validate() {
  errors.value = {}
  if (!form.value.title.trim()) {
    errors.value.title = 'O título é obrigatório'
    return false
  }
  return true
}

async function submit() {
  if (!validate()) return
  emit('save', { ...form.value })
  close()
}

function close() {
  dialog.value = false
  resetForm()
}

function resetForm() {
  form.value = { title: '', priority: 'media', due_date: '' }
  errors.value = {}
}
</script>
