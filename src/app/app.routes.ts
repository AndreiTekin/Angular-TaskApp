import { Routes } from '@angular/router';
import { TaskList } from './pages/task-list/task-list';
import { TaskDetail } from './pages/task-detail/task-detail';
import { TaskForm } from './pages/task-form/task-form';
import { TaskEdit } from './pages/task-edit/task-edit';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'signup', component: Signup, canActivate: [publicGuard] },
  
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'tasks', component: TaskList, canActivate: [authGuard] },
  { path: 'tasks/new', component: TaskForm, canActivate: [authGuard] },
  { path: 'tasks/:id/edit', component: TaskEdit, canActivate: [authGuard] },
  { path: 'tasks/:id', component: TaskDetail, canActivate: [authGuard] },
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' } 
]