import React from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';
import styled from 'styled-components';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 12px 15px;
  border-bottom: 1px solid #444;
  background-color: #2E8B57; /* 深い緑色 */
  color: #FFFFFF; /* 白い文字色 */
  font-weight: bold;
`;

const TaskTitleTh = styled(Th)`
  width: 60%;
`;

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #444;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #3CB371; /* 少し明るい緑色 */
  }
`;

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <StyledTable>
      <thead>
        <Tr>
          <TaskTitleTh>Task</TaskTitleTh>
          <Th>Status</Th>
          <Th>Assignee</Th>
        </Tr>
      </thead>
      <tbody>
        {tasks.map((task) => <TaskItem key={task.id} task={task} />)}
      </tbody>
    </StyledTable>
  );
};

export default TaskList;