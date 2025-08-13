export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
  assignee?: string;
  planned_start_date?: string;
  planned_effort?: number;
  actual_effort?: number;
}

export interface Task {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
  assignee?: string;
  planned_start_date?: string;
  planned_effort?: number;
  actual_effort?: number;
  subtasks?: Subtask[];
}