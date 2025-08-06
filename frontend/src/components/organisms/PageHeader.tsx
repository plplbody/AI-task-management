import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.header`
  background-color: #4472C4; /* Blue */
  padding: 1rem 2rem;

  h1 {
    font-size: 1.5rem;
    line-height: 1.1;
    margin: 0;
    color: white;
  }
`;

const PageHeader: React.FC = () => {
  return (
    <StyledHeader>
      <h1>Project Task Management</h1>
    </StyledHeader>
  );
};

export default PageHeader;
