import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, LoginCredentials } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials: LoginCredentials = {
    email: '',
    password: ''
  };

  isLoading = false;
  showPasswordReset = false;
  resetEmail = '';
  isResettingPassword = false;

  returnUrl: string = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // If already authenticated, redirect to return URL
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.toastService.error('Error', 'Please enter both email and password');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.success('Success', 'Login successful');
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error('Error', error.message || 'Login failed');
      }
    });
  }

  togglePasswordReset(): void {
    this.showPasswordReset = !this.showPasswordReset;
    this.resetEmail = '';
  }

  onPasswordReset(): void {
    if (!this.resetEmail) {
      this.toastService.error('Error', 'Please enter your email address');
      return;
    }

    this.isResettingPassword = true;

    this.authService.requestPasswordReset(this.resetEmail).subscribe({
      next: (response) => {
        this.isResettingPassword = false;
        this.toastService.success('Success', response.message);
        this.showPasswordReset = false;
        this.resetEmail = '';
      },
      error: (error) => {
        this.isResettingPassword = false;
        this.toastService.error('Error', error.message || 'Password reset failed');
      }
    });
  }

  cancelPasswordReset(): void {
    this.showPasswordReset = false;
    this.resetEmail = '';
  }
}
