import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Discipline, Intervention, InterventionStatus } from '../treatment-planning.types';

type DisciplineFilter = Discipline | 'All';

@Component({
  selector: 'app-treatment-plan-section',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
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
  @Output() sessionLogger = new EventEmitter<Intervention>();

  menuOpenFor: string | null = null;
  searchTerm = '';
  readonly faSearch = faMagnifyingGlass;
  readonly faEllipsis = faEllipsisVertical;

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
    const normalizedQuery = this.searchTerm.trim().toLowerCase();

    return this.interventions
      .filter((intervention) =>
        this.activeFilter === 'All' ? true : intervention.type === this.activeFilter,
      )
      .filter((intervention) =>
        normalizedQuery ? this.matchesSearch(intervention, normalizedQuery) : true,
      );
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

  private matchesSearch(intervention: Intervention, query: string): boolean {
    const searchableFields = [
      intervention.name,
      intervention.desc,
      intervention.type,
      intervention.loc,
      intervention.status,
    ];

    return searchableFields.some((field) =>
      (field ?? '').toString().toLowerCase().includes(query),
    );
  }
}

