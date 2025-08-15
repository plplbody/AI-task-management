import React, { useState, Fragment } from 'react';
import type { Task, Subtask } from '../../types';
import styled from 'styled-components';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import CustomStatusSelect from './CustomStatusSelect';
import SubtaskList from './SubtaskList';

const Td = styled.td`
  padding: 12px 20px;
  border-bottom: 1px solid #DEE2E6;
  vertical-align: middle;
`;

const SubtaskToggleButton = styled(Button)`
  background-color: transparent;
  color: #5F5F5F;
  padding: 4px 8px;
  font-size: 0.75rem;

  &:hover {
    background-color: #E9ECEF;
    opacity: 1;
  }
`;

interface Header {
  id: number;
  column_key: string;
  label: string;
}

interface TaskItemProps {
  task: Task;
  headers: Header[];
  isSelected: boolean;
  onUpdateTask: (task: Task) => void;
  onSelect: (id: string) => void;
  onToggleSubtasks: (taskId: string) => void;
  onAddSubtask: (taskId: string) => void;
  onUpdateSubtask: (subtask: Subtask) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  showSubtasks: boolean;
  onSelectSubtask: (taskId: string, subtaskId: string, isSelected: boolean) => void;
  onDeleteSelectedSubtasks: (taskId: string) => void;
  selectedSubtaskIds: Map<string, Set<string>>;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  headers, 
  isSelected, 
  onUpdateTask, 
  onSelect, 
  onToggleSubtasks,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  showSubtasks,
  onSelectSubtask,
  onDeleteSelectedSubtasks,
  selectedSubtaskIds
}) => {
  const [editingTask, setEditingTask] = useState<Task>(task);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const originalValue = task[name as keyof Task];
    const isNumber = typeof originalValue === 'number';

    setEditingTask(prev => ({
      ...prev,
      [name]: isNumber ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    const updatedTask = { ...editingTask, status: newStatus };
    setEditingTask(updatedTask);
    onUpdateTask(updatedTask);
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
        <CustomStatusSelect
          value={value as Task['status']}
          onChange={handleStatusChange}
        />
      );
    }

    return (
      <Input
        type={key.includes('date') ? 'date' : typeof task[key] === 'number' ? 'number' : 'text'}
        name={key}
        value={typeof value === 'string' || typeof value === 'number' ? value : ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  };

  return (
    <Fragment>
      <tr>
        <Td>
          <input type="checkbox" checked={isSelected} onChange={() => onSelect(task.id)} />
        </Td>
        <Td>
          <SubtaskToggleButton onClick={() => onToggleSubtasks(task.id)}>
            {showSubtasks ? '▼' : '▶'}
          </SubtaskToggleButton>
        </Td>
        {headers.filter(h => h.column_key !== 'select' && h.column_key !== 'subtask_toggle').map(header => (
          <Td key={header.id}>{renderCell(header)}</Td>
        ))}
      </tr>
      {showSubtasks && (
        <tr>
          <Td colSpan={headers.length}>
            <SubtaskList
              taskId={task.id}
              subtasks={task.subtasks || []}
              onAddSubtask={onAddSubtask}
              onUpdateSubtask={onUpdateSubtask}
              onSelectSubtask={onSelectSubtask}
              onDeleteSelectedSubtasks={onDeleteSelectedSubtasks}
              selectedSubtaskIds={selectedSubtaskIds}
              headers={headers}
            />
          </Td>
        </tr>
      )}
    </Fragment>
  );
};

export default TaskItem;
