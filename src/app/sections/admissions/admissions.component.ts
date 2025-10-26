import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Patient } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AddPatientComponent } from '../../shared/components/add-patient/add-patient.component';
import { PatientService } from '../../core/services/patient.service';
import { PublicPatientProfile } from '../../core/interfaces';

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TableComponent,
    ButtonComponent,
    AddPatientComponent,
  ],
  templateUrl: './admissions.component.html',
  styles: [],
})
export class AdmissionsComponent implements OnInit {
  pendingPatients: Patient[] = [];
  recentAdmissions: PublicPatientProfile[] = [];
  admittingPatients = new Set<number>();

  // modals
  showAddPatientModal = false;

  admissionColumns = [
    { key: 'patient', label: 'Patient', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'date', label: 'Admission Date', sortable: true },
    // { key: 'notes', label: 'Notes', sortable: false },
  ];

  constructor(
    private dataService: DataService,
    private patientService: PatientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPendingAdmissions();
    this.loadRecentAdmissions();
  }

  private loadPendingAdmissions(): void {
    this.dataService.getPendingAdmissions().subscribe((patients) => {
      this.pendingPatients = patients;
    });
  }

  private loadRecentAdmissions(): void {
    this.patientService
      .getPatients({ page: 1, limit: 5 })
      .subscribe((patients) => {
        this.recentAdmissions = patients;
      });
  }

  admitPatient(patientId: number): void {
    this.loadRecentAdmissions();
  }

  // modals
  openAddPatientModal(): void {
    this.showAddPatientModal = true;
  }

  closeAddPatientModal(): void {
    this.showAddPatientModal = false;
  }

  onPatientAdded(patient: Patient): void {
    this.loadRecentAdmissions();
  }

  onFormToggled(showForm: boolean): void {
    if (!showForm) {
      this.closeAddPatientModal();
    }
  }
}
