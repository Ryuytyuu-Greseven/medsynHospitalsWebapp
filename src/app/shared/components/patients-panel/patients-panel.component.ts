import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Patient } from '../../../core/services/data.service';
import { ToastService } from '../../../core/services/toast.service';
import { CardComponent } from '../card/card.component';
import { TableComponent } from '../table/table.component';
import { PatientSearchComponent } from '../patient-search/patient-search.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { PatientService } from '../../../core/services/patient.service';
import { PublicPatientProfile } from '../../../core/interfaces';

@Component({
  selector: 'app-patients-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardComponent,
    TableComponent,
    PatientSearchComponent,
    PaginationComponent,
  ],
  templateUrl: './patients-panel.component.html',
  styles: [],
})
export class PatientsPanelComponent implements OnInit {
  @Input() patients: PublicPatientProfile[] = [];
  @Output() patientAdmitted = new EventEmitter<number>();

  filteredPatients: Patient[] = [];
  paginatedPatients: Patient[] = [];
  admittingPatients = new Set<number>();

  // Search and filter
  searchTerm = '';
  selectedDepartment = '';
  selectedStatus = '';

  // Pagination settings
  itemsPerPage = 10;
  currentPage = 1;

  constructor(
    private patientService: PatientService,
    private dataService: DataService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRecentAdmissions();
    // this.filteredPatients = this.patients;
    this.updatePaginatedPatients();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }
  private loadRecentAdmissions(): void {
    this.patientService
      .getPatients({ page: 1, limit: 5 })
      .subscribe((patients) => {
        this.patients = patients;
      });
  }

  private applyFilters(): void {
    // let filtered = [...this.patients];

    // // Search filter
    // if (this.searchTerm) {
    //   const term = this.searchTerm.toLowerCase();
    //   filtered = filtered.filter(
    //     (patient) =>
    //       patient.name.toLowerCase().includes(term) ||
    //       patient.id.toString().includes(term)
    //   );
    // }

    // // Status filter
    // if (this.selectedStatus) {
    //   if (this.selectedStatus === 'admitted') {
    //     filtered = filtered.filter((patient) => patient.admitted);
    //   } else if (this.selectedStatus === 'discharged') {
    //     filtered = filtered.filter((patient) => !patient.admitted);
    //   }
    // }

    // // this.filteredPatients = filtered;
    // this.currentPage = 1; // Reset to first page when filtering
    // this.updatePaginatedPatients();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPatients();
  }

  private updatePaginatedPatients(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPatients = this.filteredPatients.slice(startIndex, endIndex);
  }

  getAssignedDoctor(doctorId?: number): string {
    if (!doctorId) return '-';
    // This would typically fetch from a doctors service
    const doctors: { [key: number]: string } = {
      1: 'Dr. James Wilson',
      2: 'Dr. Maria Garcia',
    };
    return doctors[doctorId] || '-';
  }

  admitPatient(patientId: number): void {
    this.admittingPatients.add(patientId);

    this.dataService.admitPatient(patientId).subscribe({
      next: (result) => {
        if (result.success) {
          this.toastService.success('Success', result.message);
          this.patientAdmitted.emit(patientId);
        } else {
          this.toastService.error('Error', result.message);
        }
        this.admittingPatients.delete(patientId);
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to admit patient');
        this.admittingPatients.delete(patientId);
        console.error('Error admitting patient:', error);
      },
    });
  }
}
