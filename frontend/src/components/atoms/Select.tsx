import styled from 'styled-components';
import type { Task } from '../../types';

export const Select = styled.select`
  width: 100%;
  background-color: #FFFFFF;
  color: #5F5F5F;
  border: 1px solid #CED4DA;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:focus {
    outline: none;
    border-color: #4472C4; /* Blue */
    box-shadow: 0 0 0 0.2rem rgba(68, 114, 196, 0.25);
  }
`;

export const StatusSelect = styled(Select)<{ status: Task['status'] }>`
  font-weight: 500;
  border: none;
  padding: 8px 12px;
  border-radius: 15px;
  color: white;

  ${props => {
    switch (props.status) {
      case 'Todo':
        return 'background-color: #E9ECEF; color: #5F5F5F;'; // Light Grey with dark text
      case 'In Progress':
        return 'background-color: #e9b000; color: white;'; /* Orange */
      case 'Done':
        return 'background-color: #70AD47; color: white;'; /* Green */
      default:
        return 'background-color: #E9ECEF; color: #5F5F5F;';
    }
  }}
`;
