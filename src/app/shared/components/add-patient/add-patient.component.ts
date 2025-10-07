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
    age: 0,
    gender: '',
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
      age: 0,
      gender: '',
      conditions: ''
    };
  }

  isFormValid(): boolean {
    return !!(this.newPatient.name && this.newPatient.age && this.newPatient.gender);
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    const patientData = {
      name: this.newPatient.name,
      age: this.newPatient.age,
      gender: this.newPatient.gender as 'Male' | 'Female' | 'Other',
      admitted: false,
      conditions: this.newPatient.conditions ? this.newPatient.conditions.split(',').map(c => c.trim()) : []
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
