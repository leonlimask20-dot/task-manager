import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTasks, createTask, updateTask, deleteTask } from '../services/api'

/**
 * Testes unitários do serviço de API.
 *
 * O fetch é mockado — os testes não fazem chamadas HTTP reais.
 * Isso garante que os testes sejam rápidos e independentes do backend.
 *
 * vi.fn() cria uma função falsa que podemos controlar e inspecionar.
 * mockResolvedValueOnce define o que essa função vai retornar quando chamada.
 */
describe('Serviço de API', () => {

  beforeEach(() => {
    // Substitui o fetch global por um mock antes de cada teste
    global.fetch = vi.fn()
  })

  afterEach(() => {
    // Remove o mock após cada teste para não interferir nos próximos
    vi.restoreAllMocks()
  })

  // Função auxiliar para criar respostas HTTP mockadas
  const criarRespostaMock = (dados, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(dados),
  })

  describe('getTasks', () => {
    it('deve retornar lista de tarefas com sucesso', async () => {
      const tarefasMock = [
        { id: 1, title: 'Estudar Vue', completed: false, priority: 'alta' },
        { id: 2, title: 'Fazer testes', completed: true, priority: 'media' },
      ]

      global.fetch.mockResolvedValueOnce(criarRespostaMock(tarefasMock))

      const resultado = await getTasks()

      expect(resultado).toEqual(tarefasMock)
      expect(resultado).toHaveLength(2)
    })

    it('deve chamar a URL correta ao buscar todas as tarefas', async () => {
      global.fetch.mockResolvedValueOnce(criarRespostaMock([]))

      await getTasks()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks',
        expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
      )
    })

    it('deve adicionar filtro de status na URL quando informado', async () => {
      global.fetch.mockResolvedValueOnce(criarRespostaMock([]))

      await getTasks(true)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks?completed=true',
        expect.any(Object)
      )
    })

    it('deve lançar erro quando a API retornar falha', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Erro interno do servidor' }),
      })

      await expect(getTasks()).rejects.toThrow('Erro interno do servidor')
    })
  })

  describe('createTask', () => {
    it('deve criar tarefa e retornar o objeto criado', async () => {
      const novaTarefa = { title: 'Nova tarefa', priority: 'alta' }
      const tarefaCriada = { id: 3, ...novaTarefa, completed: false }

      global.fetch.mockResolvedValueOnce(criarRespostaMock(tarefaCriada, 201))

      const resultado = await createTask(novaTarefa)

      expect(resultado.id).toBe(3)
      expect(resultado.title).toBe('Nova tarefa')
    })

    it('deve enviar requisição POST com os dados da tarefa', async () => {
      const novaTarefa = { title: 'Tarefa teste', priority: 'baixa' }
      global.fetch.mockResolvedValueOnce(criarRespostaMock({ id: 1, ...novaTarefa }))

      await createTask(novaTarefa)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(novaTarefa),
        })
      )
    })
  })

  describe('updateTask', () => {
    it('deve atualizar tarefa e retornar o objeto atualizado', async () => {
      const tarefaAtualizada = { id: 1, title: 'Tarefa atualizada', completed: true, priority: 'media' }
      global.fetch.mockResolvedValueOnce(criarRespostaMock(tarefaAtualizada))

      const resultado = await updateTask(1, { completed: true })

      expect(resultado.completed).toBe(true)
    })

    it('deve enviar requisição PUT para o endpoint correto', async () => {
      global.fetch.mockResolvedValueOnce(criarRespostaMock({ id: 1 }))

      await updateTask(1, { completed: true })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks/1',
        expect.objectContaining({ method: 'PUT' })
      )
    })
  })

  describe('deleteTask', () => {
    it('deve retornar null ao deletar com sucesso (204 No Content)', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true, status: 204, json: vi.fn() })

      const resultado = await deleteTask(1)

      expect(resultado).toBeNull()
    })

    it('deve enviar requisição DELETE para o endpoint correto', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true, status: 204, json: vi.fn() })

      await deleteTask(1)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks/1',
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })
})
