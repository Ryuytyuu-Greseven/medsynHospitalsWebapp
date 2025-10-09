import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';

export interface Report {
  id: number;
  title: string;
  type: 'lab' | 'imaging' | 'prescription' | 'report';
  date: Date;
  aiSummary: string;
  url?: string;
  thumbnail?: string;
}

@Component({
  selector: 'app-reports-scans',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './reports-scans.component.html',
  styleUrls: ['./reports-scans.component.css']
})
export class ReportsScansComponent {
  @Input() reports: Report[] = [];

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

