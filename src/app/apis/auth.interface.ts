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
    user: User;
  };
  message?: string;
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
  userId: string;
  email: string;
  name: string;
  role: number;
  bio?: string;
  phone?: string;
  address?: string;
  department?: string;
  specialization?: string;
  license?: string;
  experience?: number;
  languages?: string[];
  profilePic?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DoctorProfile {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  department: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  languages: string[];
  bio: string;
  profileImage?: string;
}

export interface StaffOnboardingData {
  name: string;
  email: string;
  license: string;
  password: string;
  role: 1 | 2 | 3;
  phone?: string;
  specialization?: string;
}

export interface UpdateStaffData {
  userId: string;
  name: string;
  license: string;
  role: 1 | 2 | 3;
}
