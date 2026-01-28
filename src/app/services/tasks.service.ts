import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task-manager.models';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private apiUrl = 'http://localhost:3000/api/tasks';
  private commentsUrl = 'http://localhost:3000/api/comments';
  
  private selectedTask: Task | null = null;

  constructor(private http: HttpClient) {}

  setTask(task: Task): void {
    this.selectedTask = task;
  }

  getTask(): Task | null {
    return this.selectedTask;
  }

  getTasksByProject(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?projectId=${projectId}`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, updates: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, updates);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getComments(taskId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.commentsUrl}?taskId=${taskId}`);
  }

  addComment(taskId: string, text: string): Observable<any> {
    return this.http.post(this.commentsUrl, { taskId, body: text });
  }
}