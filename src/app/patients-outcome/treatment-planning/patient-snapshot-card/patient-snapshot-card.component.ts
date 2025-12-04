import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PatientSnapshot } from '../treatment-planning.types';

@Component({
  selector: 'app-patient-snapshot-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-snapshot-card.component.html',
  styleUrl: './patient-snapshot-card.component.css'
})
export class PatientSnapshotCardComponent {
  @Input({ required: true }) patient!: PatientSnapshot;

  getPrecautionClass(level: PatientSnapshot['precautions'][number]['level']): string {
    switch (level) {
      case 'critical':
        return 'precaution-critical';
      case 'warning':
        return 'precaution-warning';
      default:
        return 'precaution-info';
    }
  }
}

