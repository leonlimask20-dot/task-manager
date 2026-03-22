# Task Manager

![CI](https://github.com/leonlimask20-dot/task-manager/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?logo=vuetify&logoColor=white)
![Testes](https://img.shields.io/badge/testes-25%20passando-2E7D32)

Aplicação full stack para gerenciamento de tarefas com Vue 3, Vuetify e Node.js + Express.

---

## Links rápidos

| | |
|---|---|
| Rodar frontend | `cd frontend && npm install && npm run dev` |
| Rodar backend | `cd backend && npm install && npm run dev` |
| Rodar testes | `cd frontend && npm test` |
| Interface | `http://localhost:5173` |
| API | `http://localhost:3001` |

---

## Principais competências demonstradas

- Desenvolvimento full stack com frontend e backend desacoplados
- Interface responsiva com Vue 3 (Composition API) e Vuetify 3
- API REST com Node.js + Express cobrindo todas as operações CRUD
- Persistência de dados com SQLite via better-sqlite3
- Testes unitários com Vitest — 25 testes cobrindo serviço de API e lógica de negócio
- Pipeline de CI com GitHub Actions rodando os testes automaticamente a cada push
- Filtros dinâmicos, chips de prioridade e feedback visual com snackbar
- Alternância entre tema claro e escuro

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | Vue 3, Vuetify 3, Vite |
| Backend | Node.js, Express |
| Banco de dados | SQLite |
| Testes | Vitest, @vue/test-utils |
| CI/CD | GitHub Actions |
| Ícones | Material Design Icons |

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
├── .github/
│   └── workflows/
│       └── ci.yml              ← pipeline CI com GitHub Actions
├── backend/
│   ├── routes/
│   │   └── tasks.js            ← rotas da API REST
│   ├── database.js             ← configuração e inicialização do SQLite
│   ├── server.js               ← entrada da aplicação Express
│   └── package.json
└── frontend/
    ├── src/
    │   ├── tests/
    │   │   ├── api.test.js     ← testes do serviço de API (mock do fetch)
    │   │   ├── logica.test.js  ← testes de lógica pura (filtros, formatação)
    │   │   └── setup.js        ← configuração global dos testes
    │   ├── views/
    │   │   └── TasksView.vue   ← tela principal
    │   ├── components/
    │   │   └── TaskForm.vue    ← formulário reutilizável
    │   ├── services/
    │   │   └── api.js          ← camada de integração com a API
    │   ├── App.vue
    │   └── main.js
    ├── vite.config.js          ← configuração do Vite + Vitest
    └── package.json
```

---

## Testes

```bash
cd frontend
npm test
```

```
 ✓ src/tests/logica.test.js (15)
 ✓ src/tests/api.test.js (10)
 Tests  25 passed (25)
 Duration  563ms
```

**O que é testado:**
- `api.test.js` — getTasks, createTask, updateTask, deleteTask com fetch mockado
- `logica.test.js` — filtros de tarefa, formatação de data, cores e labels de prioridade

---

## Pipeline CI

A cada push na branch `main`, o GitHub Actions executa automaticamente:

1. Instala as dependências do frontend
2. Roda os 25 testes com Vitest
3. Instala as dependências do backend
4. Valida a sintaxe do servidor Node.js

Se qualquer etapa falhar, o push é marcado com ❌ e o time é notificado.

---

## Como rodar

### Pré-requisitos

- Node.js 20+

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

---

## Autor

**Leon Nogueira Lima**
GitHub: [@leonlimask20-dot](https://github.com/leonlimask20-dot)
Email: leonlimask@gmail.com
