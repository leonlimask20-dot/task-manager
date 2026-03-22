const express = require('express');
const router = express.Router();
const db = require('../database');

// Helper para executar queries que retornam múltiplas linhas
const all = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows))
  );

// Helper para executar queries que retornam uma linha
const get = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row))
  );

// Helper para INSERT, UPDATE, DELETE
const run = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function(err) {
      err ? reject(err) : resolve({ lastID: this.lastID, changes: this.changes });
    })
  );

const normalize = (task) => task ? { ...task, completed: task.completed === 1 } : null;

// GET /tasks — lista todas as tarefas com filtro opcional por status
router.get('/', async (req, res) => {
  try {
    let rows;
    if (req.query.completed !== undefined) {
      const completed = req.query.completed === 'true' ? 1 : 0;
      rows = await all('SELECT * FROM tasks WHERE completed = ? ORDER BY created_at DESC', [completed]);
    } else {
      rows = await all('SELECT * FROM tasks ORDER BY created_at DESC');
    }
    res.json(rows.map(normalize));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

// GET /tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(normalize(task));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
});

// POST /tasks
router.post('/', async (req, res) => {
  try {
    const { title, priority = 'media', due_date = null } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'O título da tarefa é obrigatório' });
    }

    const validPriorities = ['alta', 'media', 'baixa'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Prioridade inválida. Use: alta, media ou baixa' });
    }

    const result = await run(
      'INSERT INTO tasks (title, priority, due_date) VALUES (?, ?, ?)',
      [title.trim(), priority, due_date]
    );

    const created = await get('SELECT * FROM tasks WHERE id = ?', [result.lastID]);
    res.status(201).json(normalize(created));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

// PUT /tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const existing = await get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Tarefa não encontrada' });

    const { title, completed, priority, due_date } = req.body;

    const updated = {
      title:     title     !== undefined ? title.trim()          : existing.title,
      completed: completed !== undefined ? (completed ? 1 : 0)   : existing.completed,
      priority:  priority  !== undefined ? priority               : existing.priority,
      due_date:  due_date  !== undefined ? due_date               : existing.due_date,
    };

    if (!updated.title) {
      return res.status(400).json({ error: 'O título da tarefa é obrigatório' });
    }

    await run(
      'UPDATE tasks SET title = ?, completed = ?, priority = ?, due_date = ? WHERE id = ?',
      [updated.title, updated.completed, updated.priority, updated.due_date, req.params.id]
    );

    const task = await get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(normalize(task));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const existing = await get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Tarefa não encontrada' });

    await run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

module.exports = router;
