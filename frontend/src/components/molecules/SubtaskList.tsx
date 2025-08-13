import React, { useState } from 'react';
import styled from 'styled-components';
import type { Subtask } from '../../types';
import SubtaskItem from './SubtaskItem';
import { AddButton, DeleteButton } from '../atoms/Button';

const SubtaskListContainer = styled.div`
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 10px;
`;

const FooterActionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 1rem;
`;

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
  onAddSubtask: (taskId: string, title: string) => void;
  onUpdateSubtask: (subtask: Subtask) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onSelectSubtask: (taskId: string, subtaskId: string, isSelected: boolean) => void;
  onDeleteSelectedSubtasks: (taskId: string) => void;
  selectedSubtaskIds: Map<string, Set<string>>;
}

const SubtaskList: React.FC<SubtaskListProps> = ({ 
  taskId, 
  subtasks, 
  onAddSubtask, 
  onUpdateSubtask, 
  onDeleteSubtask, 
  onSelectSubtask, 
  onDeleteSelectedSubtasks, 
  selectedSubtaskIds 
}) => {
  return (
    <SubtaskListContainer>
      {subtasks.map(subtask => (
        <SubtaskItem
          key={subtask.id}
          subtask={subtask}
          onUpdate={onUpdateSubtask}
          onDelete={onDeleteSubtask}
          onSelect={(subtaskId, isSelected) => onSelectSubtask(taskId, subtaskId, isSelected)}
          isSelected={selectedSubtaskIds && selectedSubtaskIds.get(taskId)?.has(subtask.id) || false}
        />
      ))}
      <FooterActionContainer>
        <AddButton onClick={() => onAddSubtask(taskId, 'New Subtask')}>+ サブタスクの追加</AddButton>
        <DeleteButton 
          onClick={() => onDeleteSelectedSubtasks(taskId)} 
          disabled={!selectedSubtaskIds || !selectedSubtaskIds.has(taskId) || selectedSubtaskIds.get(taskId)?.size === 0}
        >
          サブタスクの削除 ({selectedSubtaskIds && selectedSubtaskIds.get(taskId)?.size || 0})
        </DeleteButton>
      </FooterActionContainer>
    </SubtaskListContainer>
  );
};

export default SubtaskList;
