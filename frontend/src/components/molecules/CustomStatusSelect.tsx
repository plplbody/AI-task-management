import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { Task } from '../../types';

const statusConfig = {
  'Todo': { background: '#E9ECEF', color: '#5F5F5F' },
  'In Progress': { background: '#e9b000', color: 'white' },
  'Done': { background: '#70AD47', color: 'white' },
};

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const DropdownButton = styled.button<{ status: Task['status'] }>`
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 20px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  border: 1px solid #E9ECEF;
  background-color: ${props => statusConfig[props.status].background};
  color: ${props => statusConfig[props.status].color};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #E9ECEF;
  border-radius: 8px; /* 丸みを持たせる */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 4px;
  overflow: hidden; /* border-radiusを有効にするため */
`;

const DropdownItem = styled.div<{ status: Task['status'] }>`
  padding: 10px 12px;
  cursor: pointer;
  background-color: ${props => statusConfig[props.status].background};
  color: ${props => statusConfig[props.status].color};

  &:hover {
    opacity: 0.8;
  }
`;

interface CustomStatusSelectProps {
  value: Task['status'];
  onChange: (newStatus: Task['status']) => void;
}

const CustomStatusSelect: React.FC<CustomStatusSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (status: Task['status']) => {
    if (value !== status) {
      onChange(status);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContainer ref={containerRef}>
      <DropdownButton status={value} onClick={() => setIsOpen(!isOpen)}>
        {value}
      </DropdownButton>
      {isOpen && (
        <DropdownMenu>
          {(Object.keys(statusConfig) as Array<Task['status']>).map(status => (
            <DropdownItem
              key={status}
              status={status}
              onClick={() => handleOptionClick(status)}
            >
              {status}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default CustomStatusSelect;
