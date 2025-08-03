import React, { useState } from 'react';
import type { Task, Header } from '../types';
import TaskItem from './TaskItem';
import styled from 'styled-components';

const TableContainer = styled.div`
  margin-top: 2rem;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    background-color: #BDBDBD;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #FFC000; /* Orange */
`;

const AddButton = styled(Button)`
  background-color: #70AD47; /* Green */
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  background-color: #FFFFFF;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 16px 20px;
  background-color: #4472C4; /* Blue */
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const Tr = styled.tr`
  &:nth-of-type(even) {
    background-color: #F8F9FA;
  }
  &:hover {
    background-color: #F1F3F5;
  }
`;

interface TaskListProps {
  tasks: Task[];
  headers: Header[];
  selectedTaskIds: Set<string>;
  onUpdateTask: (task: Task) => void;
  onUpdateHeader: (header: Header) => void;
  onAddTask: () => void;
  onDeleteTasks: () => void;
  setSelectedTaskIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, headers, selectedTaskIds, onUpdateTask, onUpdateHeader, onAddTask, onDeleteTasks, setSelectedTaskIds }) => {
  const [editingHeaderId, setEditingHeaderId] = useState<number | null>(null);
  const [headerLabel, setHeaderLabel] = useState('');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTaskIds(new Set(tasks.map(t => t.id)));
    } else {
      setSelectedTaskIds(new Set());
    }
  };

  const handleHeaderClick = (header: Header) => {
    setEditingHeaderId(header.id);
    setHeaderLabel(header.label);
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderLabel(e.target.value);
  };

  const handleHeaderBlur = (header: Header) => {
    setEditingHeaderId(null);
    if (header.label !== headerLabel) {
      onUpdateHeader({ ...header, label: headerLabel });
    }
  };

  return (
    <TableContainer>
      <ActionContainer>
        <DeleteButton onClick={onDeleteTasks} disabled={selectedTaskIds.size === 0}>
          Delete Selected ({selectedTaskIds.size})
        </DeleteButton>
        <AddButton onClick={onAddTask}>Add New Task</AddButton>
      </ActionContainer>
      <StyledTable>
        <thead>
          <Tr>
            <Th style={{ width: '40px' }}>
              <input type="checkbox" onChange={handleSelectAll} checked={tasks.length > 0 && selectedTaskIds.size === tasks.length} />
            </Th>
            {headers.map(header => (
              <Th key={header.id} onClick={() => handleHeaderClick(header)}>
                {editingHeaderId === header.id ? (
                  <input
                    type="text"
                    value={headerLabel}
                    onChange={handleHeaderChange}
                    onBlur={() => handleHeaderBlur(header)}
                    autoFocus
                  />
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
            />
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default TaskList;