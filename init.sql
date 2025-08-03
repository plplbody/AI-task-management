CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    assignee VARCHAR(255)
);

INSERT INTO tasks (id, title, status, assignee) VALUES
('task-1', 'Design new user interface mockups', 'In Progress', 'Alice'),
('task-2', 'Develop user authentication feature', 'Todo', 'Bob'),
('task-3', 'Set up CI/CD pipeline', 'Done', 'Charlie'),
('task-4', 'Write API documentation', 'Todo', NULL),
('task-5', 'Test cross-browser compatibility', 'In Progress', 'Alice');
