import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'discontinued' | 'paused';
  notes?: string;
  prescribedBy?: string;
  discontinueReason?: string;
}

@Component({
  selector: 'app-medications',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.css']
})
export class MedicationsComponent {
  @Input() medications: Medication[] = [];

  // Modal state
  showMedicationsModal = false;
  medicationSearchTerm = '';
  selectedStatusFilter = 'all';
  filteredMedications: Medication[] = [];

  // Sample discontinued medications for demo
  discontinuedMedications: Medication[] = [
    {
      id: 101,
      name: 'Aspirin',
      dosage: '81mg',
      frequency: 'Once daily',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-01-15'),
      status: 'discontinued',
      prescribedBy: 'Dr. Smith',
      discontinueReason: 'Switched to alternative medication'
    }
  ];

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      discontinued: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  // Modal functions
  openMedicationsModal(): void {
    this.showMedicationsModal = true;
    this.filterMedications();
  }

  closeMedicationsModal(): void {
    this.showMedicationsModal = false;
    this.medicationSearchTerm = '';
    this.selectedStatusFilter = 'all';
  }

  filterMedications(): void {
    let allMeds = this.getAllMedications();

    // Filter by search term
    if (this.medicationSearchTerm) {
      allMeds = allMeds.filter(med =>
        med.name.toLowerCase().includes(this.medicationSearchTerm.toLowerCase()) ||
        med.dosage.toLowerCase().includes(this.medicationSearchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (this.selectedStatusFilter !== 'all') {
      allMeds = allMeds.filter(med => med.status === this.selectedStatusFilter);
    }

    this.filteredMedications = allMeds;
  }

  getAllMedications(): Medication[] {
    return [...this.medications, ...this.discontinuedMedications];
  }

  getFilteredMedications(status: string): Medication[] {
    if (status === 'all') {
      return this.filteredMedications.length > 0 ? this.filteredMedications : this.getAllMedications();
    }

    const allMeds = this.filteredMedications.length > 0 ? this.filteredMedications : this.getAllMedications();
    return allMeds.filter(med => med.status === status);
  }

  // Medication actions
  editMedication(medication: Medication): void {
    console.log('Edit medication:', medication);
    // TODO: Implement edit functionality
  }

  discontinueMedication(medication: Medication): void {
    console.log('Discontinue medication:', medication);
    // TODO: Implement discontinue functionality
  }

  viewMedicationHistory(medication: Medication): void {
    console.log('View medication history:', medication);
    // TODO: Implement history view
  }

  openAddMedicationModal(): void {
    console.log('Add new medication');
    // TODO: Implement add medication modal
  }

  exportMedications(): void {
    console.log('Export medications');
    // TODO: Implement export functionality
  }
}

