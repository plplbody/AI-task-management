import React from 'react';
import styled from 'styled-components';
import type { Subtask } from '../../types';
import { Input } from '../atoms/Input';
import CustomStatusSelect from './CustomStatusSelect';

const Td = styled.td`
  padding: 12px 20px;
  border-bottom: 1px solid #DEE2E6;
  vertical-align: middle;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

interface Header { // Added
  id: number;
  column_key: string;
  label: string;
}

interface SubtaskItemProps {
  subtask: Subtask;
  onUpdate: (subtask: Subtask) => void;
  onSelect: (subtaskId: string, isSelected: boolean) => void;
  isSelected: boolean;
  headers: Header[]; // Added
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, onUpdate, onSelect, isSelected, headers }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const originalValue = subtask[name as keyof Subtask];
    const isNumber = typeof originalValue === 'number';

    onUpdate({
      ...subtask,
      [name]: isNumber ? (value === '' ? undefined : Number(value)) : value,
    });
  };

  const handleStatusChange = (newStatus: Subtask['status']) => {
    onUpdate({ ...subtask, status: newStatus });
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(subtask.id, e.target.checked);
  };

  const renderCell = (header: Header) => {
    const columnKey = header.column_key;

    const key = columnKey as keyof Subtask;
    const value = subtask[key];

    if (columnKey === 'status') {
      return (
        <CustomStatusSelect
          value={value as Subtask['status']}
          onChange={handleStatusChange}
        />
      );
    }

    return (
      <Input
        type={columnKey.includes('date') ? 'date' : typeof subtask[key] === 'number' ? 'number' : 'text'}
        name={columnKey}
        value={typeof value === 'string' || typeof value === 'number' ? value : ''}
        onChange={handleChange}
      />
    );
  };

  return (
    <tr>
      <Td>
        <Checkbox type="checkbox" checked={isSelected} onChange={handleSelectionChange} />
      </Td>
      {headers
        .filter(h => h.column_key !== 'select' && h.column_key !== 'subtask_toggle') // Filter out 'select' and 'subtask_toggle' columns
        .map(header => (
          <Td key={header.id}>{renderCell(header)}</Td>
        ))}
    </tr>
  );
};

export default SubtaskItem;