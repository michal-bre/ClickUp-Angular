import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Team } from '../models/task-manager.models';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private apiUrl = 'http://localhost:3000/api/teams';
  private authApiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  createTeam(teamData: { name: string }): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, teamData);
  }

  // Try to find user by email - will return error if not found
  // This is a workaround since there's no direct user search endpoint
  // We'll use the auth endpoint to validate, but since it's not available,
  // we need to work with what we have
  
  addMemberToTeam(teamId: string, emailOrUserId: string): Observable<any> {
    // Send the email/userId as-is and let the backend handle it
    // The backend will need to support email lookup
    return this.http.post(`${this.apiUrl}/${teamId}/members`, { userId: emailOrUserId });
  }
}