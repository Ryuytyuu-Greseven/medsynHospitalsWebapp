import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PatientService } from '../../core/services/patient.service';
import {
  PatientHealthSummary,
  PublicPatientProfile,
} from '../../core/interfaces';
import { ToastService } from '../../core/services';

export interface AIHealthSummary {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  lastAnalyzed: Date;
  keyFindings: string[];
  predictedRisks: string[];
  suggestedActions: string[];
}

export interface PatientStats {
  weight: number;
  bloodPressure: string;
  heartRate: number;
  bmi: number;
}

export interface MedicalJourneyEvent {
  id: number;
  date: Date;
  type: string;
  title: string;
  description: string;
  icon: string;
  aiInsight?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  doctor?: string;
  outcome?: string;
}

@Component({
  selector: 'app-ai-health-summary',
  standalone: true,
  imports: [CommonModule, CardComponent, LoadingComponent],
  templateUrl: './ai-health-summary.component.html',
  styleUrls: ['./ai-health-summary.component.css'],
})
export class AiHealthSummaryComponent {
  @Input() patientDetails: PublicPatientProfile | null = null;
  @Input() aiHealthSummary: PatientHealthSummary = {} as any;
  @Input() patientStats: PatientStats | null = null;
  @Input() stabilityScore: number = 0;
  @Input() activeMedicationsCount: number = 0;
  @Input() medicalJourney: MedicalJourneyEvent[] = [];

  @Output() generateAISummary = new EventEmitter<void>();

  // Loading state
  isLoading = false;

  constructor(
    private patientService: PatientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    console.log('patientDetails', this.patientDetails);
    // this.getPatientHealthSummary();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientDetails']?.currentValue?.healthId) {
      this.getPatientHealthSummary();
    }
  }

  // fetch patient health summary
  getPatientHealthSummary(): void {
    if (!this.patientDetails?.healthId) return;
    this.isLoading = true;
    this.patientService
      .getPatientHealthSummary({
        healthId: this.patientDetails?.healthId,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response?.summary) {
            this.aiHealthSummary = response;
          }
          console.log('aiHealthSummary', this.aiHealthSummary);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching patient health summary', error);
        },
      });
  }

  // generate new summary
  requestGenerationOfSummary(): void {
    if (!this.patientDetails?.healthId || this.aiHealthSummary?.isProcessing)
      return;

    this.patientService
      .initiateAiSummary({ healthId: this.patientDetails?.healthId })
      .subscribe({
        next: () => {
          this.aiHealthSummary!.isProcessing = true;
          this.toastService.success('Success', 'Generating AI summary...');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error generating AI summary', error);
          this.toastService.error('Error', 'Failed to generate AI summary');
        },
      });
  }

  getRiskLevelClass(riskLevel?: string): string {
    if (!riskLevel) return 'bg-gray-100 text-gray-800';

    const classes: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300',
    };

    return classes[riskLevel] || 'bg-gray-100 text-gray-800';
  }

  getStabilityColor(): string {
    if (this.stabilityScore >= 80) return '#10B981'; // Green
    if (this.stabilityScore >= 60) return '#FBBF24'; // Yellow
    return '#EF4444'; // Red
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getCurrentDateTime(): string {
    return this.formatDateTime(new Date());
  }

  onGenerateAISummary(): void {
    this.requestGenerationOfSummary();
  }

  isSummaryProcessing(): boolean {
    return !this.aiHealthSummary?.summary || this.aiHealthSummary?.isProcessing;
  }
}
