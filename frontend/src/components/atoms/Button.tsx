import styled from 'styled-components';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
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

export const AddButton = styled(Button)`
  background-color: #FFFFFF;
  color: #5F5F5F;
  border: 1px solid #DEE2E6;

  &:hover {
    background-color: #F8F9FA;
    opacity: 1;
  }
`;

export const DropdownButton = styled(Button)`
  background-color: #FFFFFF;
  color: #5F5F5F;
  border: 1px solid #DEE2E6;

  &:hover {
    background-color: #F8F9FA;
    opacity: 1;
  }
`;
