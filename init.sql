-- For development, we drop tables to apply changes.
DROP TABLE IF EXISTS subtasks;
DROP TABLE IF EXISTS tasks;

-- Create tasks table with new columns for dates and effort
CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    assignee VARCHAR(255),
    planned_start_date DATE,
    planned_effort INT,
    actual_effort INT
);

-- Create subtasks table
CREATE TABLE subtasks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'Todo',
    assignee VARCHAR(255),
    planned_start_date DATE,
    planned_effort INT,
    actual_effort INT,
    task_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Insert sample data into tasks table
INSERT INTO tasks (id, title, status, assignee, planned_start_date, planned_effort, actual_effort) VALUES
('task-1', 'Design new user interface mockups', 'In Progress', 'Alice', '2025-08-01', 5, 3),
('task-2', 'Develop user authentication feature', 'Todo', 'Bob', '2025-08-05', 8, 0),
('task-3', 'Set up CI/CD pipeline', 'Done', 'Charlie', '2025-07-20', 10, 12),
('task-4', 'Write API documentation', 'Todo', NULL, '2025-08-10', 3, 0),
('task-5', 'Test cross-browser compatibility', 'In Progress', 'Alice', '2025-08-03', 5, 1);

-- Insert sample data into subtasks table
INSERT INTO subtasks (id, task_id, title, status, assignee, planned_start_date, planned_effort, actual_effort) VALUES
('subtask-1', 'task-1', 'Define color palette', 'Done', 'Alice', '2025-08-01', 2, 2),
('subtask-2', 'task-1', 'Create wireframes for main dashboard', 'In Progress', 'Alice', '2025-08-02', 3, 1),
('subtask-3', 'task-1', 'Design icons for task actions', 'Todo', NULL, '2025-08-03', 1, 0),
('subtask-4', 'task-2', 'Implement password hashing', 'Done', 'Bob', '2025-08-05', 4, 4),
('subtask-5', 'task-2', 'Set up email verification', 'Todo', 'Bob', '2025-08-06', 4, 0);