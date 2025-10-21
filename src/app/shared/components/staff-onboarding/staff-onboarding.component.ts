import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { ToastService } from '../../../core/services/toast.service';
import {
  StaffOnboardingData,
  UpdateStaffData,
} from '../../../apis/auth.interface';
import { AuthenticationService } from '../../../apis/authentication.service';

@Component({
  selector: 'app-staff-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './staff-onboarding.component.html',
  styleUrls: ['./staff-onboarding.component.css'],
})
export class StaffOnboardingComponent implements OnInit {
  @Input() showForm = false;
  @Output() staffAdded = new EventEmitter<any>();
  @Output() formToggled = new EventEmitter<boolean>();

  staffForm!: FormGroup;
  isSubmitting = false;
  updatingStaff: any = null;

  roleOptions = [
    {
      value: 2,
      label: 'Doctor',
      description: 'Medical practitioner with specialization',
    },
    {
      value: 3,
      label: 'Nurse',
      description: 'Healthcare professional providing patient care',
    },
    {
      value: 1,
      label: 'Admin Staff',
      description: 'Administrative and support staff',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private toastService: ToastService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.staffForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        licenseNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        role: [0, [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.staffForm.invalid) {
      this.markFormGroupTouched();
      this.displayFormErrors();
      return;
    }

    this.isSubmitting = true;

    const formData = this.staffForm.value;
    const staffData: StaffOnboardingData = {
      name: formData.name,
      email: formData.email,
      license: formData.licenseNumber,
      password: formData.password,
      role: Number(formData.role) as any,
    };

    this.authService.registerStaff(staffData).subscribe({
      next: (newStaff) => {
        this.isSubmitting = false;
        this.toastService.success(
          'Success',
          'Staff member onboarded successfully'
        );
        this.staffAdded.emit(newStaff);
        this.onCancel();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastService.error('Error', 'Failed to onboard staff member');
        console.error('Staff onboarding error:', error);
      },
    });
  }

  onUpdateSubmit(): void {
    if (this.staffForm.invalid) {
      this.markFormGroupTouched();
      this.displayFormErrors();
      return;
    }

    this.isSubmitting = true;

    const formData = this.staffForm.value;
    const staffData: UpdateStaffData = {
      userId: this.updatingStaff.userId,
      name: formData.name,
      license: formData.licenseNumber,
      role: Number(formData.role) as any,
    };

    this.authService.updateStaff(staffData).subscribe({
      next: (updatedStaff) => {
        this.isSubmitting = false;
        this.toastService.success(
          'Success',
          'Staff member updated successfully'
        );
        this.staffAdded.emit(updatedStaff);
        this.onCancel();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastService.error('Error', 'Failed to update staff member');
        console.error('Staff updating error:', error);
      },
    });
  }

  onCancel(): void {
    this.resetForm();
    this.formToggled.emit(false);
  }

  private resetForm(): void {
    this.staffForm.reset();
    this.isSubmitting = false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.staffForm.controls).forEach((key) => {
      const control = this.staffForm.get(key);
      control?.markAsTouched();
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

    Object.keys(this.staffForm.controls).forEach((key) => {
      const control = this.staffForm.get(key);
      if (control?.invalid && control?.touched) {
        if (key === 'name' && control.errors?.['required']) {
          errors.push('Full name is required');
        } else if (key === 'name' && control.errors?.['minlength']) {
          errors.push('Name must be at least 2 characters');
        } else if (key === 'name' && control.errors?.['maxlength']) {
          errors.push('Name cannot exceed 50 characters');
        } else if (key === 'email' && control.errors?.['required']) {
          errors.push('Email address is required');
        } else if (key === 'email' && control.errors?.['email']) {
          errors.push('Please enter a valid email address');
        } else if (key === 'licenseNumber' && control.errors?.['required']) {
          errors.push('License number is required');
        } else if (key === 'licenseNumber' && control.errors?.['minlength']) {
          errors.push('License number must be at least 5 characters');
        } else if (key === 'licenseNumber' && control.errors?.['maxlength']) {
          errors.push('License number cannot exceed 20 characters');
        } else if (key === 'password' && control.errors?.['required']) {
          errors.push('Password is required');
        } else if (key === 'password' && control.errors?.['minlength']) {
          errors.push('Password must be at least 8 characters');
        } else if (key === 'password' && control.errors?.['maxlength']) {
          errors.push('Password cannot exceed 50 characters');
        } else if (key === 'confirmPassword' && control.errors?.['required']) {
          errors.push('Password confirmation is required');
        } else if (
          key === 'confirmPassword' &&
          control.errors?.['passwordMismatch']
        ) {
          errors.push('Passwords do not match');
        } else if (key === 'role' && control.errors?.['required']) {
          errors.push('Role selection is required');
        }
      }
    });

    return errors;
  }

  getFieldError(fieldName: string): string {
    const control = this.staffForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (fieldName === 'name' && control.errors?.['required']) {
        return 'Full name is required';
      } else if (fieldName === 'name' && control.errors?.['minlength']) {
        return 'Name must be at least 2 characters';
      } else if (fieldName === 'name' && control.errors?.['maxlength']) {
        return 'Name cannot exceed 50 characters';
      } else if (fieldName === 'email' && control.errors?.['required']) {
        return 'Email address is required';
      } else if (fieldName === 'email' && control.errors?.['email']) {
        return 'Please enter a valid email address';
      } else if (
        fieldName === 'licenseNumber' &&
        control.errors?.['required']
      ) {
        return 'License number is required';
      } else if (
        fieldName === 'licenseNumber' &&
        control.errors?.['minlength']
      ) {
        return 'License number must be at least 5 characters';
      } else if (
        fieldName === 'licenseNumber' &&
        control.errors?.['maxlength']
      ) {
        return 'License number cannot exceed 20 characters';
      } else if (fieldName === 'password' && control.errors?.['required']) {
        return 'Password is required';
      } else if (fieldName === 'password' && control.errors?.['minlength']) {
        return 'Password must be at least 8 characters';
      } else if (fieldName === 'password' && control.errors?.['maxlength']) {
        return 'Password cannot exceed 50 characters';
      } else if (
        fieldName === 'confirmPassword' &&
        control.errors?.['required']
      ) {
        return 'Password confirmation is required';
      } else if (
        fieldName === 'confirmPassword' &&
        control.errors?.['passwordMismatch']
      ) {
        return 'Passwords do not match';
      } else if (fieldName === 'role' && control.errors?.['required']) {
        return 'Role selection is required';
      } else if (fieldName === 'phone' && control.errors?.['pattern']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.staffForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}
