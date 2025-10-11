import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloudUploadAlt, faEye, faDownload, faFileMedical, faChevronRight, faClock, faTimes, faFlask, faCamera, faFileAlt, faPills } from '@fortawesome/free-solid-svg-icons';
import { CardComponent } from '../../shared/components/card/card.component';
import { DocumentViewerComponent, DocumentViewerData } from '../../shared/components/document-viewer/document-viewer.component';

export interface Report {
  id: number;
  title: string;
  type: 'lab' | 'imaging' | 'prescription' | 'report';
  date: Date;
  aiSummary?: string;
  url?: string;
  thumbnail?: string;
  status?: 'pending' | 'reviewed' | 'analyzed';
  fileSize?: string;
  uploadedBy?: string;
  uploadedAt?: Date;
  notes?: string;
  description?: string;
}

@Component({
  selector: 'app-reports-scans',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, CardComponent, DocumentViewerComponent],
  templateUrl: './reports-scans.component.html',
  styleUrls: ['./reports-scans.component.css']
})
export class ReportsScansComponent {
  @Input() reports: Report[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('modalFileInput') modalFileInput!: ElementRef<HTMLInputElement>;

  // FontAwesome icons
  faCloudUploadAlt = faCloudUploadAlt;
  faEye = faEye;
  faDownload = faDownload;
  faFileMedical = faFileMedical;
  faChevronRight = faChevronRight;
  faClock = faClock;
  faTimes = faTimes;
  faFlask = faFlask;
  faCamera = faCamera;
  faFileAlt = faFileAlt;
  faPills = faPills;

  // Modal and upload state
  showUploadModal = false;
  selectedFiles: File[] = [];
  newReport: Partial<Report> = {};
  uploadType: string = '';

  // Document Viewer State
  showDocumentViewer: boolean = false;
  currentDocument: DocumentViewerData | null = null;

  // Filter state
  activeFilter = 'all';
  reportFilters = [
    { key: 'all', label: 'All Reports' },
    { key: 'lab', label: 'Lab Results' },
    { key: 'imaging', label: 'Imaging' },
    { key: 'report', label: 'Reports' },
    { key: 'prescription', label: 'Prescriptions' }
  ];

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Report type styling
  getReportTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      lab: 'bg-green-500',
      imaging: 'bg-blue-500',
      report: 'bg-purple-500',
      prescription: 'bg-orange-500'
    };
    return classes[type] || 'bg-gray-500';
  }

  getReportIcon(type: string): any {
    const icons: { [key: string]: any } = {
      lab: this.faFlask,
      imaging: this.faCamera,
      report: this.faFileAlt,
      prescription: this.faPills
    };
    return icons[type] || this.faFileMedical;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-green-100 text-green-800',
      analyzed: 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  // Filter functions
  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
  }

  getFilteredReports(filter: string): Report[] {
    if (filter === 'all') {
      return this.reports;
    }
    return this.reports.filter(report => report.type === filter);
  }

  // Modal functions
  openUploadModal(type?: string): void {
    this.showUploadModal = true;
    this.uploadType = type || '';
    this.newReport = {
      type: type as any,
      date: new Date(),
      status: 'pending'
    };
    this.selectedFiles = [];
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
    this.newReport = {};
    this.selectedFiles = [];
    this.uploadType = '';
  }

  getUploadTypeLabel(): string {
    const labels: { [key: string]: string } = {
      lab: 'Lab Results',
      imaging: 'Imaging & Scans',
      report: 'Medical Report',
      prescription: 'Prescription'
    };
    return labels[this.uploadType] || 'Report';
  }

  // File handling
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  triggerModalFileInput(): void {
    this.modalFileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.handleFiles(files);
  }

  onModalFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
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

    const files = Array.from(event.dataTransfer?.files || []) as File[];
    this.handleFiles(files);
  }

  handleFiles(files: File[]): void {
    // Filter valid file types
    const validFiles = files.filter(file => {
      const validTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.dcm', '.dicom'];
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(extension);
    });

    if (validFiles.length > 0) {
      this.openUploadModal();
      this.selectedFiles = validFiles;
    }
  }

  removeFile(file: File): void {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  // Upload functions
  uploadReport(): void {
    if (this.isUploadFormValid()) {
      const report: Report = {
        id: Date.now(),
        title: this.newReport.title!,
        type: this.newReport.type!,
        date: new Date(this.newReport.date!),
        status: 'pending',
        fileSize: this.formatFileSize(this.selectedFiles[0]?.size || 0),
        uploadedBy: 'Current User', // This should come from auth service
        uploadedAt: new Date(),
        notes: this.newReport.notes,
        aiSummary: 'AI analysis pending...'
      };

      this.reports.push(report);
      this.closeUploadModal();

      // Simulate AI analysis after 2 seconds
      setTimeout(() => {
        report.aiSummary = this.generateMockAiSummary(report.type);
        report.status = 'analyzed';
      }, 2000);
    }
  }

  isUploadFormValid(): boolean {
    return !!(this.newReport.title && this.newReport.type && this.newReport.date && this.selectedFiles.length > 0);
  }


  // Helper functions
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateMockAiSummary(type: string): string {
    const summaries: { [key: string]: string } = {
      lab: 'Blood work shows normal glucose levels, slightly elevated cholesterol. Recommend dietary adjustments.',
      imaging: 'X-ray shows no acute abnormalities. Bone density appears normal for age.',
      report: 'Consultation notes indicate patient responding well to current treatment plan.',
      prescription: 'Medication dosage appropriate for patient condition and weight.'
    };
    return summaries[type] || 'Analysis completed successfully.';
  }

  // Activity tracking
  getLastUploadTime(): string {
    const recentReports = this.reports
      .filter(r => r.uploadedAt)
      .sort((a, b) => new Date(b.uploadedAt!).getTime() - new Date(a.uploadedAt!).getTime());

    if (recentReports.length > 0) {
      return this.formatDate(recentReports[0].uploadedAt!);
    }
    return '';
  }

  getPendingReportsCount(): number {
    return this.reports.filter(r => r.status === 'pending').length;
  }

  getAiAnalyzedCount(): number {
    return this.reports.filter(r => r.status === 'analyzed').length;
  }

  // Document Viewer Methods
  viewReport(report: Report) {
    // Determine document type based on file extension or report type
    const documentType = this.getDocumentTypeFromReport(report);

    this.currentDocument = {
      title: report.title,
      url: report.url || '#',
      type: documentType,
      fileSize: report.fileSize,
      uploadedBy: report.uploadedBy,
      uploadedAt: report.uploadedAt,
      description: report.description
    };

    this.showDocumentViewer = true;
  }

  downloadReport(report: Report) {
    // TODO: Implement report download
    console.log('Downloading report:', report);
  }

  closeDocumentViewer() {
    this.showDocumentViewer = false;
    this.currentDocument = null;
  }

  getDocumentTypeFromReport(report: Report): 'image' | 'pdf' | 'document' {
    const url = report.url || '';
    const extension = url.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return 'image';
    } else if (['pdf'].includes(extension || '')) {
      return 'pdf';
    } else {
      return 'document';
    }
  }
}

