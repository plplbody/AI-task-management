import { useState, useEffect } from 'react';
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

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

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