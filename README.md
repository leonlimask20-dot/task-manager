# Task Manager Full Stack

Aplicação full stack para gerenciamento de tarefas com Vue 3, Vuetify e Node.js + Express.

---

## Principais competências demonstradas

- Desenvolvimento full stack com frontend e backend separados
- Interface responsiva com Vue 3 (Composition API) e Vuetify 3
- API REST com Node.js + Express cobrindo todas as operações CRUD
- Persistência de dados com SQLite via better-sqlite3
- Integração entre frontend e backend com consumo de serviços HTTP
- Filtros dinâmicos por status, chips de prioridade e feedback visual
- Validação de entrada no frontend e no backend

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | Vue 3, Vuetify 3, Vite |
| Backend | Node.js, Express |
| Banco de dados | SQLite (better-sqlite3) |
| Ícones | Material Design Icons (@mdi/font) |

---

## Funcionalidades

- Listar tarefas com filtros: Todas / Pendentes / Concluídas
- Criar tarefa com título, prioridade (Alta/Média/Baixa) e data de vencimento
- Editar tarefa existente via dialog
- Marcar tarefa como concluída com checkbox
- Excluir tarefa com dialog de confirmação
- Contador de tarefas pendentes no cabeçalho
- Chips coloridos de prioridade (vermelho/amarelo/verde)
- Snackbar de feedback após cada operação
- Alternância entre tema claro e escuro
- Estado vazio com mensagem amigável

---

## Estrutura do projeto

```
task-manager/
├── backend/
│   ├── routes/
│   │   └── tasks.js       ← rotas da API REST
│   ├── database.js         ← configuração e inicialização do SQLite
│   ├── server.js           ← entrada da aplicação Express
│   └── package.json
└── frontend/
    ├── src/
    │   ├── views/
    │   │   └── TasksView.vue    ← tela principal
    │   ├── components/
    │   │   └── TaskForm.vue     ← formulário reutilizável
    │   ├── services/
    │   │   └── api.js           ← camada de integração com a API
    │   ├── App.vue
    │   └── main.js
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Como rodar

### Pré-requisitos

- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev
```

API disponível em `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Interface disponível em `http://localhost:5173`

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/tasks` | Listar todas as tarefas |
| GET | `/tasks?completed=true` | Filtrar por status |
| GET | `/tasks/:id` | Buscar tarefa por ID |
| POST | `/tasks` | Criar nova tarefa |
| PUT | `/tasks/:id` | Atualizar tarefa |
| DELETE | `/tasks/:id` | Remover tarefa |

### Exemplo de payload

```json
{
  "title": "Estudar Vue 3",
  "priority": "alta",
  "due_date": "2025-12-31"
}
```

---

## Autor

**Leon Nogueira Lima**
GitHub: [@leonlimask20-dot](https://github.com/leonlimask20-dot)
Email: leonlimask@gmail.com
