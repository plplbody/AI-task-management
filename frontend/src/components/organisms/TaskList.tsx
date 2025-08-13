import React, { useState, useRef, useEffect } from 'react';
import type { Task, Subtask } from '../../types';
import TaskItem from '../molecules/TaskItem';
import styled from 'styled-components';
import { AddButton, DuplicateButton, DeleteButton } from '../atoms/Button';

const TableContainer = styled.div`
  margin-top: 2rem;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
`;

const FooterActionContainer = styled.div`
  display: flex;
  justify-content: flex-start; /* Align buttons to the left */
  gap: 10px; /* Space between buttons */
  margin-top: 1rem;
`;

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


interface Header {
  id: number;
  column_key: string;
  label: string;
}

interface TaskListProps {
  tasks: Task[];
  headers: Header[];
  selectedTaskIds: Set<string>;
  onUpdateTask: (task: Task) => void;
  onAddTask: () => void;
  onDeleteTasks: () => void;
  onDuplicateTasks: () => void;
  isDuplicateDisabled: boolean;
  setSelectedTaskIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  expandedTasks: Set<string>;
  onToggleSubtasks: (taskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onUpdateSubtask: (subtask: Subtask) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onSelectSubtask: (taskId: string, subtaskId: string, isSelected: boolean) => void;
  onDeleteSelectedSubtasks: (taskId: string) => void;
  selectedSubtaskIds: Map<string, Set<string>>;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  headers, 
  selectedTaskIds, 
  onUpdateTask, 
  onAddTask, 
  onDeleteTasks, 
  onDuplicateTasks,
  isDuplicateDisabled,
  setSelectedTaskIds, 
  expandedTasks, 
  onToggleSubtasks, 
  onAddSubtask, 
  onUpdateSubtask, 
  onDeleteSubtask,
  onSelectSubtask,
  onDeleteSelectedSubtasks,
  selectedSubtaskIds
}) => {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTaskIds(new Set(tasks.map(t => t.id)));
    } else {
      setSelectedTaskIds(new Set());
    }
  };

  const getColumnWidth = (columnKey: string): string => {
    switch (columnKey) {
      case 'select':
        return '1%';
      case 'subtask_toggle':
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
    <TableContainer>
      <ActionContainer>
        {/* No dropdown actions for now */}
      </ActionContainer>
      <StyledTable>
        <thead>
          <Tr>
            {headers.map(header => (
              <Th key={header.id} style={{ width: getColumnWidth(header.column_key) }}>
                {header.column_key === 'select' ? (
                  <input type="checkbox" onChange={handleSelectAll} checked={tasks.length > 0 && selectedTaskIds.size === tasks.length} />
                ) : (
                  header.label
                )}
              </Th>
            ))}
          </Tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              headers={headers}
              onUpdateTask={onUpdateTask}
              isSelected={selectedTaskIds.has(task.id)}
              onSelect={id => {
                const newSelection = new Set(selectedTaskIds);
                if (newSelection.has(id)) {
                  newSelection.delete(id);
                } else {
                  newSelection.add(id);
                }
                setSelectedTaskIds(newSelection);
              }}
              showSubtasks={expandedTasks.has(task.id)}
              onToggleSubtasks={onToggleSubtasks}
              onAddSubtask={onAddSubtask}
              onUpdateSubtask={onUpdateSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onSelectSubtask={onSelectSubtask}
              onDeleteSelectedSubtasks={onDeleteSelectedSubtasks}
              selectedSubtaskIds={selectedSubtaskIds}
            />
          ))}
        </tbody>
      </StyledTable>
      <FooterActionContainer>
        <AddButton onClick={onAddTask}>+ タスクの追加</AddButton>
        <DuplicateButton onClick={onDuplicateTasks} disabled={isDuplicateDisabled}>
          タスクの複製
        </DuplicateButton>
        <DeleteButton onClick={onDeleteTasks} disabled={selectedTaskIds.size === 0}>
          タスクの削除 ({selectedTaskIds.size})
        </DeleteButton>
      </FooterActionContainer>
    </TableContainer>
  );
};

export default TaskList;