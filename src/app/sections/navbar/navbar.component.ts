import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

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
    private authService: AuthService
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
    this.closeMobileMenu();
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    return this.currentUser.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase();
  }
}
