import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AiSuggestionsPanelComponent } from './ai-suggestions-panel/ai-suggestions-panel.component';
import { GoalsSectionComponent } from './goals-section/goals-section.component';
import { PatientSnapshotCardComponent } from './patient-snapshot-card/patient-snapshot-card.component';
import { ScheduleOverviewCardComponent } from './schedule-overview-card/schedule-overview-card.component';
import { TreatmentPlanSectionComponent } from './treatment-plan-section/treatment-plan-section.component';
import {
  AISuggestionGoal,
  AISuggestionIntervention,
  Goal,
  GoalType,
  Intervention,
  PatientSnapshot,
  PlanStatus,
  ScheduleOverviewDay,
  Discipline,
  InterventionStatus,
} from './treatment-planning.types';
import { PatientService } from '../../core/services/patient.service';
import { ToastService } from '../../core/services';
import { PublicPatientProfile } from '../../core/interfaces';

type DisciplineFilter = Discipline | 'All';

interface MockData {
  patient: PatientSnapshot;
  goals: Goal[];
  interventions: Intervention[];
  schedule: ScheduleOverviewDay[];
  goalSuggestions: AISuggestionGoal[];
  interventionSuggestions: AISuggestionIntervention[];
}

@Component({
  selector: 'app-treatment-planning',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PatientSnapshotCardComponent,
    GoalsSectionComponent,
    TreatmentPlanSectionComponent,
    ScheduleOverviewCardComponent,
    AiSuggestionsPanelComponent,
  ],
  templateUrl: './treatment-planning.component.html',
  styleUrls: ['./treatment-planning.component.css'],
})
export class TreatmentPlanningComponent {
  @Input() patientDetails: PublicPatientProfile | null = null;

  planStatus: PlanStatus = 'active';

  patientSnapshot!: PatientSnapshot;
  goals: Goal[] = [];
  interventions: Intervention[] = [];
  scheduleOverview: ScheduleOverviewDay[] = [];
  goalSuggestions: AISuggestionGoal[] = [];
  interventionSuggestions: AISuggestionIntervention[] = [];

  activeGoalTab: GoalType = 'short-term';
  activeDisciplineFilter: DisciplineFilter = 'All';

  goalForm!: FormGroup;
  goalModalOpen = false;
  editingGoalId: string | null = null;

  interventionForm!: FormGroup;
  interventionModalOpen = false;
  editingInterventionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private toastService: ToastService
  ) {
    this.createForms();
    this.resetToMockData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['patientDetails']?.currentValue?.healthId &&
      changes['patientDetails']?.currentValue?.healthId !==
        changes['patientDetails']?.previousValue?.healthId
    ) {
      this.getInterventions();
      this.getGoals();
    }
  }

  ngOnInit(): void {}

  createForms(): void {
    this.goalForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      type: ['short-term' as GoalType, Validators.required],
      targetDate: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['planned', Validators.required],
    });

    this.interventionForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      discipline: ['PT' as Discipline, Validators.required],
      description: [''],
      frequency: [1, [Validators.required, Validators.min(1)]],
      durationMinutes: [45, [Validators.required, Validators.min(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['Therapy room', Validators.required],
      status: ['planned' as InterventionStatus, Validators.required],
    });
  }

  handlePlanStatusChange(status: PlanStatus | string): void {
    this.planStatus = status as PlanStatus;
  }

  openGoalModal(goal?: Goal): void {
    this.goalModalOpen = true;
    this.editingGoalId = goal?.goalId ?? null;
    this.goalForm.reset({
      title: goal?.name ?? '',
      type: goal?.goalType ?? this.activeGoalTab,
      targetDate: goal ? goal.tDate : this.getDefaultTargetDate(),
      description: goal?.desc ?? '',
      status: goal?.status ?? 'planned',
    });
  }

  closeGoalModal(): void {
    this.goalModalOpen = false;
    this.goalForm.reset();
    this.editingGoalId = null;
  }

  openInterventionModal(intervention?: Intervention): void {
    this.interventionModalOpen = true;
    this.editingInterventionId = intervention?.sessionId ?? null;
    this.interventionForm.reset({
      name: intervention?.name ?? '',
      discipline: intervention?.type ?? 'PT',
      description: intervention?.desc ?? '',
      frequency: intervention?.onWeek ?? 1,
      durationMinutes: intervention?.duration ?? 45,
      startDate: intervention?.sDate ?? this.todayISO(),
      endDate: intervention?.eDate ?? this.plusDaysISO(30),
      location: intervention?.loc ?? 'Therapy room',
      status: intervention?.status ?? 'planned',
    });
  }

  closeInterventionModal(): void {
    this.interventionModalOpen = false;
    this.editingInterventionId = null;
  }

  handleDuplicate(intervention: Intervention): void {
    const clone: Intervention = {
      ...intervention,
      sessionId:
        intervention.sessionId + Math.random().toString(36).substring(2, 15),
      name: `${intervention.name} (Copy)`,
    };
    this.interventions = [clone, ...this.interventions];
  }

  handleArchive(intervention: Intervention): void {
    this.interventions = this.interventions.map((item) =>
      item.sessionId === intervention.sessionId
        ? { ...item, status: 'archived' }
        : item
    );
  }

  dismissGoalSuggestion(suggestion: AISuggestionGoal): void {
    this.goalSuggestions = this.goalSuggestions.filter(
      (goal) => goal.id !== suggestion.id
    );
  }

  dismissInterventionSuggestion(suggestion: AISuggestionIntervention): void {
    this.interventionSuggestions = this.interventionSuggestions.filter(
      (item) => item.id !== suggestion.id
    );
  }

  handleSavePlan(): void {
    console.log('Saving treatment plan', {
      status: this.planStatus,
      patient: this.patientSnapshot,
      goals: this.goals,
      interventions: this.interventions,
    });
  }

  handleDiscardChanges(): void {
    this.resetToMockData();
  }

  handleFullSchedule(): void {
    console.log('Navigate to full schedule view');
  }

  private resetToMockData(): void {
    const mock = this.buildMockData();
    this.patientSnapshot = mock.patient;
    this.goals = mock.goals;
    this.interventions = mock.interventions;
    this.scheduleOverview = mock.schedule;
    this.goalSuggestions = mock.goalSuggestions;
    this.interventionSuggestions = mock.interventionSuggestions;
    this.planStatus = 'active';
    this.activeGoalTab = 'short-term';
    this.activeDisciplineFilter = 'All';
  }

  private buildMockData(): MockData {
    return {
      patient: {
        name: 'John Doe',
        mrn: '482913',
        age: 58,
        sex: 'Male',
        diagnosis: 'Left MCA stroke with right hemiparesis',
        admissionDate: this.plusDaysISO(-12),
        rehabLevel: 'Acute inpatient rehabilitation',
        rehabUnit: 'Neuro-rehab unit · Level 4',
        comorbidities: ['Hypertension', 'Type 2 diabetes'],
        precautions: [
          { label: 'High fall risk', level: 'critical' },
          { label: 'Cardiac precautions', level: 'warning' },
          { label: 'Aspiration precautions', level: 'info' },
        ],
      },
      goals: [],
      interventions: [],
      schedule: [
        { day: 'Mon', totalSessions: 5, pt: 2, ot: 2, st: 1, other: 0 },
        { day: 'Tue', totalSessions: 4, pt: 2, ot: 1, st: 1, other: 0 },
        { day: 'Wed', totalSessions: 5, pt: 2, ot: 1, st: 1, other: 1 },
        { day: 'Thu', totalSessions: 4, pt: 1, ot: 2, st: 1, other: 0 },
        { day: 'Fri', totalSessions: 5, pt: 2, ot: 1, st: 1, other: 1 },
        { day: 'Sat', totalSessions: 2, pt: 1, ot: 0, st: 0, other: 1 },
        { day: 'Sun', totalSessions: 1, pt: 0, ot: 0, st: 0, other: 1 },
      ],
      goalSuggestions: [
        {
          id: 'ai-goal-1',
          text: 'Sit-to-stand transfers with standby assist',
          rationale:
            'Based on recent FIM transfer scores and quad weakness trends.',
          tags: ['Mobility', 'Safety'],
          type: 'short-term',
          discipline: 'PT',
        },
        {
          id: 'ai-goal-2',
          text: 'Use adaptive utensils for 3 consecutive meals',
          rationale:
            'Patient reports fatigue with self-feeding past 10 minutes.',
          tags: ['ADL', 'Fine motor'],
          type: 'short-term',
          discipline: 'OT',
        },
      ],
      interventionSuggestions: [
        {
          id: 'ai-int-1',
          name: 'Quadriceps strengthening circuit',
          linkedGoal: 'Ambulate 150 ft with quad cane and standby assist',
          frequency: '3',
          durationMinutes: 40,
          discipline: 'PT',
          tags: ['Mobility', 'Strength'],
        },
        {
          id: 'ai-int-2',
          name: 'Swallowing strategy review',
          linkedGoal: 'Maintain safe oral intake on regular diet',
          frequency: '2x/week',
          durationMinutes: 30,
          discipline: 'ST',
          tags: ['Swallow', 'Safety'],
        },
      ],
    };
  }

  private todayISO(): string {
    return new Date().toISOString().split('T')[0];
  }

  private plusDaysISO(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  private getDefaultTargetDate(): string {
    return this.plusDaysISO(this.activeGoalTab === 'short-term' ? 21 : 90);
  }

  // ================================ API CALLS ================================
  getInterventions(): void {
    if (this.patientDetails?.healthId) {
      this.patientService
        .getTherapyScheduling({ healthId: this.patientDetails.healthId })
        .subscribe((sessionsData: any) => {
          this.interventions = sessionsData;
          console.log('Interventions', sessionsData);
        });
    }
  }

  // Therapy scheduleing API
  submitIntervention(): void {
    if (this.interventionForm.invalid || !this.patientDetails?.healthId) {
      this.interventionForm.markAllAsTouched();
      return;
    }

    const value = this.interventionForm.value;
    const payload = {
      healthId: this.patientDetails?.healthId ?? '',
      name: value.name,
      desc: value.description,
      type: value.discipline,
      onWeek: value.frequency,
      duration: value.durationMinutes,
      sDate: value.startDate,
      eDate: value.endDate,
      loc: value.location,
      status: value.status,
    };

    this.patientService
      .submitTherapyScheduling(payload)
      .subscribe((newSession: any) => {
        if (newSession?.sessionId) {
          this.toastService.success('Success', 'Therapy added successfully');
          this.interventions.unshift(newSession);
          this.closeInterventionModal();
          this.interventionForm.reset();
          // this.getInterventions();
        } else {
          this.toastService.error('Error', 'Failed to add therapy');
        }
      });
  }

  // fetch goals
  getGoals(): void {
    if (this.patientDetails?.healthId) {
      this.patientService
        .getTherapyGoals({ healthId: this.patientDetails.healthId })
        .subscribe((goalsData: any) => {
          this.goals = goalsData;
          console.log('Goals', goalsData);
        });
    }
  }

  // Goals scheduleing API
  submitGoal(): void {
    if (this.goalForm.invalid || !this.patientDetails?.healthId) {
      this.goalForm.markAllAsTouched();
      return;
    }

    const value = this.goalForm.value;
    const payload = {
      healthId: this.patientDetails?.healthId ?? '',
      name: value.title,
      desc: value.description,
      goalType: value.type,
      tDate: value.targetDate,
      status: value.status,
    };

    this.patientService
      .submitTherapyGoal(payload)
      .subscribe((newSession: any) => {
        if (newSession?.goalId) {
          this.toastService.success('Success', 'Goal added successfully');
          this.goals.unshift(newSession);
          this.closeGoalModal();
        } else {
          this.toastService.error('Error', 'Failed to add goal');
        }
      });
  }
}
