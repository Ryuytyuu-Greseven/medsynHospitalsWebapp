import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Discipline, Intervention, InterventionStatus } from '../treatment-planning.types';

type DisciplineFilter = Discipline | 'All';

@Component({
  selector: 'app-treatment-plan-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treatment-plan-section.component.html',
  styleUrls: ['./treatment-plan-section.component.css']
})
export class TreatmentPlanSectionComponent {
  @Input({ required: true }) interventions: Intervention[] = [];
  @Input({ required: true }) activeFilter: DisciplineFilter = 'All';

  @Output() filterChange = new EventEmitter<DisciplineFilter>();
  @Output() addIntervention = new EventEmitter<void>();
  @Output() editIntervention = new EventEmitter<Intervention>();
  @Output() duplicateIntervention = new EventEmitter<Intervention>();
  @Output() archiveIntervention = new EventEmitter<Intervention>();

  menuOpenFor: string | null = null;

  readonly disciplines: DisciplineFilter[] = ['All', 'Physiatry', 'PT', 'OT', 'ST', 'Nursing', 'Other'];

  readonly statusStyles: Record<InterventionStatus, string> = {
    planned: 'status-pill-info',
    ongoing: 'status-pill-success',
    completed: 'status-pill-dark',
    archived: 'status-pill-muted',
    onhold: 'status-pill-warning',
  };

  getStatusClass(status: string): string {
    let updatedStatus = '';
    switch (status.toLowerCase()) {
      case 'completed':
        updatedStatus = this.statusStyles.completed;
        break;
      case 'on going':
        updatedStatus = this.statusStyles.ongoing;
        break;
      case 'on hold':
        updatedStatus = this.statusStyles.onhold;
        break;
      case 'archived':
        updatedStatus = this.statusStyles.archived;
        break;
      default:
        return this.statusStyles.planned;
    }
    return updatedStatus;
  }


  onFilterSelect(filter: DisciplineFilter): void {
    if (filter !== this.activeFilter) {
      this.filterChange.emit(filter);
    }
  }

  get visibleInterventions(): Intervention[] {
    if (this.activeFilter === 'All') {
      return this.interventions;
    }
    return this.interventions.filter(intervention => intervention.type === this.activeFilter);
  }

  getDurationWeeks(intervention: Intervention): string {
    const start = new Date(intervention.sDate);
    const end = new Date(intervention.eDate);
    const diffWeeks = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7);
    return diffWeeks > 0 ? diffWeeks.toFixed(1) : '0.0';
  }

  toggleMenu(interventionId: string): void {
    this.menuOpenFor = this.menuOpenFor === interventionId ? null : interventionId;
  }

  closeMenu(): void {
    this.menuOpenFor = null;
  }

  trackById(_: number, intervention: Intervention): string {
    return intervention.sessionId;
  }
}

