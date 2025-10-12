// Authentication request interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SendSignupMagicLinkRequest {
  email: string;
}

export interface CompleteSignupRequest {
  token: string;
}

export interface SendResetPasswordLinkRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Authentication response interfaces
export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: UserProfile;
  };
  message?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  role: number;
  status: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MagicLinkResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// API Error interface
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

// BUSINESS USER INTERFACE
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
