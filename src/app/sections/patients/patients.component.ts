import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Patient } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { AddPatientComponent } from '../../shared/components/add-patient/add-patient.component';
import { PatientsPanelComponent } from '../../shared/components/patients-panel/patients-panel.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AddPatientComponent, PatientsPanelComponent],
  templateUrl: './patients.component.html',
  styles: []
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  showAddPatientModal = false;

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

  openAddPatientModal(): void {
    this.showAddPatientModal = true;
  }

  closeAddPatientModal(): void {
    this.showAddPatientModal = false;
  }

  onPatientAdded(patient: Patient): void {
    this.loadPatients();
    this.closeAddPatientModal();
  }

  onFormToggled(showForm: boolean): void {
    if (!showForm) {
      this.closeAddPatientModal();
    }
  }

  onPatientAdmitted(patientId: number): void {
    this.loadPatients();
  }
}
