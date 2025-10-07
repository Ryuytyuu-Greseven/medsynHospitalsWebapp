import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../../core/services/data.service';

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-search.component.html',
  styles: []
})
export class PatientSearchComponent implements OnInit {
  @Input() patients: Patient[] = [];
  @Output() filteredPatients = new EventEmitter<Patient[]>();

  searchTerm = '';
  searchFilters = {
    name: true,
    conditions: true,
    gender: true,
    age: true
  };

  ngOnInit(): void {
    // Emit all patients initially
    this.filteredPatients.emit(this.patients);
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPatients.emit(this.patients);
      return;
    }

    const filtered = this.patients.filter(patient => {
      const term = this.searchTerm.toLowerCase();

      return (
        (this.searchFilters.name && patient.name.toLowerCase().includes(term)) ||
        (this.searchFilters.conditions && patient.conditions.some(condition =>
          condition.toLowerCase().includes(term)
        )) ||
        (this.searchFilters.gender && patient.gender.toLowerCase().includes(term)) ||
        (this.searchFilters.age && patient.age.toString().includes(term))
      );
    });

    this.filteredPatients.emit(filtered);
  }

  onFilterChange(): void {
    this.onSearchChange();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredPatients.emit(this.patients);
  }

  get searchResultsCount(): number {
    return this.patients.filter(patient => {
      if (!this.searchTerm.trim()) return true;

      const term = this.searchTerm.toLowerCase();
      return (
        (this.searchFilters.name && patient.name.toLowerCase().includes(term)) ||
        (this.searchFilters.conditions && patient.conditions.some(condition =>
          condition.toLowerCase().includes(term)
        )) ||
        (this.searchFilters.gender && patient.gender.toLowerCase().includes(term)) ||
        (this.searchFilters.age && patient.age.toString().includes(term))
      );
    }).length;
  }
}
