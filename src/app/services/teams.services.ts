import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Team } from '../models/task-manager.models';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private apiUrl = environment.apiUrl+'/api/teams';
  private authApiUrl = environment.apiUrl+'/api/auth';

  constructor(private http: HttpClient) { }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  createTeam(teamData: { name: string }): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, teamData);
  }

  
  addMemberToTeam(teamId: string, emailOrUserId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${teamId}/members`, { userId: emailOrUserId });
  }
}