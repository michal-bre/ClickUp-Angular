import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectToPost } from '../models/task-manager.models';
import e from 'express';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = environment.apiUrl+'/api/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(project: ProjectToPost): Observable<ProjectToPost> {
    return this.http.post<ProjectToPost>(this.apiUrl, project);
  }
}