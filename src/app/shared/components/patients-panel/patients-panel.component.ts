import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Patient } from '../../../core/services/data.service';
import { ToastService } from '../../../core/services/toast.service';
import { CardComponent } from '../card/card.component';
import { TableComponent } from '../table/table.component';
import { PatientSearchComponent } from '../patient-search/patient-search.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-patients-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, TableComponent, PatientSearchComponent, PaginationComponent],
  templateUrl: './patients-panel.component.html',
  styles: []
})
export class PatientsPanelComponent implements OnInit {
  @Input() patients: Patient[] = [];
  @Output() patientAdmitted = new EventEmitter<number>();

  filteredPatients: Patient[] = [];
  paginatedPatients: Patient[] = [];
  admittingPatients = new Set<number>();

  // Pagination settings
  itemsPerPage = 10;
  currentPage = 1;

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
    this.filteredPatients = this.patients;
    this.updatePaginatedPatients();
  }

  onFilteredPatients(patients: Patient[]): void {
    this.filteredPatients = patients;
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePaginatedPatients();
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
      }
    });
  }
}
