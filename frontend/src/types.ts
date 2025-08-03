export interface Task {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
  assignee?: string;
  planned_start_date?: string;
  planned_effort?: number;
  actual_effort?: number;
}

export interface Header {
  id: number;
  column_key: string;
  label: string;
}
