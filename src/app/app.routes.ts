import { Routes } from '@angular/router';
import { TaskList } from './pages/task-list/task-list';
import { TaskDetail } from './pages/task-detail/task-detail';
import { TaskForm } from './pages/task-form/task-form';
import { TaskEdit } from './pages/task-edit/task-edit';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskList },
  { path: 'tasks/new', component: TaskForm },
  { path: 'tasks/:id/edit', component: TaskEdit },
  { path: 'tasks/:id', component: TaskDetail }
]