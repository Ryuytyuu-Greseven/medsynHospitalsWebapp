import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataService, Patient } from '../../../core/services/data.service';
import { ToastService } from '../../../core/services/toast.service';
import { PatientService } from '../../../core/services/patient.service';
import { NewPatient, PublicPatientProfile } from '../../../core/interfaces';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-patient.component.html',
  styles: [],
})
export class AddPatientComponent {
  @Input() showForm = false;
  @Output() formToggled = new EventEmitter<boolean>();
  @Output() patientAdded = new EventEmitter<Patient>();

  // Health ID lookup state
  healthId = '';
  showPatientForm = false;
  isLookingUp = false;
  lookupResult: { found: boolean; patient: PublicPatientProfile } | null = null;

  patientForm!: FormGroup;

  constructor(
    private dataService: DataService,
    private toastService: ToastService,
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      phone: [''],
      email: ['', [Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      patientType: ['', [Validators.required]],
      admissionDate: [''],
      conditions: [''],
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
    this.formToggled.emit(this.showForm);
  }

  onHealthIdInput(event: any): void {
    // Ensure only alphanumeric characters and hyphens, limit to 24 characters
    this.healthId = event.target.value
      .replace(/[^a-zA-Z0-9-]/g, '')
      .substring(0, 24);
  }

  lookupHealthId(): void {
    if (this.healthId.length !== 24) {
      this.toastService.error(
        'Error',
        'Health ID must be exactly 24 characters'
      );
      return;
    }

    this.isLookingUp = true;
    this.lookupResult = null;

    this.patientService
      .getSinglePatient({ patientId: this.healthId })
      .subscribe({
        next: (patient: PublicPatientProfile) => {
          if (patient?.name) {
            this.lookupResult = { found: true, patient: patient };
            this.toastService.success(
              'Success',
              `${patient.name} is already registered in the system. Redirecting to patient details...`
            );
          } else {
            this.lookupResult = {
              found: false,
              patient: {} as PublicPatientProfile,
            };
            this.isLookingUp = false;
            console.log('Patient not found', this.lookupResult);
            this.toastService.info(
              'Info',
              'Patient not found - you can create a new record'
            );
          }
        },
        error: (error) => {
          this.lookupResult = {
            found: false,
            patient: {} as PublicPatientProfile,
          };
          this.isLookingUp = false;
          this.toastService.error('Error', 'Failed to lookup patient');
          console.error('Error looking up patient:', error);
        },
        complete: () => {
          this.isLookingUp = false;
        },
      });
  }

  proceedWithoutHealthId(): void {
    this.showPatientForm = true;
    this.toastService.info(
      'Info',
      'Proceeding without Health ID - creating new patient record'
    );
  }

  proceedToForm(): void {
    this.showPatientForm = true;
  }

  viewExistingPatient(): void {
    if (this.lookupResult) {
      this.toastService.info(
        'Info',
        `Redirecting to patient: ${this.lookupResult.patient.name}`
      );
      // In real implementation, this would navigate to patient details
      this.toggleForm();
    }
  }

  resetForm(): void {
    this.patientForm.reset();

    // Reset Health ID lookup state
    this.healthId = '';
    this.showPatientForm = false;
    this.isLookingUp = false;
    this.lookupResult = null;
  }

  isFormValid(): boolean {
    return this.patientForm.valid;
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    const formValue = this.patientForm.value;
    const paylod: NewPatient = {
      name: formValue.name,
      dateOfBirth: formValue.dateOfBirth,
      gender: formValue.gender as 'male' | 'female' | 'prefer_not_to_say',
      email: formValue.email,
      phone: formValue.phone,
      address: formValue.address,
      medicalOnboard: {
        type: formValue.patientType,
        admissionDate: formValue.admissionDate
          ? new Date(formValue.admissionDate).toISOString()
          : new Date().toISOString(),
        medicalConditions: formValue.conditions || '',
      },
    };

    this.patientService.onboardPatient(paylod).subscribe({
      next: (patient) => {
        this.toastService.success('Success', 'Patient added successfully');
        this.toggleForm();
        this.patientAdded.emit(patient);
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to add patient');
        console.error('Error adding patient:', error);
      },
    });
  }
}
