import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { DoctorProfile, User } from '../../apis/auth.interface';
import { AuthenticationService } from '../../apis/authentication.service';
import { ToastService } from '../../core/services/toast.service';
import { StaticDataService } from '../../core/services/static-data.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  // Reactive Form
  doctorForm!: FormGroup;

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
    private staticDataService: StaticDataService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrentUser();
    this.loadStaticData();
    if (!this.currentUser?.phone) {
      this.toggleEdit();
    }
  }

  initializeForm(): void {
    this.doctorForm = this.fb.group({
      name: [{ value: '' }, [Validators.required, Validators.minLength(2)]],
      email: [{ value: '' }, [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)],
      ],
      address: ['', [Validators.required, Validators.minLength(10)]],
      department: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      licenseNumber: [
        { value: '' },
        [Validators.required, Validators.minLength(5)],
      ],
      experience: [
        0,
        [Validators.required, Validators.min(0), Validators.max(50)],
      ],
      languages: this.fb.array(
        [],
        [Validators.required, this.validateLanguagesArray]
      ),
      bio: ['', [Validators.required, Validators.minLength(20)]],
    });
    this.disableFormFields();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.getUserProfile().subscribe((user) => {
      this.currentUser = user;
      this.doctorProfile.name = this.currentUser.name;
      this.doctorProfile.email = this.currentUser.email;
      // Check if user is admin
      this.isAdmin = this.currentUser.role === 1;
      this.loadDoctorProfile();
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
      bio: this.currentUser?.bio || '',
    };

    // Update form with current profile data
    this.updateFormWithProfile();
  }

  updateFormWithProfile(): void {
    this.doctorForm.patchValue({
      name: this.doctorProfile.name,
      email: this.doctorProfile.email,
      phoneNumber: this.doctorProfile.phoneNumber,
      address: this.doctorProfile.address,
      department: this.doctorProfile.department,
      specialization: this.doctorProfile.specialization,
      licenseNumber: this.doctorProfile.licenseNumber,
      experience: this.doctorProfile.experience,
      bio: this.doctorProfile.bio,
    });
    this.disableFormFields();
    this.doctorForm.updateValueAndValidity();

    // Clear existing languages and add current ones
    const languagesArray = this.doctorForm.get('languages') as FormArray;
    languagesArray.clear();
    this.doctorProfile.languages.forEach((lang) => {
      languagesArray.push(this.fb.control(lang, Validators.required));
    });
  }

  disableFormFields(): void {
    this.doctorForm.get('name')?.disable();
    this.doctorForm.get('email')?.disable();
    this.doctorForm.get('licenseNumber')?.disable();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  addLanguage(): void {
    const languagesArray = this.doctorForm.get('languages') as FormArray;
    languagesArray.push(this.fb.control('', Validators.required));

    // Focus on the new select after Angular updates the DOM
    setTimeout(() => {
      const selects = document.querySelectorAll(
        'select[formControlName^="language-"]'
      );
      const lastSelect = selects[selects.length - 1] as HTMLSelectElement;
      if (lastSelect) {
        lastSelect.focus();
      }
    }, 0);
  }

  removeLanguage(index: number): void {
    const languagesArray = this.doctorForm.get('languages') as FormArray;
    languagesArray.removeAt(index);
  }

  get languagesArray(): FormArray {
    return this.doctorForm.get('languages') as FormArray;
  }

  trackByLanguage(index: number, item: any): any {
    return index;
  }

  saveProfile(): void {
    if (this.doctorForm.invalid) {
      this.markFormGroupTouched();
      this.displayFormErrors();
      return;
    }

    // Update doctorProfile with form values
    this.doctorProfile = {
      ...this.doctorForm.value,
      languages: this.languagesArray.value.filter(
        (lang: string) => lang.trim() !== ''
      ),
    };

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

  private markFormGroupTouched(): void {
    Object.keys(this.doctorForm.controls).forEach((key) => {
      const control = this.doctorForm.get(key);
      control?.markAsTouched();

      if (key === 'languages') {
        const languagesArray = control as FormArray;
        languagesArray.controls.forEach((langControl) => {
          langControl.markAsTouched();
        });
      }
    });
  }

  private displayFormErrors(): void {
    const formErrors = this.getFormErrors();
    if (formErrors.length > 0) {
      this.toastService.error('Validation Error', formErrors.join(', '));
    }
  }

  private getFormErrors(): string[] {
    const errors: string[] = [];

    Object.keys(this.doctorForm.controls).forEach((key) => {
      const control = this.doctorForm.get(key);
      if (control?.invalid && control?.touched) {
        if (key === 'name' && control.errors?.['required']) {
          errors.push('Full name is required');
        } else if (key === 'name' && control.errors?.['minlength']) {
          errors.push('Full name must be at least 2 characters');
        } else if (key === 'email' && control.errors?.['required']) {
          errors.push('Email address is required');
        } else if (key === 'email' && control.errors?.['email']) {
          errors.push('Please enter a valid email address');
        } else if (key === 'phoneNumber' && control.errors?.['required']) {
          errors.push('Phone number is required');
        } else if (key === 'phoneNumber' && control.errors?.['pattern']) {
          errors.push('Please enter a valid phone number');
        } else if (key === 'address' && control.errors?.['required']) {
          errors.push('Address is required');
        } else if (key === 'address' && control.errors?.['minlength']) {
          errors.push('Address must be at least 10 characters');
        } else if (key === 'department' && control.errors?.['required']) {
          errors.push('Department is required');
        } else if (key === 'specialization' && control.errors?.['required']) {
          errors.push('Specialization is required');
        } else if (key === 'licenseNumber' && control.errors?.['required']) {
          errors.push('License number is required');
        } else if (key === 'licenseNumber' && control.errors?.['minlength']) {
          errors.push('License number must be at least 5 characters');
        } else if (key === 'experience' && control.errors?.['required']) {
          errors.push('Experience is required');
        } else if (key === 'experience' && control.errors?.['min']) {
          errors.push('Experience must be 0 or greater');
        } else if (key === 'experience' && control.errors?.['max']) {
          errors.push('Experience cannot exceed 50 years');
        } else if (key === 'bio' && control.errors?.['required']) {
          errors.push('Professional bio is required');
        } else if (key === 'bio' && control.errors?.['minlength']) {
          errors.push('Professional bio must be at least 20 characters');
        } else if (key === 'languages' && control.errors?.['required']) {
          errors.push('At least one language is required');
        } else if (
          key === 'languages' &&
          control.errors?.['invalidLanguages']
        ) {
          errors.push('Please select all languages or remove empty ones');
        }
      }
    });

    return errors;
  }

  // Custom validator for languages array
  private validateLanguagesArray: ValidatorFn = (control: AbstractControl) => {
    if (!(control instanceof FormArray)) {
      return null;
    }

    const languages = control.value;
    if (!languages || languages.length === 0) {
      return { required: true };
    }

    const hasEmptyLanguages = languages.some(
      (lang: string) => !lang || !lang.trim()
    );
    if (hasEmptyLanguages) {
      return { invalidLanguages: true };
    }

    return null;
  };

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  // Helper methods to check if fields should be editable
  isFieldEditable(fieldName: string): boolean {
    // These fields are never editable by anyone
    const neverEditableFields = ['name', 'email', 'licenseNumber'];
    if (neverEditableFields.includes(fieldName)) {
      return false;
    }

    // All other fields are editable
    return true;
  }

  getFieldHelpText(fieldName: string): string {
    const neverEditableFields: { [key: string]: string } = {
      name: 'This field cannot be modified. Contact system administrator if changes are needed.',
      email:
        'This field cannot be modified. Contact system administrator if changes are needed.',
      licenseNumber:
        'This field cannot be modified. Contact system administrator if changes are needed.',
    };

    return neverEditableFields[fieldName] || '';
  }
}
