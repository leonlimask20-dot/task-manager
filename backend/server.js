const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Prefixo /tasks para todas as rotas de tarefas
app.use('/tasks', taskRoutes);

// Rota raiz para confirmar que a API está no ar
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      'GET    /tasks':          'Listar todas as tarefas',
      'GET    /tasks?completed': 'Filtrar por status (true/false)',
      'GET    /tasks/:id':      'Buscar tarefa por ID',
      'POST   /tasks':          'Criar nova tarefa',
      'PUT    /tasks/:id':      'Atualizar tarefa',
      'DELETE /tasks/:id':      'Remover tarefa',
    }
  });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
