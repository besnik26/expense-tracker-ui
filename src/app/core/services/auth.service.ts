import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../features/auth/interfaces/login-request.interface';
import { LoginResponse } from '../../features/auth/interfaces/login-response.interface';
import { User, AuthResponse } from '../models/user.model';
import { RegisterRequest } from '../../features/auth/interfaces/register-request.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  
  
  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/api/auth/register`,
      payload
    );
  }


  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/api/auth/login`,
      credentials
    ).pipe(
      tap((res) => {
        if (res.success) {
          this.saveSession(res.data.token, res.data.user);
        }
      })
    );
  }


  private saveSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}