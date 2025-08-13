import styled from 'styled-components';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: opacity 0.2s;

  &:disabled {
    color: white;
    background-color: #BDBDBD;
    cursor: not-allowed;
    opacity: 0.5;

    &:hover{
      color: white;
      background-color: #BDBDBD;
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;

export const AddButton = styled(Button)`
  background-color: #FFFFFF;
  color: #5F5F5F;
  border: 1px solid #DEE2E6;

  &:hover {
    background-color: #E9ECEF;
    opacity: 1;
  }
`;

export const DuplicateButton = styled(Button)`
  background-color: #FFFFFF;
  color: #5F5F5F;
  border: 1px solid #DEE2E6;

  &:hover {
    background-color: #E9ECEF;
    opacity: 1;
  }
`;

export const DeleteButton = styled(Button)`
  color: #FFF;
  background-color: #dc3545;

  &:hover {
    opacity: 0.8;
  }
`;
