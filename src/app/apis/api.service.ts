import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiError, User } from './auth.interface';

import { ApiConfigService } from '../core/services/api.config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public readonly endpoints = {
    auth: {
      login: 'auth/signin',
      sendResetPasswordLink: 'auth/forgot-password',
      resetPassword: 'auth/reset-password',
      logout: 'auth/logout',
      updateUserProfile: 'auth/update-profile/user',
      getUserProfile: 'auth/user-profile',

      registerStaff: 'auth/create',
      updateStaff: 'auth/update-profile',
    },

    staff: {
      getStaff: 'staff/list',
      getStaffById: 'staff/{userId}',
    },

    patient: {
      getSummary: 'patients/overview/{healthId}',
      generateSummary: 'patients/overview/generate/{healthId}',
      getPatients: 'patients/list',
      getPatientById: 'patients/{patientId}',
      onboardPatient: 'patients/onboard',
      updatePatient: 'patients/update/{patientId}',
      uploadReports: 'patients/health-reports/add-new',
      getReports: 'patients/health-reports/{healthId}/{page}/{limit}',
      addEvent: 'patients/health-events/add-new',
      updateEvent: 'patients/health-events/update/{healthId}',
      deleteEvent: 'patients/health-events/delete/{healthId}/{eventId}',
      getEvents: 'patients/health-events/{healthId}/{page}/{limit}',
      getMedications: 'patients/health-medications/{healthId}/{page}/{limit}/{search}',
      uploadMedications: 'patients/health-medications/add-new',
      updateMedication: 'patients/health-medications/update/{healthId}',
    },

    bot: {
      userQuery: 'medsyn-consumer/api/bot/user-query',
    },
  };

  constructor(
    private http: HttpClient,
    private configService: ApiConfigService
  ) {}

  public get storageKeys(): {
    tokenKey: string;
    refreshTokenKey: string;
    userProfileKey: string;
  } {
    return this.configService.getSessionStorageKeys();
  }

  public get client(): string | null {
    return this.configService.getClient();
  }

  /**
   * Get stored authentication token
   */
  public getStoredToken(): string | null {
    return localStorage.getItem(this.storageKeys.tokenKey);
  }

  public setStoredToken(token: string): void {
    localStorage.setItem(this.storageKeys.tokenKey, token);
  }

  public getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.storageKeys.refreshTokenKey);
  }

  public setStoredRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.storageKeys.refreshTokenKey, refreshToken);
  }

  public getStoredUserProfile(): User | null {
    const profile = localStorage.getItem(this.storageKeys.userProfileKey);
    return profile ? JSON.parse(profile) : null;
  }

  public setStoredUserProfile(userProfile: string): void {
    localStorage.setItem(this.storageKeys.userProfileKey, userProfile);
  }

  /**
   * Get full API URL for an endpoint
   */
  private getApiUrl(endpoint: string): string {
    return this.configService.getApiUrl(endpoint);
  }

  /**
   * Get full API URL for an endpoint
   */
  private getBotApiUrl(endpoint: string): string {
    return this.configService.getBotApiUrl(endpoint);
  }

  private getApiLoginUrl(endpoint: string): string {
    return this.configService.getApiLoginUrl(endpoint);
  }

  // ============ HTTP HEADERS ============ //
  /**
   * Get default HTTP headers
   */
  // TODO: Get hospital id from session storage
  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'hospital-id': this.client || '',
      Accept: 'application/json',
    });
  }

  /**
   * Get HTTP headers with authorization token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getStoredToken();
    return this.getHttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Get HTTP headers with authorization token and multipart/form-data
   * @returns HttpHeaders
   */
  private getAuthHeadersMultipart(): HttpHeaders {
    const headers = this.getAuthHeaders();
    return headers.delete('Content-Type');
  }

  // ============ REST API METHODS ============ //

  /** With Auth Headers */
  public sendPostRequest<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.getApiUrl(endpoint), body, {
      headers: this.getAuthHeaders(),
    });
  }

  /** With Auth Headers and Multipart */
  public sendMultipartRequest<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.getApiUrl(endpoint), body, {
      headers: this.getAuthHeadersMultipart(),
    });
  }

  /** Without Auth Headers */
  public sendPostNonAuthRequest<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.getApiUrl(endpoint), body, {
      headers: this.getHttpHeaders(),
    });
  }

  /**
   * LOGIN SERVICE REST METHODS
   * */
  public postLoginContainerRequest<T>(
    endpoint: string,
    request: any
  ): Observable<T> {
    return this.http.post<T>(this.getApiLoginUrl(endpoint), request, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Without Auth Headers
   * */
  public postLoginContainerNonAuthRequest<T>(
    endpoint: string,
    request: any
  ): Observable<T> {
    return this.http.post<T>(this.getApiLoginUrl(endpoint), request, {
      headers: this.getHttpHeaders(),
    });
  }

  /** With Auth Headers */
  public sendGetLoginRequest<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.getApiLoginUrl(endpoint), {
      headers: this.getAuthHeaders(),
    });
  }

  /** With Auth Headers */
  public sendGetRequest<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.getApiUrl(endpoint), {
      headers: this.getAuthHeaders(),
    });
  }

  /** Without Auth Headers */
  public sendGetNonAuthRequest<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.getApiUrl(endpoint), {
      headers: this.getHttpHeaders(),
    });
  }

  /** With Auth Headers */
  public sendDeleteRequest<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.getApiUrl(endpoint), {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Handle HTTP errors
   */
  public handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      const apiError = error.error as ApiError;
      errorMessage = apiError?.message || `Server error: ${error.status}`;
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // ============ CHATBOT ENDPOINTS ============ //
  // general user query
  public botUserQuery(userQuery: FormData) {
    console.log('userQuery', userQuery.get('query'));
    return this.http
      .post(this.getBotApiUrl(this.endpoints.bot.userQuery), userQuery, {
        headers: this.getAuthHeadersMultipart(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  // ============ UTILITY METHODS ============

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!token;
  }

  /**
   * Clear all stored authentication data
   */
  public clearStoredData(): void {
    localStorage.removeItem(this.storageKeys.tokenKey);
    localStorage.removeItem(this.storageKeys.refreshTokenKey);
    localStorage.removeItem(this.storageKeys.userProfileKey);
  }
}
