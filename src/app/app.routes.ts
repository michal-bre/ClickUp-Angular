import { Routes } from '@angular/router';
import { AuthComponent } from './component/auth/auth';
import { TeamsComponent } from './component/teams/teams';
import { ProjectsComponent } from './component/projects/projects';
import { TasksComponent } from './component/tasks/tasks';
import { TaskDetailsComponent } from './component/task-details/task-details';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'teams', component: TeamsComponent, canActivate: [authGuard] },
  { path: 'projects', component: ProjectsComponent, canActivate: [authGuard] },
  { path: 'projects/:teamId', component: ProjectsComponent, canActivate: [authGuard] },
  { path: 'projects/:id/tasks/:taskId', component: TaskDetailsComponent, canActivate: [authGuard] },
  { path: 'tasks', component: ProjectsComponent, canActivate: [authGuard] },
  { path: 'tasks/:projectId', component: TasksComponent, canActivate: [authGuard] },
  { path: 'task-details/:taskId', component: TaskDetailsComponent, canActivate: [authGuard] },
  { path: 'task-details', component: TaskDetailsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' } 
];
