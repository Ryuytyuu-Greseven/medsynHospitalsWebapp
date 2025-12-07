export type GoalType = 'short-term' | 'long-term';

export type GoalStatus = 'planned' | 'completed' | 'ongoing' | 'achieved' | 'onhold';

export type InterventionStatus = 'planned' | 'ongoing' | 'completed' | 'archived' | 'onhold';

export type PlanStatus = 'active' | 'draft' | 'completed';

export type Discipline =
  | 'Physiatry'
  | 'PT'
  | 'OT'
  | 'ST'
  | 'Nursing'
  | 'Other';

export interface PatientSnapshot {
  name: string;
  mrn: string;
  age: number;
  sex: string;
  diagnosis: string;
  admissionDate: string;
  rehabLevel: string;
  rehabUnit: string;
  comorbidities: string[];
  precautions: Array<{
    label: string;
    level: 'critical' | 'warning' | 'info';
    description?: string;
  }>;
}

export interface Goal {
  goalId: string;
  name: string;
  desc: string;
  tDate: string;
  discipline: Discipline;
  status: GoalStatus;
  goalType: GoalType;
}

export interface InterventionVisit {
  visitId: string;
  vDate: string;
  summary: string;
}

export interface Intervention {
  sessionId: string;
  name: string;
  type: Discipline;
  desc: string;
  onWeek: string;
  duration: number;
  sDate: string;
  eDate: string;
  loc: string;
  status: InterventionStatus;
  visits?: InterventionVisit[];
}

export interface ScheduleOverviewDay {
  day: string;
  totalSessions: number;
  pt: number;
  ot: number;
  st: number;
  other: number;
}

export interface AISuggestionGoal {
  id: string;
  text: string;
  rationale: string;
  tags: string[];
  type: GoalType;
  discipline: Discipline;
}

export interface AISuggestionIntervention {
  id: string;
  name: string;
  linkedGoal: string;
  frequency: string;
  durationMinutes: number;
  discipline: Discipline;
  tags: string[];
}

