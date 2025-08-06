import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TaskList from '../components/organisms/TaskList';
import PageHeader from '../components/organisms/PageHeader';
import type { Task, Header as HeaderType } from '../types';
import { AppContainer } from '../AppStyles';

const MainContent = styled.main`
  padding: 2rem;
`;

function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [headers, setHeaders] = useState<HeaderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksResponse, headersResponse] = await Promise.all([
        fetch('http://localhost:3001/api/tasks'),
        fetch('http://localhost:3001/api/headers'),
      ]);

      if (!tasksResponse.ok || !headersResponse.ok) {
        throw new Error('Failed to fetch data from the server.');
      }

      const tasksData = await tasksResponse.json();
      const headersData = await headersResponse.json();

      setTasks(tasksData);
      setHeaders(headersData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) throw new Error('Failed to update task.');
      const data = await response.json();
      setTasks(prevTasks => prevTasks.map(task => (task.id === data.id ? data : task)));
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const handleUpdateHeader = async (updatedHeader: HeaderType) => {
    try {
      const response = await fetch(`http://localhost:3001/api/headers/${updatedHeader.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHeader),
      });
      if (!response.ok) throw new Error('Failed to update header.');
      const data = await response.json();
      setHeaders(prevHeaders =>
        prevHeaders.map(header => (header.id === data.id ? data : header))
      );
    } catch (error) {
      console.error('Error updating header:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/tasks', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to add task.');
      const newTask = await response.json();
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const handleDeleteTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/tasks/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedTaskIds) }),
      });
      if (!response.ok) throw new Error('Failed to delete tasks.');
      setTasks(prevTasks => prevTasks.filter(task => !selectedTaskIds.has(task.id)));
      setSelectedTaskIds(new Set());
    } catch (error) {
      console.error('Error deleting tasks:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p>Loading tasks...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    }
    return (
      <TaskList
        tasks={tasks}
        headers={headers}
        onUpdateTask={handleUpdateTask}
        onUpdateHeader={handleUpdateHeader}
        onAddTask={handleAddTask}
        onDeleteTasks={handleDeleteTasks}
        selectedTaskIds={selectedTaskIds}
        setSelectedTaskIds={setSelectedTaskIds}
      />
    );
  };

  return (
    <AppContainer>
      <PageHeader />
      <MainContent>{renderContent()}</MainContent>
    </AppContainer>
  );
}

export default TaskManagementPage;
