import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectToPost } from '../models/task-manager.models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient) {}

  // קבלת כל הפרויקטים של הצוותים בהם המשתמש חבר [cite: 21]
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  // יצירת פרויקט חדש עבור צוות ספציפי [cite: 22]
  createProject(project: ProjectToPost): Observable<ProjectToPost> {
    return this.http.post<ProjectToPost>(this.apiUrl, project);
  }
}