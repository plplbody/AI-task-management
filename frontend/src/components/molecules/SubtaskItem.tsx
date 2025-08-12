import React from 'react';
import styled from 'styled-components';
import type { Subtask } from '../../types';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

const SubtaskItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 0;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  padding: 2px 6px;
  font-size: 0.7rem;
  margin-left: 10px;
`;

interface SubtaskItemProps {
  subtask: Subtask;
  onUpdate: (subtask: Subtask) => void;
  onDelete: (subtaskId: string) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, onUpdate, onDelete }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...subtask, title: e.target.value });
  };

  const handleCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...subtask, completed: e.target.checked });
  };

  return (
    <SubtaskItemContainer>
      <Checkbox type="checkbox" checked={subtask.completed} onChange={handleCompletedChange} />
      <Input
        type="text"
        value={subtask.title}
        onChange={handleTitleChange}
        onBlur={() => onUpdate(subtask)} // Save on blur
        style={{ flex: 1, fontSize: '0.9rem', padding: '4px 8px' }}
      />
      <DeleteButton onClick={() => onDelete(subtask.id)}>Delete</DeleteButton>
    </SubtaskItemContainer>
  );
};

export default SubtaskItem;
