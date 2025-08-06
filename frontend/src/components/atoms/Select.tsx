import styled from 'styled-components';

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
