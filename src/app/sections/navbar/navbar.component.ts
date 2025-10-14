import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { User } from '../../apis/auth.interface';
import { AuthenticationService } from '../../apis/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  currentUser: User | null = null;
  isAuthenticated = false;
  isProfileComplete = false;

  private authSubscription: Subscription = new Subscription();

  navLinks = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Patients', route: '/patients' },
    { label: 'Staff', route: '/staff' },
    { label: 'Admissions', route: '/admissions' },
    { label: 'Insights', route: '/insights' }
  ];

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authSubscription.add(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      })
    );

    this.authSubscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        this.isProfileComplete = this.authService.isProfileComplete();
      })
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
    this.closeMobileMenu();
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    return this.currentUser.name ? this.currentUser.name
      .split(' ')
      .map((name: string) => name.charAt(0))
      .join('')
      .toUpperCase() : this.currentUser.email
      .split('@')[0]
      .charAt(0)
      .toUpperCase();
  }
}
