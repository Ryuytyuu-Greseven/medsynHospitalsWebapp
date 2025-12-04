import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService, Patient, PatientStats, Medication, HealthEvent } from '../core/services/data.service';
import { ToastService } from '../core/services/toast.service';
import { CardComponent } from '../shared/components/card/card.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import { MedicalTimelineComponent, MedicalJourneyEvent } from './medical-timeline/medical-timeline.component';
import { AiHealthSummaryComponent } from './ai-health-summary/ai-health-summary.component';
import { ReportsScansComponent } from './reports-scans/reports-scans.component';
import { MedicationsComponent } from './medications/medications.component';
import { HealthEventsComponent } from './health-events/health-events.component';
import { MedicalChatbotComponent } from './medical-chatbot/medical-chatbot.component';
import { PatientService } from '../core/services/patient.service';
import { TreatmentPlanningComponent } from './treatment-planning/treatment-planning.component';

// Extended interfaces for the Digital Time Machine

export interface AIHealthSummary {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  lastAnalyzed: Date;
  keyFindings: string[];
  predictedRisks: string[];
  suggestedActions: string[];
}

export interface VitalsTrend {
  date: Date;
  weight: number;
  bloodPressure: string;
  heartRate: number;
  glucose?: number;
}

export interface Report {
  id: number;
  title: string;
  type: 'lab' | 'imaging' | 'prescription' | 'report';
  date: Date;
  aiSummary: string;
  url?: string;
  thumbnail?: string;
}

export enum PatientOutcomeSection {
  Overview = 'overview',
  Timeline = 'timeline',
  Reports = 'reports',
  Medications = 'medications',
  HealthEvents = 'health-events',
  Insights = 'insights',
  TreatmentPlanning = 'treatment-planning'
}


@Component({
  selector: 'app-patient-outcome',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MedicalTimelineComponent,
    AiHealthSummaryComponent,
    ReportsScansComponent,
    MedicationsComponent,
    HealthEventsComponent,
    MedicalChatbotComponent,
    TreatmentPlanningComponent,
  ],
  templateUrl: './patient-outcome.component.html',
  styleUrls: ['./patient-outcome.component.css']
})
export class PatientOutcomeComponent implements OnInit {
  patient: Patient | null | any= null;
  patientStats: PatientStats | null = null;
  medications: Medication[] = [];
  healthEvents: HealthEvent[] = [];

  // Digital Time Machine data
  medicalJourney: MedicalJourneyEvent[] = [];
  aiHealthSummary: AIHealthSummary | null = null;
  vitalsTrends: VitalsTrend[] = [];
  reports: Report[] = [];

  // UI State
  readonly PatientOutcomeSection = PatientOutcomeSection;
  activeSection: PatientOutcomeSection = PatientOutcomeSection.Overview;
  showAIModal = false;
  selectedEvent: MedicalJourneyEvent | null = null;

  // Risk overview
  stabilityScore = 0;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private patientService: PatientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const patientId = params.get('id') as any;
      console.log('patientId', patientId);
      this.loadPatientData(patientId);
      this.loadPatient(patientId);
    });
  }

  private loadPatient(patientId: string): void {
    this.patientService
      .getSinglePatient( { patientId: patientId } )
      .subscribe((patient) => {
        console.log('patient', patient);
        this.patient = Object.assign({}, patient);
      });
  }

  private loadPatientData(patientId: number): void {
    // Load patient basic info
    this.dataService.getPatientById(patientId).subscribe(patient => {
      // this.patient = patient || null;

      // Generate AI health summary AFTER patient is loaded
      this.generateAIHealthSummary(patientId);
    });

    // Load patient stats
    this.dataService.getPatientStats(patientId).subscribe(stats => {
      this.patientStats = stats || null;
    });

    // Load medications
    this.dataService.getMedications(patientId).subscribe(medications => {
      this.medications = medications;
    });

    // Load health events
    this.dataService.getHealthEvents(patientId).subscribe(events => {
      this.healthEvents = events;
      this.buildMedicalJourney();
    });

    // Generate vitals trends (mock data for now)
    this.generateVitalsTrends();

    // Generate reports (mock data for now)
    this.generateReports();
  }

  private buildMedicalJourney(): void {
    this.medicalJourney = [];

    // Convert health events to journey events
    this.healthEvents.forEach(event => {
      const journeyEvent: MedicalJourneyEvent = {
        id: event.id,
        date: event.date,
        type: event.type as any,
        title: event.title,
        description: event.description,
        icon: this.getEventIcon(event.type),
        aiInsight: this.generateAIInsight(event),
        riskLevel: this.calculateRiskLevel(event.type),
        doctor: event.doctor,
        outcome: event.outcome
      };
      this.medicalJourney.push(journeyEvent);
    });

    // Add medication events
    this.medications.forEach(med => {
      const journeyEvent: MedicalJourneyEvent = {
        id: 1000 + med.id,
        date: med.startDate,
        type: 'medication',
        title: `${med.name} - ${med.dosage}`,
        description: `Medication started: ${med.frequency}`,
        icon: '💊',
        aiInsight: this.generateMedicationInsight(med),
        riskLevel: 'low'
      };
      this.medicalJourney.push(journeyEvent);
    });

    // Add admission event if patient is admitted
    if (this.patient?.admitted && this.patient.admissionDate) {
      this.medicalJourney.push({
        id: 9999,
        date: this.patient.admissionDate,
        type: 'admission',
        title: 'Hospital Admission',
        description: `Patient admitted for ${this.patient?.conditions?.join(', ')}`,
        icon: '🏥',
        aiInsight: 'Patient admitted for ongoing monitoring and treatment',
        riskLevel: 'medium'
      });
    }

    // Sort by date (most recent first)
    this.medicalJourney.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private generateAIHealthSummary(patientId: number): void {
    // In a real app, this would call an AI service
    const mockSummary: AIHealthSummary = {
      summary: `Patient ${this.patient?.name || 'Unknown'} is showing stable vital signs with blood pressure managed effectively through current medication regimen. Recent lab results indicate well-controlled glucose levels. Recommended continued monitoring of cardiovascular health and adjustment of medication dosage during next consultation.`,
      riskLevel: this.calculateOverallRisk(),
      confidence: 0.92,
      lastAnalyzed: new Date(),
      keyFindings: [
        'Blood pressure stable for last 2 weeks (130/85 avg)',
        'Glucose levels fluctuating slightly (requires monitoring)',
        'Heart rate within normal range (72 bpm avg)',
        'Medication compliance excellent (98%)',
        'BMI slightly elevated (25.7)'
      ],
      predictedRisks: [
        'Mild risk of cardiovascular complications (15% probability)',
        'Glucose level instability may require medication adjustment',
        'Weight management recommended to reduce BMI'
      ],
      suggestedActions: [
        'Schedule follow-up consultation within 2 weeks',
        'Review medication dosage for Metformin',
        'Recommend dietary consultation',
        'Continue current monitoring schedule'
      ]
    };

    this.aiHealthSummary = mockSummary;
    this.stabilityScore = this.calculateStabilityScore();
  }

  private generateVitalsTrends(): void {
    // Mock vitals trends for the past 30 days
    const trends: VitalsTrend[] = [];
    const baseDate = new Date();

    for (let i = 30; i >= 0; i -= 3) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);

      trends.push({
        date,
        weight: 70 + Math.random() * 2 - 1,
        bloodPressure: `${125 + Math.floor(Math.random() * 10)}/${80 + Math.floor(Math.random() * 8)}`,
        heartRate: 70 + Math.floor(Math.random() * 10),
        glucose: 95 + Math.floor(Math.random() * 20)
      });
    }

    this.vitalsTrends = trends;
  }

  private generateReports(): void {
    // Mock reports
    this.reports = [
      {
        id: 1,
        title: 'Blood Test Results',
        type: 'lab',
        date: new Date(2024, 0, 15),
        aiSummary: 'All parameters within normal range. Glucose levels slightly elevated but controlled.'
      },
      {
        id: 2,
        title: 'ECG Report',
        type: 'imaging',
        date: new Date(2024, 0, 10),
        aiSummary: 'Normal sinus rhythm. No abnormalities detected. Heart function appears healthy.'
      },
      {
        id: 3,
        title: 'Chest X-Ray',
        type: 'imaging',
        date: new Date(2023, 11, 20),
        aiSummary: 'Clear lung fields. No signs of infection or abnormality. Cardiac silhouette normal.'
      },
      {
        id: 4,
        title: 'Prescription Record',
        type: 'prescription',
        date: new Date(2024, 0, 12),
        aiSummary: 'Metformin and Lisinopril prescribed for diabetes and hypertension management.'
      }
    ];
  }

  private getEventIcon(type: string): string {
    const icons: { [key: string]: string } = {
      surgery: '🏥',
      operation: '⚕️',
      scan: '🔬',
      therapy: '🧘',
      consultation: '👨‍⚕️',
      lab: '🧪',
      emergency: '🚨',
      medication: '💊',
      imaging: '📸',
      admission: '🏥',
      discharge: '🎉'
    };
    return icons[type] || '📋';
  }

  private generateAIInsight(event: HealthEvent): string {
    const insights: { [key: string]: string[] } = {
      surgery: [
        'Successful procedure with no complications',
        'Recovery progressing as expected',
        'Post-operative monitoring required'
      ],
      scan: [
        'No abnormalities detected',
        'Inflammation markers reviewed',
        'Follow-up imaging recommended'
      ],
      therapy: [
        'Patient showing positive response',
        'Recommend continuing current regimen',
        'Progress exceeding expectations'
      ],
      consultation: [
        'Treatment plan reviewed and updated',
        'Patient vitals stable',
        'Medication dosage adjusted'
      ]
    };

    const typeInsights = insights[event.type] || ['Event completed successfully'];
    return typeInsights[Math.floor(Math.random() * typeInsights.length)];
  }

  private generateMedicationInsight(med: Medication): string {
    if (med.status === 'active') {
      return 'Patient responding well to medication';
    } else if (med.status === 'completed') {
      return 'Treatment course completed successfully';
    } else {
      return 'Medication discontinued as planned';
    }
  }

  private calculateRiskLevel(eventType: string): 'low' | 'medium' | 'high' {
    if (eventType === 'surgery' || eventType === 'emergency') return 'high';
    if (eventType === 'therapy' || eventType === 'consultation') return 'low';
    return 'medium';
  }

  private calculateOverallRisk(): 'low' | 'medium' | 'high' {
    if (!this.patient) return 'low';

    // Simple risk calculation based on conditions
    const highRiskConditions = ['Cancer', 'Heart Disease', 'Stroke'];
    const hasHighRisk = this.patient?.conditions?.some((c: any) =>
      highRiskConditions.some((hr: any) => c.includes(hr))
    );

    if (hasHighRisk) return 'high';
    if (this.patient?.conditions?.length > 2) return 'medium';
    return 'low';
  }

  private calculateStabilityScore(): number {
    // Score from 0-100, higher is more stable
    let score = 85;

    if (this.aiHealthSummary?.riskLevel === 'high') score -= 20;
    if (this.aiHealthSummary?.riskLevel === 'medium') score -= 10;

    if (this.medications.filter(m => m.status === 'active').length > 3) score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  // UI Methods
  setActiveSection(section: PatientOutcomeSection): void {
    this.activeSection = section;
  }

  openAIModal(): void {
    this.showAIModal = true;
  }

  closeAIModal(): void {
    this.showAIModal = false;
  }

  selectEvent(event: MedicalJourneyEvent): void {
    this.selectedEvent = event;
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

  getStabilityColor(): string {
    if (this.stabilityScore >= 80) return '#10B981'; // Green
    if (this.stabilityScore >= 60) return '#FBBF24'; // Yellow
    return '#EF4444'; // Red
  }

  getStabilityGradient(): string {
    const percentage = this.stabilityScore;
    return `linear-gradient(90deg, ${this.getStabilityColor()} ${percentage}%, #E5E7EB ${percentage}%)`;
  }

  getDoctorName(doctorId?: number): string {
    if (!doctorId) return 'Unassigned';

    const doctors: { [key: number]: string } = {
      1: 'Dr. James Wilson',
      2: 'Dr. Maria Garcia'
    };

    return doctors[doctorId] || `Doctor #${doctorId}`;
  }

  getNurseName(nurseId?: number): string {
    if (!nurseId) return 'Unassigned';

    const nurses: { [key: number]: string } = {
      1: 'Nurse Jennifer Lee',
      2: 'Nurse Robert Brown'
    };

    return nurses[nurseId] || `Nurse #${nurseId}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  // Quick actions
  generateAISummary(): void {
    this.toastService.success('Success', 'Generating AI summary...');
    // Regenerate summary
    if (this.patient) {
      this.generateAIHealthSummary(this.patient.id);
    }
  }

  // Get current admission status
  get admissionStatus(): string {
    if (!this.patient) return 'Unknown';

    if (this.patient.admitted) {
      return 'Active';
    }

    // Check if there are any scheduled events
    const hasScheduled = this.healthEvents.some(e =>
      new Date(e.date) > new Date()
    );

    return hasScheduled ? 'Follow-up' : 'Discharged';
  }

  get admissionStatusClass(): string {
    const status = this.admissionStatus;

    const classes: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800 border-green-300',
      'Discharged': 'bg-gray-100 text-gray-800 border-gray-300',
      'Follow-up': 'bg-blue-100 text-blue-800 border-blue-300'
    };

    return classes[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  }

  get activeMedicationsCount(): number {
    return this.medications.filter(m => m.status === 'active').length;
  }
}

