import React from 'react';
import type { Task } from '../types';
import styled from 'styled-components';

const StatusLabel = styled.span<{ status: Task['status'] }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
  color: #fff;
  text-align: center;
  display: inline-block;

  ${props => {
    switch (props.status) {
      case 'Todo':
        return 'background-color: #808080;';
      case 'In Progress':
        return 'background-color: #3498db;';
      case 'Done':
        return 'background-color: #2ecc71;';
      default:
        return '';
    }
  }}
`;

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #444;
`;

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <tr>
      <Td>{task.title}</Td>
      <Td><StatusLabel status={task.status}>{task.status}</StatusLabel></Td>
      <Td>{task.assignee || 'Unassigned'}</Td>
    </tr>
  );
};

export default TaskItem;