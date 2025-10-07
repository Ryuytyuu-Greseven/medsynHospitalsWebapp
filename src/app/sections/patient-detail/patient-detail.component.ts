import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService, Patient, PatientStats, Medication, DietEntry, HealthEvent } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TimelineComponent, TimelineEvent } from '../../shared/components/timeline/timeline.component';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CardComponent, TableComponent, ButtonComponent, TimelineComponent],
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  patient: Patient | null = null;
  patientStats: PatientStats | null = null;
  medications: Medication[] = [];
  dietEntries: DietEntry[] = [];
  healthEvents: HealthEvent[] = [];
  medicalSummary: any = {};

  activeTab = 'overview';
  showAddMedication = false;
  showAddDiet = false;
  showAddEvent = false;

  tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'medications', label: 'Medications' },
    { key: 'diet', label: 'Diet' },
    { key: 'health-events', label: 'Health Events' },
    { key: 'insights', label: 'Insights' }
  ];

  medicationColumns = [
    { key: 'medication', label: 'Medication', sortable: false },
    { key: 'frequency', label: 'Frequency', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  dietColumns = [
    { key: 'meal', label: 'Meal', sortable: false },
    { key: 'notes', label: 'Notes', sortable: false },
    { key: 'calories', label: 'Calories', sortable: false }
  ];

  newMedication = {
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  };

  newDietEntry = {
    mealType: 'breakfast',
    notes: '',
    calories: 0
  };

  newHealthEvent = {
    type: 'consultation',
    title: '',
    description: '',
    outcome: '',
    date: new Date().toISOString().split('T')[0]
  };

  // Computed properties
  get recentActivity() {
    const medicationEvents = this.medications.map(m => ({
      title: `${m.name} medication`,
      date: m.startDate
    }));

    const dietEvents = this.dietEntries.map(d => ({
      title: `${d.mealType} logged`,
      date: d.date
    }));

    const healthEvents = this.healthEvents.map(h => ({
      title: h.title,
      date: h.date
    }));

    const allEvents = [...medicationEvents, ...dietEvents, ...healthEvents]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return allEvents;
  }

  get activeMedicationsCount() {
    return this.medications.filter(m => m.status === 'active').length;
  }

  get dietEntriesCount() {
    return this.dietEntries.length;
  }

  get healthEventsCount() {
    return this.healthEvents.length;
  }

  get dietSummary() {
    const totalCalories = this.dietEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const entriesThisWeek = this.dietEntries.length;
    const compliancePercentage = Math.min(100, (entriesThisWeek / 21) * 100);

    return {
      totalCalories,
      entriesThisWeek,
      compliancePercentage
    };
  }

  get healthEventsTimeline(): TimelineEvent[] {
    return this.healthEvents.map(event => ({
      id: event.id,
      date: event.date,
      title: event.title,
      description: `${event.description} - Outcome: ${event.outcome}`,
      type: 'past' as const,
      status: 'completed' as const
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const patientId = +params['id'];
      this.loadPatient(patientId);
      this.loadPatientData(patientId);
    });
  }

  private loadPatient(patientId: number): void {
    this.dataService.getPatientById(patientId).subscribe(patient => {
      this.patient = patient || null;
    });
  }

  private loadPatientData(patientId: number): void {
    // Load patient stats
    this.dataService.getPatientStats(patientId).subscribe(stats => {
      this.patientStats = stats || null;
    });

    // Load medications
    this.dataService.getMedications(patientId).subscribe(medications => {
      this.medications = medications;
    });

    // Load diet entries
    this.dataService.getDietEntries(patientId).subscribe(entries => {
      this.dietEntries = entries;
    });

    // Load health events
    this.dataService.getHealthEvents(patientId).subscribe(events => {
      this.healthEvents = events;
    });

    // Load medical summary
    this.dataService.getPatientMedicalSummary(patientId).subscribe(summary => {
      this.medicalSummary = summary;
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  addMedication(): void {
    if (!this.patient) return;

    const medicationData = {
      patientId: this.patient.id,
      name: this.newMedication.name,
      dosage: this.newMedication.dosage,
      frequency: this.newMedication.frequency,
      startDate: new Date(this.newMedication.startDate),
      status: 'active' as const,
      notes: this.newMedication.notes
    };

    this.dataService.addMedication(medicationData).subscribe({
      next: (medication) => {
        this.toastService.success('Success', 'Medication added successfully');
        this.loadPatientData(this.patient!.id);
        this.resetMedicationForm();
        this.showAddMedication = false;
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to add medication');
        console.error('Error adding medication:', error);
      }
    });
  }

  updateMedicationStatus(medicationId: number, status: 'active' | 'completed' | 'discontinued'): void {
    this.dataService.updateMedicationStatus(medicationId, status).subscribe({
      next: (medication) => {
        this.toastService.success('Success', 'Medication status updated');
        this.loadPatientData(this.patient!.id);
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to update medication status');
        console.error('Error updating medication:', error);
      }
    });
  }

  addDietEntry(): void {
    if (!this.patient) return;

    const dietData = {
      patientId: this.patient.id,
      date: new Date(),
      mealType: this.newDietEntry.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      notes: this.newDietEntry.notes,
      calories: this.newDietEntry.calories
    };

    this.dataService.addDietEntry(dietData).subscribe({
      next: (entry) => {
        this.toastService.success('Success', 'Meal logged successfully');
        this.loadPatientData(this.patient!.id);
        this.resetDietForm();
        this.showAddDiet = false;
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to log meal');
        console.error('Error adding diet entry:', error);
      }
    });
  }

  addHealthEvent(): void {
    if (!this.patient) return;

    const eventData = {
      patientId: this.patient.id,
      date: new Date(this.newHealthEvent.date),
      type: this.newHealthEvent.type as any,
      title: this.newHealthEvent.title,
      description: this.newHealthEvent.description,
      outcome: this.newHealthEvent.outcome
    };

    this.dataService.addHealthEvent(eventData).subscribe({
      next: (event) => {
        this.toastService.success('Success', 'Health event added successfully');
        this.loadPatientData(this.patient!.id);
        this.resetHealthEventForm();
        this.showAddEvent = false;
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to add health event');
        console.error('Error adding health event:', error);
      }
    });
  }

  resetMedicationForm(): void {
    this.newMedication = {
      name: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
  }

  resetDietForm(): void {
    this.newDietEntry = {
      mealType: 'breakfast',
      notes: '',
      calories: 0
    };
  }

  resetHealthEventForm(): void {
    this.newHealthEvent = {
      type: 'consultation',
      title: '',
      description: '',
      outcome: '',
      date: new Date().toISOString().split('T')[0]
    };
  }

  getMedicationStatusClasses(status: string): string {
    const baseClasses = 'medication-status';
    const statusClasses = {
      active: 'medication-status-active',
      completed: 'medication-status-completed',
      discontinued: 'medication-status-discontinued'
    };

    return `${baseClasses} ${statusClasses[status as keyof typeof statusClasses]}`;
  }

  getDoctorName(doctorId: number): string {
    const doctorNames: { [key: number]: string } = {
      1: 'James Wilson',
      2: 'Maria Garcia'
    };
    return doctorNames[doctorId] || `Doctor #${doctorId}`;
  }

  getNurseName(nurseId: number): string {
    const nurseNames: { [key: number]: string } = {
      1: 'Jennifer Lee',
      2: 'Robert Brown'
    };
    return nurseNames[nurseId] || `Nurse #${nurseId}`;
  }
}
