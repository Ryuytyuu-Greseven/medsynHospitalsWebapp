import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCloudUploadAlt,
  faEye,
  faDownload,
  faFileMedical,
  faChevronRight,
  faClock,
  faTimes,
  faFlask,
  faCamera,
  faFileAlt,
  faPills,
  faRobot,
  faBrain,
  faSync,
} from '@fortawesome/free-solid-svg-icons';
import { CardComponent } from '../../shared/components/card/card.component';
import {
  DocumentViewerComponent,
  DocumentViewerData,
} from '../../shared/components/document-viewer/document-viewer.component';
import { PatientService } from '../../core/services/patient.service';
import { PublicPatientProfile } from '../../core/interfaces';
import { ToastService } from '../../core/services';

export interface Report {
  id: number;
  title: string;
  type: 'lab' | 'imaging' | 'prescription' | 'report';
  reportDate: Date;
  analysis?: string;
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
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    CardComponent,
    DocumentViewerComponent,
  ],
  templateUrl: './reports-scans.component.html',
  styleUrls: ['./reports-scans.component.css'],
})
export class ReportsScansComponent {
  @Input() reports: Report[] = [];
  @Input() patientDetails: PublicPatientProfile | null = null;
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
  faRobot = faRobot;
  faBrain = faBrain;
  faSync = faSync;

  // Modal and upload state
  showUploadModal = false;
  selectedFiles: File[] = [];
  newReport: Partial<Report> = {};
  uploadType: string = '';
  isUploading = false;
  isRefreshing = false;

  // Document Viewer State
  showDocumentViewer: boolean = false;
  currentDocument: DocumentViewerData | null = null;

  // AI Analysis Modal State
  showAiAnalysisModal: boolean = false;
  currentAnalysisReport: Report | null = null;

  // Filter state
  activeFilter = 'all';
  reportFilters = [
    { key: 'all', label: 'All Reports' },
    { key: 'lab', label: 'Lab Results' },
    { key: 'imaging', label: 'Imaging' },
    { key: 'report', label: 'Reports' },
    { key: 'prescription', label: 'Prescriptions' },
  ];

  // Pagination state
  currentPatientReports: Report[] = [];
  page = 1;
  limit = 10;
  totalPages = 0;
  totalReports = 0;

  constructor(
    private patientService: PatientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    console.log('patientDetails', this.patientDetails);
    this.getPatientReports();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (
    //   changes['patientDetails']?.currentValue?.healthId &&
    //   changes['patientDetails']?.previousValue?.healthId !==
    //     changes['patientDetails']?.currentValue?.healthId
    // ) {
    //   this.patientDetails = changes['patientDetails']?.currentValue;
    //   // console.log('patientDetails', this.patientDetails);
    //   // this.loadReports();
    // }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Report type styling
  getReportTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      lab: 'bg-green-500',
      imaging: 'bg-blue-500',
      report: 'bg-purple-500',
      prescription: 'bg-orange-500',
    };

    // return classes[type] || 'bg-gray-500';
    return classes[type] || classes['lab'];
  }

  getReportIcon(type: string): any {
    const icons: { [key: string]: any } = {
      lab: this.faFlask,
      imaging: this.faCamera,
      report: this.faFileAlt,
      prescription: this.faPills,
    };
    return icons[type] || this.faFileMedical;
  }

  getStatusClass(status?: string): string {
    const classes: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-green-100 text-green-800',
      analyzed: 'bg-blue-100 text-blue-800',
    };
    // return classes[status] || 'bg-gray-100 text-gray-800';
    return status ? classes[status] : classes['reviewed'];
  }

  // Filter functions
  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
  }

  getFilteredReports(filter: string): Report[] {
    if (filter === 'all') {
      return this.reports;
    }
    return this.reports.filter((report) => report.type === filter);
  }

  // Modal functions
  openUploadModal(type?: string): void {
    this.showUploadModal = true;
    this.uploadType = type || '';
    this.newReport = {
      type: type as any,
      reportDate: new Date(),
      status: 'pending',
    };
    this.selectedFiles = [];
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
    this.newReport = {};
    this.selectedFiles = [];
    this.uploadType = '';
    this.isUploading = false;
  }

  getUploadTypeLabel(): string {
    const labels: { [key: string]: string } = {
      lab: 'Lab Results',
      imaging: 'Imaging & Scans',
      report: 'Medical Report',
      prescription: 'Prescription',
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
    const validFiles = files.filter((file) => {
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
    this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
  }

  // ==========================  APIS CALLS ==========================

  // Get patient reports
  getPatientReports(): void {
    if (this.patientDetails?.healthId) {
      this.patientService
        .getPatientReports({
          healthId: this.patientDetails?.healthId,
          page: 1,
          limit: 10,
        })
        .subscribe((response: Report[]) => {
          console.log('response', response);
          this.currentPatientReports = response;
        });
    }
  }

  // Refresh reports
  refreshReports(): void {
    if (this.isRefreshing) return;

    this.isRefreshing = true;
    if (this.patientDetails?.healthId) {
      this.patientService
        .getPatientReports({
          healthId: this.patientDetails?.healthId,
          page: this.page,
          limit: this.limit,
        })
        .subscribe({
          next: (response: Report[]) => {
            console.log('Refreshed reports', response);
            this.currentPatientReports = response;
            this.isRefreshing = false;
            this.toastService.success('Success', 'Reports refreshed successfully');
          },
          error: (error) => {
            console.error('Error refreshing reports', error);
            this.isRefreshing = false;
            this.toastService.error('Error', 'Failed to refresh reports');
          }
        });
    } else {
      this.isRefreshing = false;
    }
  }

  // Upload functions
  uploadReport(): void {
    if (this.isUploadFormValid() && !this.isUploading) {
      this.isUploading = true;

      if (this.patientDetails?.healthId) {
        this.patientService
          .uploadPatientReports({
            healthId: this.patientDetails?.healthId,
            reports: this.selectedFiles,
          })
          .subscribe({
            next: (response) => {
              console.log('response', response);
              this.toastService.success(
                'Success',
                'Reports uploaded successfully'
              );
              this.isUploading = false;
              this.createNewTempReport();
              this.closeUploadModal();
            },
            error: (error) => {
              console.error('Upload error:', error);
              this.toastService.error(
                'Error',
                'Failed to upload reports. Please try again.'
              );
              this.isUploading = false;
            },
          });
      } else {
        this.isUploading = false;
      }

      // Simulate AI analysis after 2 seconds
      // setTimeout(() => {
      //   report.aiSummary = this.generateMockAiSummary(report.type);
      //   report.status = 'analyzed';
      // }, 2000);
    }
  }

  createNewTempReport(): void {
    const report: Report = {
      id: Date.now(),
      title: this.newReport.title!,
      type: this.newReport.type!,
      reportDate: new Date(this.newReport.reportDate!),
      status: 'pending',
      fileSize: this.formatFileSize(this.selectedFiles[0]?.size || 0),
      uploadedBy: 'Current User', // This should come from auth service
      uploadedAt: new Date(),
      notes: '',
      analysis: 'AI analysis pending...',
    };

    this.currentPatientReports.unshift(report);
  }

  // isUploadFormValid(): boolean {
  //   return !!(this.newReport.title && this.newReport.type && this.newReport.date && this.selectedFiles.length > 0);
  // }

  isUploadFormValid(): boolean {
    return this.selectedFiles.length > 0;
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
      imaging:
        'X-ray shows no acute abnormalities. Bone density appears normal for age.',
      report:
        'Consultation notes indicate patient responding well to current treatment plan.',
      prescription:
        'Medication dosage appropriate for patient condition and weight.',
    };
    return summaries[type] || 'Analysis completed successfully.';
  }

  // Activity tracking
  getLastUploadTime(): string {
    const recentReports = this.reports
      .filter((r) => r.uploadedAt)
      .sort(
        (a, b) =>
          new Date(b.uploadedAt!).getTime() - new Date(a.uploadedAt!).getTime()
      );

    if (recentReports.length > 0) {
      return this.formatDate(recentReports[0].uploadedAt!);
    }
    return '';
  }

  getPendingReportsCount(): number {
    return this.reports.filter((r) => r.status === 'pending').length;
  }

  getAiAnalyzedCount(): number {
    return this.reports.filter((r) => r.status === 'analyzed').length;
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
      description: report.description,
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

  // AI Analysis Modal Methods
  viewAiAnalysis(report: Report) {
    this.currentAnalysisReport = report;
    this.showAiAnalysisModal = true;
  }

  closeAiAnalysisModal() {
    this.showAiAnalysisModal = false;
    this.currentAnalysisReport = null;
  }

  getDocumentTypeFromReport(report: Report): 'image' | 'pdf' | 'document' {
    const url = report.url || '';
    const extension = url.split('.').pop()?.toLowerCase();

    if (
      ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')
    ) {
      return 'image';
    } else if (['pdf'].includes(extension || '')) {
      return 'pdf';
    } else {
      return 'document';
    }
  }
}
