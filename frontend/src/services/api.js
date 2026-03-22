const API_URL = 'http://localhost:3001'

// Função auxiliar para centralizar o tratamento de erros HTTP
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new Error(error.error || `Erro ${response.status}`)
  }

  // DELETE retorna 204 No Content — sem corpo para parsear
  if (response.status === 204) return null
  return response.json()
}

export const getTasks = (completed) => {
  const query = completed !== undefined ? `?completed=${completed}` : ''
  return request(`/tasks${query}`)
}

export const getTask = (id) => request(`/tasks/${id}`)

export const createTask = (task) =>
  request('/tasks', { method: 'POST', body: JSON.stringify(task) })

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) })

export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: 'DELETE' })
