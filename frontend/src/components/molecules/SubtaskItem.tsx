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

interface SubtaskItemProps {
  subtask: Subtask;
  onUpdate: (subtask: Subtask) => void;
  onDelete: (subtaskId: string) => void;
  onSelect: (subtaskId: string, isSelected: boolean) => void;
  isSelected: boolean;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, onUpdate, onDelete, onSelect, isSelected }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...subtask, title: e.target.value });
  };

  const handleCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...subtask, completed: e.target.checked });
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(subtask.id, e.target.checked);
  };

  return (
    <SubtaskItemContainer>
      <Checkbox type="checkbox" checked={isSelected} onChange={handleSelectionChange} />
      <Input
        type="text"
        value={subtask.title}
        onChange={handleTitleChange}
        onBlur={() => onUpdate(subtask)} // Save on blur
        style={{ flex: 1, fontSize: '0.9rem', padding: '4px 8px' }}
      />
    </SubtaskItemContainer>
  );
};

export default SubtaskItem;
