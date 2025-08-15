import React from 'react';
import styled from 'styled-components';
import type { Subtask } from '../../types';
import SubtaskItem from './SubtaskItem';
import { AddButton, DeleteButton } from '../atoms/Button';

// Styled components copied from TaskList.tsx
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  background-color: #FFFFFF;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  table-layout: fixed;
`;

const Th = styled.th`
  padding: 16px 20px;
  background-color: #425679; /* Blue */
  color: white;
  font-weight: 600;
  font-size: 1rem;
`;

const Tr = styled.tr`
  &:nth-of-type(even) {
    background-color: #F8F9FA;
  }
  &:hover {
    background-color: #F1F3F5;
  }
`;

const FooterActionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 1rem;
`;

interface Header { // Copied from TaskList.tsx
  id: number;
  column_key: string;
  label: string;
}

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
  onAddSubtask: (taskId: string) => void;
  onUpdateSubtask: (subtask: Subtask) => void;
  onSelectSubtask: (taskId: string, subtaskId: string, isSelected: boolean) => void;
  onDeleteSelectedSubtasks: (taskId: string) => void;
  selectedSubtaskIds: Map<string, Set<string>>;
  headers: Header[];
}

const SubtaskList: React.FC<SubtaskListProps> = ({ 
  taskId, 
  subtasks, 
  onAddSubtask, 
  onUpdateSubtask, 
  onSelectSubtask, 
  onDeleteSelectedSubtasks, 
  selectedSubtaskIds,
  headers
}) => {
  const getColumnWidth = (columnKey: string): string => { // Copied from TaskList.tsx
    switch (columnKey) {
      case 'select':
        return '1%';
      case 'title':
        return 'auto';
      case 'assignee':
        return '10%';
      case 'planned_start_date':
        return '10%';
      case 'status':
        return '7%';
      case 'planned_effort':
        return '5%';
      case 'actual_effort':
        return '5%';
      default:
        return 'auto';
    }
  };

  return (
    <>
      <StyledTable>
        <thead>
          <Tr>
            {headers
              .filter(header => header.column_key !== 'subtask_toggle')
              .map(header => (
              <Th key={header.id} style={{ width: getColumnWidth(header.column_key) }}>
                {header.column_key === 'select' ? (
                  ''
                ) : (
                  header.label
                )}
              </Th>
            ))}
          </Tr>
        </thead>
        <tbody>
          {subtasks.map(subtask => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              onUpdate={onUpdateSubtask}
              onSelect={(subtaskId, isSelected) => onSelectSubtask(taskId, subtaskId, isSelected)}
              isSelected={selectedSubtaskIds && selectedSubtaskIds.get(taskId)?.has(subtask.id) || false}
              headers={headers}
            />
          ))}
        </tbody>
      </StyledTable>
      <FooterActionContainer>
        <AddButton onClick={() => onAddSubtask(taskId)}>+ サブタスクの追加</AddButton>
        <DeleteButton 
          onClick={() => onDeleteSelectedSubtasks(taskId)} 
          disabled={!selectedSubtaskIds || !selectedSubtaskIds.has(taskId) || selectedSubtaskIds.get(taskId)?.size === 0}
        >
          サブタスクの削除 ({selectedSubtaskIds && selectedSubtaskIds.get(taskId)?.size || 0})
        </DeleteButton>
      </FooterActionContainer>
    </>
  );
};

export default SubtaskList;