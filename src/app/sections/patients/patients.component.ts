import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Patient } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CardComponent, TableComponent, ButtonComponent],
  templateUrl: './patients.component.html',
  styles: []
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  showAddForm = false;
  admittingPatients = new Set<number>();

  newPatient = {
    name: '',
    age: 0,
    gender: '',
    conditions: ''
  };

  patientColumns = [
    { key: 'patient', label: 'Patient', sortable: false },
    { key: 'conditions', label: 'Conditions', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  constructor(
    private dataService: DataService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  private loadPatients(): void {
    this.dataService.getPatients().subscribe(patients => {
      this.patients = patients;
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
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
        this.toggleAddForm();
        this.loadPatients();
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to add patient');
        console.error('Error adding patient:', error);
      }
    });
  }

  admitPatient(patientId: number): void {
    this.admittingPatients.add(patientId);

    this.dataService.admitPatient(patientId).subscribe({
      next: (result) => {
        if (result.success) {
          this.toastService.success('Success', result.message);
          this.loadPatients();
        } else {
          this.toastService.error('Error', result.message);
        }
        this.admittingPatients.delete(patientId);
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to admit patient');
        this.admittingPatients.delete(patientId);
        console.error('Error admitting patient:', error);
      }
    });
  }
}
