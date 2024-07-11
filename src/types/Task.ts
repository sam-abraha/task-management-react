export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
}
