import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPills, faEye, faEdit, faTimes, faSearch, faPlus, faDownload, faCheckCircle, faCalendarAlt, faUserMd, faFileMedical, faHistory, faExclamationTriangle, faCamera } from '@fortawesome/free-solid-svg-icons';
import { CardComponent } from '../../shared/components/card/card.component';
import { DocumentViewerComponent, DocumentViewerData } from '../../shared/components/document-viewer/document-viewer.component';

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
  description?: string;
  timesPerDay?: number;
  instructions?: string;
  sideEffects?: string;
  interactions?: string;
}

@Component({
  selector: 'app-medications',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, CardComponent, DocumentViewerComponent],
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.css']
})
export class MedicationsComponent {
  @Input() medications: Medication[] = [];

  // FontAwesome icons
  faPills = faPills;
  faEye = faEye;
  faEdit = faEdit;
  faTimes = faTimes;
  faSearch = faSearch;
  faPlus = faPlus;
  faDownload = faDownload;
  faCheckCircle = faCheckCircle;
  faCalendarAlt = faCalendarAlt;
  faUserMd = faUserMd;
  faFileMedical = faFileMedical;
  faHistory = faHistory;
  faExclamationTriangle = faExclamationTriangle;
  faCamera = faCamera;

  // Modal state
  showMedicationsModal = false;
  showAddMedicationModal = false;
  showImageUploadModal = false;
  medicationSearchTerm = '';
  selectedStatusFilter = 'all';
  filteredMedications: Medication[] = [];

  // New medication form
  newMedication: Partial<Medication> = {};

  // Image upload state
  uploadedImage: string | null = null;
  isProcessingImage = false;
  extractedMedicationData: Partial<Medication> | null = null;

  // Document Viewer State
  showDocumentViewer: boolean = false;
  currentDocument: DocumentViewerData | null = null;

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
    this.showAddMedicationModal = true;
    this.newMedication = {
      startDate: new Date(),
      status: 'active'
    };
  }

  closeAddMedicationModal(): void {
    this.showAddMedicationModal = false;
    this.newMedication = {};
  }

  addMedication(): void {
    if (this.isMedicationFormValid()) {
      const medication: Medication = {
        id: Date.now(),
        name: this.newMedication.name!,
        dosage: this.newMedication.dosage!,
        frequency: this.newMedication.frequency!,
        startDate: new Date(this.newMedication.startDate!),
        status: this.newMedication.status!,
        notes: this.newMedication.notes,
        prescribedBy: this.newMedication.prescribedBy,
        description: this.newMedication.description,
        timesPerDay: this.newMedication.timesPerDay,
        instructions: this.newMedication.instructions,
        sideEffects: this.newMedication.sideEffects,
        interactions: this.newMedication.interactions
      };

      this.medications.push(medication);
      this.closeAddMedicationModal();
      this.filterMedications();
    }
  }

  isMedicationFormValid(): boolean {
    return !!(this.newMedication.name && this.newMedication.dosage && this.newMedication.frequency && this.newMedication.startDate);
  }

  // Image upload methods
  openImageUpload(): void {
    this.showImageUploadModal = true;
    this.uploadedImage = null;
    this.extractedMedicationData = null;
    this.isProcessingImage = false;
  }

  closeImageUploadModal(): void {
    this.showImageUploadModal = false;
    this.uploadedImage = null;
    this.extractedMedicationData = null;
    this.isProcessingImage = false;
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeUploadedImage(): void {
    this.uploadedImage = null;
    this.extractedMedicationData = null;
  }

  processImage(): void {
    if (!this.uploadedImage) return;

    this.isProcessingImage = true;

    // Simulate AI processing
    setTimeout(() => {
      this.extractedMedicationData = {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        instructions: 'Take with food',
        startDate: new Date(),
        status: 'active'
      };
      this.isProcessingImage = false;
    }, 3000);
  }

  confirmExtractedData(): void {
    if (this.extractedMedicationData) {
      const medication: Medication = {
        id: Date.now(),
        name: this.extractedMedicationData.name!,
        dosage: this.extractedMedicationData.dosage!,
        frequency: this.extractedMedicationData.frequency!,
        startDate: new Date(this.extractedMedicationData.startDate!),
        status: this.extractedMedicationData.status!,
        instructions: this.extractedMedicationData.instructions,
        notes: 'Added via prescription scan'
      };

      this.medications.push(medication);
      this.closeImageUploadModal();
      this.filterMedications();
    }
  }

  editExtractedData(): void {
    // Open the manual entry modal with pre-filled data
    this.closeImageUploadModal();
    this.openAddMedicationModal();
    this.newMedication = { ...this.extractedMedicationData };
  }

  // Helper methods for insights
  getUpcomingRefills(): number {
    // Mock data - in real app, this would calculate based on medication schedules
    return 2;
  }

  getRecentActivity(): any[] {
    return [
      {
        icon: this.faPills,
        colorClass: 'text-green-600',
        description: 'Metformin added via scan'
      },
      {
        icon: this.faEdit,
        colorClass: 'text-blue-600',
        description: 'Lisinopril dosage updated'
      },
      {
        icon: this.faTimes,
        colorClass: 'text-red-600',
        description: 'Aspirin discontinued'
      }
    ];
  }

  exportMedications(): void {
    console.log('Export medications');
    // TODO: Implement export functionality
  }

  // Document Viewer Methods
  viewPrescription(medication: Medication) {
    // For demo purposes, we'll create a mock prescription document
    this.currentDocument = {
      title: `Prescription - ${medication.name}`,
      url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Prescription+Document',
      type: 'image',
      fileSize: '2.4 MB',
      uploadedBy: medication.prescribedBy || 'Dr. Unknown',
      uploadedAt: medication.startDate,
      description: `Prescription for ${medication.name} - ${medication.dosage} ${medication.frequency}`
    };

    this.showDocumentViewer = true;
  }

  closeDocumentViewer() {
    this.showDocumentViewer = false;
    this.currentDocument = null;
  }
}

