import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff';
  department?: string;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly TOKEN_KEY = 'medsyn_auth_token';
  private readonly REFRESH_TOKEN_KEY = 'medsyn_refresh_token';
  private readonly USER_KEY = 'medsyn_user';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        this.currentUserSubject.next(userData);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // TODO: Replace with actual API endpoint
    // For now, using mock data
    return new Observable(observer => {
      setTimeout(() => {
        // Mock authentication - replace with real API call
        if (credentials.email === 'admin@medsyn.com' && credentials.password === 'admin123') {
          const mockUser: User = {
            id: 1,
            email: credentials.email,
            name: 'Dr. Admin User',
            role: 'admin',
            department: 'Administration',
            permissions: ['read', 'write', 'delete', 'admin']
          };

          const mockResponse: AuthResponse = {
            user: mockUser,
            token: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now()
          };

          this.setAuthData(mockResponse);
          observer.next(mockResponse);
          observer.complete();
        } else {
          observer.error({ message: 'Invalid credentials' });
        }
      }, 1000);
    });
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
    this.toastService.success('Success', 'Logged out successfully');
  }

  requestPasswordReset(email: string): Observable<{ message: string }> {
    // TODO: Replace with actual API endpoint
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ message: 'Password reset instructions sent to your email' });
        observer.complete();
      }, 1000);
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions.includes(permission) || false;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));

    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Token refresh logic (implement when backend is ready)
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      this.logout();
      return of();
    }

    // TODO: Implement actual token refresh API call
    return new Observable(observer => {
      // For now, just return current auth data
      const user = this.getCurrentUser();
      const token = this.getToken();

      if (user && token) {
        observer.next({
          user,
          token,
          refreshToken: refreshToken
        });
        observer.complete();
      } else {
        this.logout();
        observer.error('Token refresh failed');
      }
    });
  }
}
