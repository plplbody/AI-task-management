const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ----------------------------------------------------------------
// Tasks API
// ----------------------------------------------------------------

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
    await pool.query('DELETE FROM tasks WHERE id = ANY($1::text[])', [ids]);
    res.status(204).send(); // No Content
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Duplicate multiple tasks
app.post('/api/tasks/duplicate', async (req, res) => {
  const { ids } = req.body;
  if (!ids || ids.length === 0) {
    return res.status(400).send('No task IDs provided.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const duplicatedTasks = [];
    for (const id of ids) {
      // 1. Duplicate the main task
      const taskResult = await client.query('SELECT * FROM tasks WHERE id = $1', [id]);
      const originalTask = taskResult.rows[0];
      if (!originalTask) continue;

      const newTaskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newTaskTitle = `${originalTask.title} (Copy)`;
      
      const duplicatedTaskResult = await client.query(
        'INSERT INTO tasks (id, title, status, assignee, planned_start_date, planned_effort, actual_effort) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [newTaskId, newTaskTitle, originalTask.status, originalTask.assignee, originalTask.planned_start_date, originalTask.planned_effort, originalTask.actual_effort]
      );
      duplicatedTasks.push(duplicatedTaskResult.rows[0]);

      // 2. Duplicate subtasks
      const subtasksResult = await client.query('SELECT * FROM subtasks WHERE task_id = $1', [id]);
      const originalSubtasks = subtasksResult.rows;

      for (const subtask of originalSubtasks) {
        const newSubtaskId = `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await client.query(
          'INSERT INTO subtasks (id, task_id, title, status, assignee, planned_start_date, planned_effort, actual_effort) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [newSubtaskId, newTaskId, subtask.title, subtask.status, subtask.assignee, subtask.planned_start_date, subtask.planned_effort, subtask.actual_effort]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(duplicatedTasks);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
});

// ----------------------------------------------------------------
// Subtasks API
// ----------------------------------------------------------------

// Get all subtasks for a specific task
app.get('/api/tasks/:taskId/subtasks', async (req, res) => {
    try {
        const { taskId } = req.params;
        const result = await pool.query('SELECT * FROM subtasks WHERE task_id = $1 ORDER BY id', [taskId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Create a new subtask
app.post('/api/subtasks', async (req, res) => {
    try {
        const { task_id, title, status, assignee, planned_start_date, planned_effort, actual_effort } = req.body;
        const newId = `subtask-${Date.now()}`;
        const result = await pool.query(
            'INSERT INTO subtasks (id, task_id, title, status, assignee, planned_start_date, planned_effort, actual_effort) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [newId, task_id, title, status || 'Todo', assignee, planned_start_date, planned_effort, actual_effort]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update a subtask
app.put('/api/subtasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status, assignee, planned_start_date, planned_effort, actual_effort } = req.body;
        const result = await pool.query(
            'UPDATE subtasks SET title = $1, status = $2, assignee = $3, planned_start_date = $4, planned_effort = $5, actual_effort = $6 WHERE id = $7 RETURNING *',
            [title, status, assignee, planned_start_date, planned_effort, actual_effort, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Delete a subtask
app.delete('/api/subtasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM subtasks WHERE id = $1', [id]);
        res.status(204).send(); // No Content
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});





app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
