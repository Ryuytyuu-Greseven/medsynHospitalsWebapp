import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Patient } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AddPatientComponent } from '../../shared/components/add-patient/add-patient.component';

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [CommonModule, CardComponent, TableComponent, ButtonComponent, AddPatientComponent],
  templateUrl: './admissions.component.html',
  styles: []
})
export class AdmissionsComponent implements OnInit {
  pendingPatients: Patient[] = [];
  recentAdmissions: any[] = [];
  admittingPatients = new Set<number>();

  // modals
  showAddPatientModal = false;

  admissionColumns = [
    { key: 'patient', label: 'Patient', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'date', label: 'Admission Date', sortable: true },
    { key: 'notes', label: 'Notes', sortable: false }
  ];

  constructor(
    private dataService: DataService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPendingAdmissions();
    this.loadRecentAdmissions();
  }

  private loadPendingAdmissions(): void {
    this.dataService.getPendingAdmissions().subscribe(patients => {
      this.pendingPatients = patients;
    });
  }

  private loadRecentAdmissions(): void {
    this.dataService.getAdmissions().subscribe(admissions => {
      this.recentAdmissions = admissions
        .filter(admission => admission.status === 'admitted')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    });
  }

  admitPatient(patientId: number): void {
    this.admittingPatients.add(patientId);

    this.dataService.admitPatient(patientId).subscribe({
      next: (result) => {
        if (result.success) {
          this.toastService.success('Success', result.message);
          this.loadPendingAdmissions();
          this.loadRecentAdmissions();
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

  getPatientName(patientId: number): string {
    // In a real app, you'd fetch this from the service
    // For now, we'll use a simple mapping
    const patientNames: { [key: number]: string } = {
      1: 'Sarah Johnson',
      2: 'Michael Chen',
      3: 'Emily Rodriguez',
      4: 'David Thompson',
      5: 'Lisa Wang'
    };
    return patientNames[patientId] || `Patient #${patientId}`;
  }

  // modals
  openAddPatientModal(): void {
    this.showAddPatientModal = true;
  }

  closeAddPatientModal(): void {
    this.showAddPatientModal = false;
  }

  onPatientAdded(patient: Patient): void {
    // this.loadPatients();
    // this.closeAddPatientModal();
  }

  onFormToggled(showForm: boolean): void {
    if (!showForm) {
      this.closeAddPatientModal();
    }
  }

}
