import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';

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
  imports: [CommonModule, CardComponent],
  templateUrl: './ai-health-summary.component.html',
  styleUrls: ['./ai-health-summary.component.css']
})
export class AiHealthSummaryComponent {
  @Input() aiHealthSummary: AIHealthSummary | null = null;
  @Input() patientStats: PatientStats | null = null;
  @Input() stabilityScore: number = 0;
  @Input() activeMedicationsCount: number = 0;
  @Input() medicalJourney: MedicalJourneyEvent[] = [];

  @Output() generateAISummary = new EventEmitter<void>();

  getRiskLevelClass(riskLevel?: string): string {
    if (!riskLevel) return 'bg-gray-100 text-gray-800';

    const classes: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300'
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
      minute: '2-digit'
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getCurrentDateTime(): string {
    return this.formatDateTime(new Date());
  }

  onGenerateAISummary(): void {
    this.generateAISummary.emit();
  }
}

