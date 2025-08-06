import React, { useState, useRef, useEffect } from 'react';
import type { Task, Header } from '../../types';
import TaskItem from '../molecules/TaskItem';
import styled from 'styled-components';
import { AddButton, DropdownButton } from '../atoms/Button';

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
  margin-top: 1rem;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  display: block;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 220px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 5px;
  overflow: hidden;
  right: 0; 
`;

const DropdownItem = styled.button`
  color: #5F5F5F;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }

  &:disabled {
    color: #BDBDBD;
    cursor: not-allowed;
    background-color: #f9f9f9;
  }
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
  background-color: #425679; /* Blue */
  color: white;
  font-weight: 600;
  cursor: pointer;
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

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

  const handleDeleteClick = () => {
    onDeleteTasks();
    setIsMenuOpen(false);
  };

  return (
    <TableContainer>
      <ActionContainer>
        <DropdownContainer ref={dropdownRef}>
          <DropdownButton onClick={() => setIsMenuOpen(prev => !prev)}>
            ▼タスクの操作
          </DropdownButton>
          {isMenuOpen && (
            <DropdownMenu>
              <DropdownItem onClick={handleDeleteClick} disabled={selectedTaskIds.size === 0}>
                Delete Selected ({selectedTaskIds.size})
              </DropdownItem>
            </DropdownMenu>
          )}
        </DropdownContainer>
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
      <FooterActionContainer>
        <AddButton onClick={onAddTask}>+ タスクの追加</AddButton>
      </FooterActionContainer>
    </TableContainer>
  );
};

export default TaskList;
