import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginData, RegisterData } from '../models/task-manager.models';
import { environment } from '../../environment.prod'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl+'/api/auth';

  constructor(private http: HttpClient) { }

  // הרשמה: POST /api/auth/register
  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => this.setSession(res))
    );
  }

  // התחברות: POST /api/auth/login
  login(credentials: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.setSession(res))
    );
  }

  // שמירת ה-Token והמשתמש בדפדפן
  private setSession(authResult: AuthResponse) {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
  }

  // התנתקות
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // שליפת ה-Token לצורך ה-Interceptor
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // בדיקה אם המשתמש מחובר
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}