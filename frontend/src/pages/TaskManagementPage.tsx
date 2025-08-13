import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TaskList from '../components/organisms/TaskList';
import PageHeader from '../components/organisms/PageHeader';
import type { Task, Subtask } from '../types';
import { AppContainer } from '../AppStyles';

const MainContent = styled.main`
  padding: 2rem;
`;

const headers = [
  { id: 0, column_key: 'select', label: '' },
  { id: 1, column_key: 'subtask_toggle', label: '' },
  { id: 2, column_key: 'title', label: 'タスク内容' },
  { id: 3, column_key: 'status', label: 'ステータス' },
  { id: 4, column_key: 'assignee', label: '担当者' },
  { id: 5, column_key: 'planned_start_date', label: '開始予定日' },
  { id: 6, column_key: 'planned_effort', label: '予定工数' },
  { id: 7, column_key: 'actual_effort', label: '実績工数' },
];

function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tasksResponse = await fetch('http://localhost:3001/api/tasks');

      if (!tasksResponse.ok) {
        throw new Error('Failed to fetch data from the server.');
      }

      const tasksData = await tasksResponse.json();
      setTasks(tasksData);
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

  const handleDuplicateTasks = async () => {
    if (selectedTaskIds.size === 0) return;
    try {
      const response = await fetch('http://localhost:3001/api/tasks/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedTaskIds) }),
      });
      if (!response.ok) throw new Error('Failed to duplicate tasks.');
      await fetchData(); 
      setSelectedTaskIds(new Set());
    } catch (error) {
      console.error('Error duplicating tasks:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const handleToggleSubtasks = useCallback(async (taskId: string) => {
    const newExpandedTasks = new Set(expandedTasks);
    if (newExpandedTasks.has(taskId)) {
      newExpandedTasks.delete(taskId);
    } else {
      newExpandedTasks.add(taskId);
      const task = tasks.find(t => t.id === taskId);
      if (task && !task.subtasks) {
        try {
          const response = await fetch(`http://localhost:3001/api/tasks/${taskId}/subtasks`);
          if (!response.ok) throw new Error('Failed to fetch subtasks.');
          const subtasks = await response.json();
          setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, subtasks } : t));
        } catch (error) {
          console.error('Error fetching subtasks:', error);
          setError(error instanceof Error ? error.message : 'An unknown error occurred.');
        }
      }
    }
    setExpandedTasks(newExpandedTasks);
  }, [expandedTasks, tasks]);

  const handleAddSubtask = async (taskId: string, title: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, title }),
      });
      if (!response.ok) throw new Error('Failed to add subtask.');
      const newSubtask = await response.json();
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] } 
          : task
      ));
    } catch (error) {
      console.error('Error adding subtask:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const handleUpdateSubtask = async (updatedSubtask: Subtask) => {
    try {
      const response = await fetch(`http://localhost:3001/api/subtasks/${updatedSubtask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSubtask),
      });
      if (!response.ok) throw new Error('Failed to update subtask.');
      const data = await response.json();
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === data.task_id
          ? { ...task, subtasks: task.subtasks?.map(st => st.id === data.id ? data : st) } 
          : task
      ));
    } catch (error) {
      console.error('Error updating subtask:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/subtasks/${subtaskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete subtask.');
      setTasks(prevTasks => prevTasks.map(task => ({
        ...task,
        subtasks: task.subtasks?.filter(st => st.id !== subtaskId)
      })));
    } catch (error) {
      console.error('Error deleting subtask:', error);
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
        onAddTask={handleAddTask}
        onDeleteTasks={handleDeleteTasks}
        onDuplicateTasks={handleDuplicateTasks}
        isDuplicateDisabled={selectedTaskIds.size === 0}
        selectedTaskIds={selectedTaskIds}
        setSelectedTaskIds={setSelectedTaskIds}
        expandedTasks={expandedTasks}
        onToggleSubtasks={handleToggleSubtasks}
        onAddSubtask={handleAddSubtask}
        onUpdateSubtask={handleUpdateSubtask}
        onDeleteSubtask={handleDeleteSubtask}
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
