import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Patient } from '../../../core/services/data.service';
import { ToastService } from '../../../core/services/toast.service';
import { CardComponent } from '../card/card.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent],
  templateUrl: './add-patient.component.html',
  styles: []
})
export class AddPatientComponent {
  @Input() showForm = false;
  @Output() formToggled = new EventEmitter<boolean>();
  @Output() patientAdded = new EventEmitter<Patient>();

  newPatient = {
    name: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    patientType: '',
    department: '',
    assignedDoctor: '',
    admissionDate: '',
    conditions: ''
  };

  constructor(
    private dataService: DataService,
    private toastService: ToastService
  ) {}

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
    this.formToggled.emit(this.showForm);
  }

  resetForm(): void {
    this.newPatient = {
      name: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      patientType: '',
      department: '',
      assignedDoctor: '',
      admissionDate: '',
      conditions: ''
    };
  }

  isFormValid(): boolean {
    return !!(this.newPatient.name && this.newPatient.dateOfBirth && this.newPatient.gender && this.newPatient.patientType && this.newPatient.department);
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    // Calculate age from date of birth
    const birthDate = new Date(this.newPatient.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

    const patientData = {
      name: this.newPatient.name,
      age: actualAge,
      gender: this.newPatient.gender as 'Male' | 'Female' | 'Other',
      admitted: this.newPatient.patientType === 'Inpatient',
      conditions: this.newPatient.conditions ? this.newPatient.conditions.split(',').map(c => c.trim()) : [],
      admissionDate: this.newPatient.admissionDate ? new Date(this.newPatient.admissionDate) : undefined,
      assignedDoctor: this.newPatient.assignedDoctor ? parseInt(this.newPatient.assignedDoctor) : undefined
    };

    this.dataService.addPatient(patientData).subscribe({
      next: (patient) => {
        this.toastService.success('Success', 'Patient added successfully');
        this.toggleForm();
        this.patientAdded.emit(patient);
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to add patient');
        console.error('Error adding patient:', error);
      }
    });
  }
}
