const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS restrito — em produção define a origem real do frontend
// Em desenvolvimento aceita localhost:5173 (Vite)
const origemPermitida = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: origemPermitida,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      'GET    /tasks':           'Listar todas as tarefas',
      'GET    /tasks?completed': 'Filtrar por status (true/false)',
      'GET    /tasks/:id':       'Buscar tarefa por ID',
      'POST   /tasks':           'Criar nova tarefa',
      'PUT    /tasks/:id':       'Atualizar tarefa',
      'DELETE /tasks/:id':       'Remover tarefa',
    }
  });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
