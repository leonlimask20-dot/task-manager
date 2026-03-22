const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'tasks.db'));

// Cria a tabela e insere dados de exemplo em sequência
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT    NOT NULL,
      completed  INTEGER NOT NULL DEFAULT 0,
      priority   TEXT    NOT NULL DEFAULT 'media',
      due_date   TEXT,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Insere dados de exemplo apenas se o banco estiver vazio
  db.get('SELECT COUNT(*) as total FROM tasks', (err, row) => {
    if (row && row.total === 0) {
      const insert = db.prepare(
        'INSERT INTO tasks (title, completed, priority) VALUES (?, ?, ?)'
      );
      insert.run('Estudar Vue 3 com Composition API', 0, 'alta');
      insert.run('Criar projeto com Vuetify', 0, 'alta');
      insert.run('Aprender Node.js e Express', 1, 'media');
      insert.run('Publicar projetos no GitHub', 0, 'media');
      insert.run('Preparar para entrevista técnica', 0, 'baixa');
      insert.finalize();
    }
  });
});

module.exports = db;
