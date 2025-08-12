import React, { useState } from 'react';
import styled from 'styled-components';
import type { Subtask } from '../../types';
import SubtaskItem from './SubtaskItem';
import { Input } from '../atoms/Input';
import { AddButton } from '../atoms/Button';

const SubtaskListContainer = styled.div`
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 10px;
`;

const AddSubtaskContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
  onAddSubtask: (taskId: string, title: string) => void;
  onUpdateSubtask: (subtask: Subtask) => void;
  onDeleteSubtask: (subtaskId: string) => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({ taskId, subtasks, onAddSubtask, onUpdateSubtask, onDeleteSubtask }) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleAddClick = () => {
    if (newSubtaskTitle.trim()) {
      onAddSubtask(taskId, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  return (
    <SubtaskListContainer>
      {subtasks.map(subtask => (
        <SubtaskItem
          key={subtask.id}
          subtask={subtask}
          onUpdate={onUpdateSubtask}
          onDelete={onDeleteSubtask}
        />
      ))}
      <AddSubtaskContainer>
        <Input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="Add a new subtask"
          style={{ flex: 1, marginRight: '10px' }}
        />
        <AddButton onClick={handleAddClick}>Add</AddButton>
      </AddSubtaskContainer>
    </SubtaskListContainer>
  );
};

export default SubtaskList;
