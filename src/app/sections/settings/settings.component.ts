import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DoctorProfile, User } from '../../apis/auth.interface';
import { AuthenticationService } from '../../apis/authentication.service';
import { ToastService } from '../../core/services/toast.service';
import { StaticDataService } from '../../core/services/static-data.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  currentUser: User | null = null;
  doctorProfile: DoctorProfile = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    department: '',
    specialization: '',
    licenseNumber: '',
    experience: 0,
    languages: [],
    bio: '',
  };

  isEditing = false;
  isLoading = false;
  isSaving = false;
  isAdmin = false;

  departments: string[] = [];
  specializations: string[] = [];
  commonLanguages: string[] = [];

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastService: ToastService,
    private staticDataService: StaticDataService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDoctorProfile();
    this.loadStaticData();
    if (!this.currentUser?.phone) {
      this.toggleEdit();
    }
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.getUserProfile().subscribe((user) => {
      this.currentUser = user;
      this.doctorProfile.name = this.currentUser.name;
      this.doctorProfile.email = this.currentUser.email;
      // Check if user is admin
      this.isAdmin = this.currentUser.role === 1;
    });
  }

  loadStaticData(): void {
    this.departments = this.staticDataService.getDepartments();
    this.specializations = this.staticDataService.getSpecializations();
    this.commonLanguages = this.staticDataService.getCommonLanguages();
  }

  loadDoctorProfile(): void {
    this.doctorProfile = {
      name: this.currentUser?.name || '',
      email: this.currentUser?.email || '',
      phoneNumber: this.currentUser?.phone || '',
      address: this.currentUser?.address || '',
      department: this.currentUser?.department || '',
      specialization: this.currentUser?.specialization || '',
      licenseNumber: this.currentUser?.license || '',
      experience: this.currentUser?.experience || 0,
      languages: this.currentUser?.languages || [],
      bio: this.currentUser?.bioDescription || '',
    };
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  addLanguage(): void {
    this.doctorProfile.languages.push('');
    // Focus on the new select after Angular updates the DOM
    setTimeout(() => {
      const selects = document.querySelectorAll('select[name^="language-"]');
      const lastSelect = selects[selects.length - 1] as HTMLSelectElement;
      if (lastSelect) {
        lastSelect.focus();
      }
    }, 0);
  }

  removeLanguage(index: number): void {
    this.doctorProfile.languages.splice(index, 1);
  }

  trackByLanguage(index: number, item: string): any {
    return index;
  }

  saveProfile(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;
    this.authService.updateUserProfile(this.doctorProfile).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.toastService.success('Success', 'Profile updated successfully');
        this.isEditing = false;
        this.router.navigate(['/dashboard']);
        this.loadDoctorProfile();
      },
      error: (error) => {
        this.isSaving = false;
        this.toastService.error(
          'Error',
          error.message || 'Profile update failed'
        );
      },
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadDoctorProfile();
  }

  private validateForm(): boolean {
    // Validate all required fields
    if (!this.doctorProfile.name.trim()) {
      this.toastService.error('Error', 'Full name is required');
      return false;
    }
    if (!this.doctorProfile.email.trim()) {
      this.toastService.error('Error', 'Email address is required');
      return false;
    }
    if (!this.doctorProfile.phoneNumber.trim()) {
      this.toastService.error('Error', 'Phone number is required');
      return false;
    }
    if (!this.doctorProfile.address.trim()) {
      this.toastService.error('Error', 'Address is required');
      return false;
    }
    if (!this.doctorProfile.department) {
      this.toastService.error('Error', 'Department is required');
      return false;
    }
    if (!this.doctorProfile.specialization) {
      this.toastService.error('Error', 'Specialization is required');
      return false;
    }
    if (!this.doctorProfile.licenseNumber.trim()) {
      this.toastService.error('Error', 'License number is required');
      return false;
    }
    if (this.doctorProfile.experience < 0) {
      this.toastService.error('Error', 'Experience must be a valid number');
      return false;
    }
    if (!this.doctorProfile.bio.trim()) {
      this.toastService.error('Error', 'Professional bio is required');
      return false;
    }
    if (
      !this.doctorProfile.languages ||
      this.doctorProfile.languages.length === 0
    ) {
      this.toastService.error('Error', 'At least one language is required');
      return false;
    }
    // Check if all languages are selected (not empty)
    if (this.doctorProfile.languages.some((lang) => !lang.trim())) {
      this.toastService.error(
        'Error',
        'Please select all languages or remove empty ones'
      );
      return false;
    }
    return true;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  // Helper methods to check if fields should be editable
  isFieldEditable(fieldName: string): boolean {
    if (this.isAdmin) {
      return true; // Admin can edit all fields
    }

    // Non-admin users cannot edit sensitive fields
    const sensitiveFields = ['name', 'email', 'licenseNumber'];
    return !sensitiveFields.includes(fieldName);
  }

  getFieldHelpText(fieldName: string): string {
    if (this.isAdmin) {
      return '';
    }

    const sensitiveFields: { [key: string]: string } = {
      name: 'Contact your administrator to update your name',
      email: 'Contact your administrator to update your email address',
      licenseNumber: 'Contact your administrator to update your license number',
    };

    return sensitiveFields[fieldName] || '';
  }
}
