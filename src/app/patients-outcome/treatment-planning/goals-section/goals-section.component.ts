import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrashCan, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Goal, GoalStatus, GoalType } from '../treatment-planning.types';

@Component({
  selector: 'app-goals-section',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './goals-section.component.html',
  styleUrls: ['./goals-section.component.css'],
})
export class GoalsSectionComponent {
  @Input({ required: true }) goals: Goal[] = [];
  @Input({ required: true }) activeTab: GoalType = 'short-term';

  @Output() tabChange = new EventEmitter<GoalType>();
  @Output() addGoal = new EventEmitter<void>();
  @Output() editGoal = new EventEmitter<Goal>();
  @Output() deleteGoal = new EventEmitter<Goal>();
  @Output() reactivateGoal = new EventEmitter<Goal>();

  searchTerm = '';
  readonly faPenToSquare = faPenToSquare;
  readonly faTrashCan = faTrashCan;
  readonly faRotateLeft = faRotateLeft;

  readonly tabs: { id: GoalType; label: string }[] = [
    { id: 'short-term', label: 'Short-term goals' },
    { id: 'long-term', label: 'Long-term goals' },
  ];

  readonly statusStyles: Record<GoalStatus, string> = {
    planned: 'goal-status-info',
    completed: 'goal-status-dark',
    ongoing: 'goal-status-success',
    achieved: 'goal-status-muted',
    onhold: 'goal-status-warning',
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
      case 'achieved':
        updatedStatus = this.statusStyles.achieved;
        break;
      default:
        return this.statusStyles.planned;
    }
    return updatedStatus;
  }

  onTabSelect(tab: GoalType): void {
    if (tab !== this.activeTab) {
      this.tabChange.emit(tab);
    }
  }

  get filteredGoals(): Goal[] {
    const normalizedQuery = this.searchTerm.trim().toLowerCase();

    return this.goals
      .filter((goal) => goal.goalType === this.activeTab)
      .filter((goal) => (normalizedQuery ? this.matchesSearch(goal, normalizedQuery) : true));
  }

  countGoals(tab: GoalType): number {
    return this.goals.filter((goal) => goal.goalType === tab).length;
  }

  trackGoalById(_: number, goal: Goal): string {
    return goal.goalId;
  }

  private matchesSearch(goal: Goal, query: string): boolean {
    const searchableFields = [
      goal.name,
      goal.desc,
      goal.status,
      goal.discipline,
      goal.tDate,
    ];
    return searchableFields.some((field) =>
      (field ?? '').toString().toLowerCase().includes(query),
    );
  }
}
