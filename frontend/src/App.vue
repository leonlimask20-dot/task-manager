<template>
  <v-app :theme="theme" style="background: rgb(var(--v-theme-background))">
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>
        <v-icon icon="mdi-check-circle-outline" class="mr-2" />
        Task Manager
      </v-app-bar-title>

      <template #append>
        <!-- Alterna entre tema claro e escuro -->
        <v-btn
          :icon="theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
          @click="toggleTheme"
        />
      </template>
    </v-app-bar>

    <v-main>
      <TasksView />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import TasksView from './views/TasksView.vue'

const theme = ref('light')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>
