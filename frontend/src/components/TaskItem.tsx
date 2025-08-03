import React, { useState } from 'react';
import type { Task, Header } from '../types';
import styled from 'styled-components';

const Td = styled.td`
  padding: 12px 20px;
  border-bottom: 1px solid #DEE2E6;
  vertical-align: middle;
`;

const Input = styled.input`
  width: 100%;
  background-color: #FFFFFF;
  color: #5F5F5F;
  border: 1px solid #CED4DA;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:focus {
    outline: none;
    border-color: #4472C4; /* Blue */
    box-shadow: 0 0 0 0.2rem rgba(68, 114, 196, 0.25);
  }
`;

const Select = styled.select`
  width: 100%;
  background-color: #FFFFFF;
  color: #5F5F5F;
  border: 1px solid #CED4DA;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:focus {
    outline: none;
    border-color: #4472C4; /* Blue */
    box-shadow: 0 0 0 0.2rem rgba(68, 114, 196, 0.25);
  }
`;

const StatusSelect = styled(Select)<{ status: Task['status'] }>`
  font-weight: 500;
  border: none;
  padding: 8px 12px;
  border-radius: 15px;
  color: white;

  ${props => {
    switch (props.status) {
      case 'Todo':
        return 'background-color: #E9ECEF; color: #5F5F5F;'; // Light Grey with dark text
      case 'In Progress':
        return 'background-color: #FFC000; color: white;'; /* Orange */
      case 'Done':
        return 'background-color: #70AD47; color: white;'; /* Green */
      default:
        return 'background-color: #E9ECEF; color: #5F5F5F;';
    }
  }}
`;

interface TaskItemProps {
  task: Task;
  headers: Header[];
  isSelected: boolean;
  onUpdateTask: (task: Task) => void;
  onSelect: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, headers, isSelected, onUpdateTask, onSelect }) => {
  const [editingTask, setEditingTask] = useState<Task>(task);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const originalValue = task[name as keyof Task];
    const isNumber = typeof originalValue === 'number';

    setEditingTask(prev => ({
      ...prev,
      [name]: isNumber ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  const handleBlur = () => {
    if (JSON.stringify(task) !== JSON.stringify(editingTask)) {
      onUpdateTask(editingTask);
    }
  };

  const renderCell = (header: Header) => {
    const key = header.column_key as keyof Task;
    const value = editingTask[key];

    if (key === 'status') {
      return (
        <StatusSelect name="status" value={value as string} onChange={handleChange} onBlur={handleBlur} status={value as Task['status']}>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </StatusSelect>
      );
    }

    return (
      <Input
        type={key.includes('date') ? 'date' : typeof task[key] === 'number' ? 'number' : 'text'}
        name={key}
        value={value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  };

  return (
    <tr>
      <Td>
        <input type="checkbox" checked={isSelected} onChange={() => onSelect(task.id)} />
      </Td>
      {headers.map(header => (
        <Td key={header.id}>{renderCell(header)}</Td>
      ))}
    </tr>
  );
};

export default TaskItem;
