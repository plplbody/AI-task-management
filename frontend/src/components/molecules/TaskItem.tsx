import React, { useState } from 'react';
import type { Task, Header } from '../../types';
import styled from 'styled-components';
import { Input } from '../atoms/Input';
import { StatusSelect } from '../atoms/Select';

const Td = styled.td`
  padding: 12px 20px;
  border-bottom: 1px solid #DEE2E6;
  vertical-align: middle;
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
