import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicStaffProfile } from '../../core/interfaces';
import { CardComponent } from '../../shared/components/card/card.component';
import {
  ToastService,
  StaffService,
  DataService,
  Patient,
} from '../../core/services';
import { StaffOnboardingComponent } from '../../shared/components/staff-onboarding/staff-onboarding.component';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, CardComponent, StaffOnboardingComponent],
  templateUrl: './staff.component.html',
  styles: [],
})
export class StaffComponent implements OnInit {
  staff: PublicStaffProfile[] = [];
  patients: Patient[] = [];
  activeFilter = 'all';
  showOnboardingModal = false;

  staffFilters = [
    { key: 'all', label: 'All Staff' },
    { key: 'doctor', label: 'Doctors' },
    { key: 'nurse', label: 'Nurses' },
    { key: 'admin', label: 'Admin Staff' },
    { key: 'pending', label: 'Pending Staff' },
  ];

  constructor(
    private dataService: DataService,
    private toastService: ToastService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.loadStaff();
    this.loadPatients();
  }

  private loadStaff(): void {
    this.staffService.getStaff({ page: 1, limit: 10 }).subscribe((staff) => {
      this.staff = staff;
    });
  }

  private loadPatients(): void {
    this.dataService.getPatients().subscribe((patients) => {
      this.patients = patients;
    });
  }

  get filteredStaff(): PublicStaffProfile[] {
    if (this.activeFilter === 'all') {
      return this.staff;
    }
    return this.staff.filter((s) => s.role === Number(this.activeFilter));
  }

  getStaffRole(role: number): string {
    return role === 1
      ? 'Admin'
      : role === 2
      ? 'Doctor'
      : role === 3
      ? 'Nurse'
      : 'NA';
  }

  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
  }

  getStaffCount(role: string): number {
    role = role === 'doctor' ? '2' : role === 'nurse' ? '3' : '1';
    if (role === 'all') {
      return this.staff.length;
    }
    return this.staff.filter((s) => s.role === Number(role)).length;
  }

  getRoleBadgeClasses(role: number): string {
    const baseClasses =
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const roleClasses = {
      '2': 'bg-blue-100 text-blue-800',
      '3': 'bg-green-100 text-green-800',
      '1': 'bg-purple-100 text-purple-800',
    };

    return `${baseClasses} ${
      roleClasses[`${role}` as keyof typeof roleClasses]
    }`;
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find((p) => p.id === patientId);
    return patient ? patient.name : `Patient #${patientId}`;
  }

  openOnboardingModal(): void {
    this.showOnboardingModal = true;
  }

  closeOnboardingModal(): void {
    this.showOnboardingModal = false;
  }

  onStaffAdded(staffData: any): void {
    this.dataService.addStaff(staffData).subscribe({
      next: (newStaff) => {
        this.toastService.success(
          'Success',
          'Staff member onboarded successfully'
        );
        this.loadStaff();
        this.closeOnboardingModal();
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to onboard staff member');
        console.error('Staff onboarding error:', error);
      },
    });
  }

  onFormToggled(showForm: boolean): void {
    if (!showForm) {
      this.closeOnboardingModal();
    }
  }
}
