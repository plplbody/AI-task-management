const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Import uuid to generate unique IDs

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const newId = `task-${Date.now()}`;
    const result = await pool.query(
      'INSERT INTO tasks (id, title, status) VALUES ($1, $2, $3) RETURNING *',
      [newId, 'New Task', 'Todo']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, assignee, planned_start_date, planned_effort, actual_effort } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET title = $1, status = $2, assignee = $3, planned_start_date = $4, planned_effort = $5, actual_effort = $6 WHERE id = $7 RETURNING *',
      [title, status, assignee, planned_start_date, planned_effort, actual_effort, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete multiple tasks
app.post('/api/tasks/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
      return res.status(400).send('No task IDs provided.');
    }
    const result = await pool.query('DELETE FROM tasks WHERE id = ANY($1::text[])', [ids]);
    res.status(204).send(); // No Content
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all table headers
app.get('/api/headers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM table_headers ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update a table header
app.put('/api/headers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { label } = req.body;
    const result = await pool.query(
      'UPDATE table_headers SET label = $1 WHERE id = $2 RETURNING *',
      [label, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
