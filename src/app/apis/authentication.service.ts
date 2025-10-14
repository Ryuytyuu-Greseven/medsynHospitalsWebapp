import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import {
  AuthResponse,
  DoctorProfile,
  LoginRequest,
  MagicLinkResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendResetPasswordLinkRequest,
  User,
} from './auth.interface';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService, private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const user = this.apiService.getStoredUserProfile();
    const token = this.apiService.getStoredToken();

    if (token && user) {
      try {
        const userData = user;
        this.currentUserSubject.next(userData);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  private setAuthData(authResponse: AuthResponse): void {
    this.apiService.setStoredToken(authResponse.data.token);
    // this.apiService.setStoredRefreshToken(authResponse.refreshToken);
    // this.apiService.setStoredUserProfile(JSON.stringify(authResponse.user));

    this.currentUserSubject.next(authResponse.data.user as any);
    this.isAuthenticatedSubject.next(true);
  }

  getStoredToken(): string | null {
    return this.apiService.getStoredToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private clearAuth(): void {
    this.apiService.clearStoredData();
    // update state
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Get User Profile
   */
  getUserProfile(): Observable<User> {
    return this.apiService
      .sendGetLoginRequest<{ data: { user: User } }>(
        this.apiService.endpoints.auth.getUserProfile
      )
      .pipe(
        map((response: { data: { user: User } }) => {
          this.setCurrentUser(response.data.user);
          return response.data.user;
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }

  /**
   * Login with email and password
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.apiService
      .postLoginContainerNonAuthRequest<AuthResponse>(
        this.apiService.endpoints.auth.login,
        request
      )
      .pipe(
        map((response: AuthResponse) => {
          // Store token if login successful
          if (response.success && response.data?.token) {
            this.apiService.setStoredToken(response.data.token);
            this.setAuthData(response);
            if (response.data.refreshToken) {
              this.apiService.setStoredRefreshToken(response.data.refreshToken);
            }
            if (response.data.user) {
              this.apiService.setStoredUserProfile(
                JSON.stringify(response.data.user)
              );
            }
          }
          return response;
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }

  /**
   * Send password reset magic link to email
   */
  sendResetPasswordLink(
    request: SendResetPasswordLinkRequest
  ): Observable<MagicLinkResponse> {
    return this.apiService
      .postLoginContainerRequest<MagicLinkResponse>(
        this.apiService.endpoints.auth.sendResetPasswordLink,
        request
      )
      .pipe(catchError(this.apiService.handleError.bind(this)));
  }

  /**
   * Reset password using reset token
   */
  resetPassword(
    request: ResetPasswordRequest
  ): Observable<ResetPasswordResponse> {
    return this.apiService
      .postLoginContainerRequest<ResetPasswordResponse>(
        this.apiService.endpoints.auth.resetPassword,
        request
      )
      .pipe(catchError(this.apiService.handleError.bind(this)));
  }

  /**
   * Logout user
   */
  logout(): void {
    // const token = this.apiService.getStoredToken();
    this.apiService.clearStoredData();
    this.clearAuth();
    // return this.apiService.postLoginContainerRequest<any>(
    //   this.apiService.endpoints.auth.logout,
    //   {}
    // );
  }

  /**
   * Update user profile
   * @param user
   */
  updateUserProfile(doctorProfile: DoctorProfile): Observable<User> {
    const userData = {
      phoneNo: doctorProfile.phoneNumber,
      address: doctorProfile.address,
      department: doctorProfile.department,
      specialization: doctorProfile.specialization,
      experience: doctorProfile.experience,
      languages: doctorProfile.languages,
      bio: doctorProfile.bio,
      profilePic: '',
    };

    return this.apiService
      .postLoginContainerRequest(
        this.apiService.endpoints.auth.updateUserProfile,
        userData
      )
      .pipe(
        map((response: any) => {
          let user = this.getCurrentUser() as User;
          user = {
            ...user,

            phone: doctorProfile.phoneNumber,
            address: doctorProfile.address,
            department: doctorProfile.department,
            specialization: doctorProfile.specialization,
            experience: doctorProfile.experience,
            languages: doctorProfile.languages,
            bioDescription: doctorProfile.bio,
            profilePic: doctorProfile.profileImage,
          };
          this.updateProfileCompletion(user);
          return response;
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }

  /**
   * Check if user profile is complete based on user profile data
   */
  isProfileComplete(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Check if user has profile completion flag
    return !!user.phone;
  }

  /**
   * Update user profile completion status
   */
  updateProfileCompletion(user: User): void {
    if (!user) return;
    this.setCurrentUser(user);
  }
}
