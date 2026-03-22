import { describe, it, expect } from 'vitest'

/**
 * Testes das funções de lógica pura extraídas da TasksView.
 *
 * Funções puras são mais fáceis de testar — recebem entrada, retornam saída,
 * sem depender de componentes, DOM ou chamadas HTTP.
 */

// Funções extraídas da TasksView para teste isolado
function corDePrioridade(prioridade) {
  return { alta: 'error', media: 'warning', baixa: 'success' }[prioridade] || 'grey'
}

function labelDePrioridade(prioridade) {
  return { alta: 'Alta', media: 'Média', baixa: 'Baixa' }[prioridade] || prioridade
}

function formatarData(data) {
  if (!data) return ''
  const [y, m, d] = data.split('-')
  return `${d}/${m}/${y}`
}

function filtrarTarefas(tarefas, filtro) {
  if (filtro === 'pending')   return tarefas.filter(t => !t.completed)
  if (filtro === 'completed') return tarefas.filter(t => t.completed)
  return tarefas
}

function contarPendentes(tarefas) {
  return tarefas.filter(t => !t.completed).length
}

// ---

describe('Lógica de prioridade', () => {
  it('deve retornar cor vermelha para prioridade alta', () => {
    expect(corDePrioridade('alta')).toBe('error')
  })

  it('deve retornar cor amarela para prioridade media', () => {
    expect(corDePrioridade('media')).toBe('warning')
  })

  it('deve retornar cor verde para prioridade baixa', () => {
    expect(corDePrioridade('baixa')).toBe('success')
  })

  it('deve retornar cinza para prioridade desconhecida', () => {
    expect(corDePrioridade('urgente')).toBe('grey')
  })

  it('deve retornar label correto para cada prioridade', () => {
    expect(labelDePrioridade('alta')).toBe('Alta')
    expect(labelDePrioridade('media')).toBe('Média')
    expect(labelDePrioridade('baixa')).toBe('Baixa')
  })
})

describe('Formatação de data', () => {
  it('deve formatar data do formato ISO para o formato brasileiro', () => {
    expect(formatarData('2025-12-31')).toBe('31/12/2025')
  })

  it('deve retornar string vazia quando data for nula', () => {
    expect(formatarData(null)).toBe('')
    expect(formatarData('')).toBe('')
  })

  it('deve formatar data com mês e dia de um dígito corretamente', () => {
    expect(formatarData('2025-01-05')).toBe('05/01/2025')
  })
})

describe('Filtro de tarefas', () => {
  const tarefas = [
    { id: 1, title: 'Tarefa 1', completed: false },
    { id: 2, title: 'Tarefa 2', completed: true },
    { id: 3, title: 'Tarefa 3', completed: false },
  ]

  it('deve retornar todas as tarefas com filtro "all"', () => {
    expect(filtrarTarefas(tarefas, 'all')).toHaveLength(3)
  })

  it('deve retornar apenas tarefas pendentes com filtro "pending"', () => {
    const pendentes = filtrarTarefas(tarefas, 'pending')
    expect(pendentes).toHaveLength(2)
    expect(pendentes.every(t => !t.completed)).toBe(true)
  })

  it('deve retornar apenas tarefas concluídas com filtro "completed"', () => {
    const concluidas = filtrarTarefas(tarefas, 'completed')
    expect(concluidas).toHaveLength(1)
    expect(concluidas[0].completed).toBe(true)
  })

  it('deve retornar lista vazia quando não há tarefas pendentes', () => {
    const todasConcluidas = tarefas.map(t => ({ ...t, completed: true }))
    expect(filtrarTarefas(todasConcluidas, 'pending')).toHaveLength(0)
  })
})

describe('Contador de tarefas pendentes', () => {
  it('deve contar corretamente as tarefas pendentes', () => {
    const tarefas = [
      { completed: false },
      { completed: true },
      { completed: false },
    ]
    expect(contarPendentes(tarefas)).toBe(2)
  })

  it('deve retornar zero quando todas as tarefas estão concluídas', () => {
    const tarefas = [{ completed: true }, { completed: true }]
    expect(contarPendentes(tarefas)).toBe(0)
  })

  it('deve retornar zero para lista vazia', () => {
    expect(contarPendentes([])).toBe(0)
  })
})
