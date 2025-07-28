import { useState } from 'react';
import TaskList from './components/TaskList';
import type { Task } from './types';
import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  h1 {
    font-size: 2.5em;
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }
`;

const initialTasks: Task[] = [
  { id: 'task-1', title: 'Design new user interface mockups', status: 'In Progress', assignee: 'Alice' },
  { id: 'task-2', title: 'Develop user authentication feature', status: 'Todo', assignee: 'Bob' },
  { id: 'task-3', title: 'Set up CI/CD pipeline', status: 'Done', assignee: 'Charlie' },
  { id: 'task-4', title: 'Write API documentation', status: 'Todo' },
  { id: 'task-5', title: 'Test cross-browser compatibility', status: 'In Progress', assignee: 'Alice' },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // In the future, you can add functions here to handle task updates.
  // e.g., addTask, updateTaskStatus, etc.

  return (
    <AppContainer>
      <Header>
        <h1>Project Tasks</h1>
      </Header>
      <main>
        <TaskList tasks={tasks} />
      </main>
    </AppContainer>
  );
}

export default App;