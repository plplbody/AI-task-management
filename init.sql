-- For development, we drop tables to apply changes.
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS table_headers;

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

-- Insert sample data into tasks table
INSERT INTO tasks (id, title, status, assignee, planned_start_date, planned_effort, actual_effort) VALUES
('task-1', 'Design new user interface mockups', 'In Progress', 'Alice', '2025-08-01', 5, 3),
('task-2', 'Develop user authentication feature', 'Todo', 'Bob', '2025-08-05', 8, 0),
('task-3', 'Set up CI/CD pipeline', 'Done', 'Charlie', '2025-07-20', 10, 12),
('task-4', 'Write API documentation', 'Todo', NULL, '2025-08-10', 3, 0),
('task-5', 'Test cross-browser compatibility', 'In Progress', 'Alice', '2025-08-03', 5, 1);

-- Create table_headers to store editable header labels
CREATE TABLE table_headers (
    id SERIAL PRIMARY KEY,
    column_key VARCHAR(255) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL
);

-- Insert initial header labels
INSERT INTO table_headers (column_key, label) VALUES
('title', 'Task'),
('status', 'Status'),
('assignee', 'Assignee'),
('planned_start_date', 'Start Date'),
('planned_effort', 'Planned Effort (h)'),
('actual_effort', 'Actual Effort (h)');