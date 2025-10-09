import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './ai-insights.component.html',
  styleUrls: ['./ai-insights.component.css']
})
export class AiInsightsComponent {
  @Input() aiHealthSummary: AIHealthSummary | null = null;
}

