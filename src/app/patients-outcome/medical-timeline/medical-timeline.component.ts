import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';

export interface MedicalJourneyEvent {
  id: number;
  date: Date;
  type: 'admission' | 'discharge' | 'surgery' | 'operation' | 'report' | 'lab' | 'imaging' | 'therapy' | 'medication' | 'consultation' | 'emergency';
  title: string;
  description: string;
  icon: string;
  aiInsight?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  attachments?: string[];
  doctor?: string;
  outcome?: string;
}

@Component({
  selector: 'app-medical-timeline',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './medical-timeline.component.html',
  styleUrls: ['./medical-timeline.component.css']
})
export class MedicalTimelineComponent {
  @Input() medicalJourney: MedicalJourneyEvent[] = [];
  @Output() eventSelected = new EventEmitter<MedicalJourneyEvent>();

  selectEvent(event: MedicalJourneyEvent): void {
    this.eventSelected.emit(event);
  }

  getRiskLevelClass(riskLevel?: string): string {
    if (!riskLevel) return 'bg-gray-100 text-gray-800';

    const classes: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300'
    };

    return classes[riskLevel] || 'bg-gray-100 text-gray-800';
  }

  getRiskBorderColor(riskLevel?: string): string {
    if (!riskLevel) return '#9CA3AF';

    const colors: { [key: string]: string } = {
      low: '#10B981',
      medium: '#FBBF24',
      high: '#EF4444'
    };

    return colors[riskLevel] || '#9CA3AF';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

