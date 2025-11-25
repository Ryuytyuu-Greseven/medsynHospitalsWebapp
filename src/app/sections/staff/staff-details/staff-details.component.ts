import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicStaffProfile } from '../../../core/interfaces';
import { StaffService } from '../../../core/services/staff.service';

@Component({
  selector: 'app-staff-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.css'],
})
export class StaffDetailsComponent implements OnInit, OnChanges {
  @Input() staff: PublicStaffProfile | null = null;
  
  fullStaffDetails: any = null;
  isLoading = false;
  licenseNumber: string | null = null;

  getStaffRole(role: number): string {
    return role === 1
      ? 'Admin Staff'
      : role === 2
      ? 'Doctor'
      : role === 3
      ? 'Nurse'
      : 'Unknown';
  }

  getRoleBadgeClass(role: number): string {
    if (role === 2) return 'role-badge role-badge-doctor';
    if (role === 3) return 'role-badge role-badge-nurse';
    if (role === 1) return 'role-badge role-badge-admin';
    return 'role-badge role-badge-default';
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getInitials(name: string): string {
    if (!name) return 'NA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    if (this.staff?.userId) {
      this.loadFullStaffDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['staff'] && this.staff?.userId) {
      this.loadFullStaffDetails();
    }
  }

  private loadFullStaffDetails(): void {
    if (!this.staff?.userId) return;
    
    this.isLoading = true;
    this.staffService.getSingleStaff({ userId: this.staff.userId }).subscribe({
      next: (data) => {
        this.fullStaffDetails = data;
        this.licenseNumber = data?.license || data?.licenseNumber || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading staff details:', error);
        this.isLoading = false;
      },
    });
  }
}

