import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { PublicPatientProfile } from '../../core/interfaces';
import { PatientService } from '../../core/services/patient.service';
import { ToastService } from '../../core/services';

export interface HealthEvent {
  id: number;
  title: string;
  description: string;
  // type:
  //   | 'surgery'
  //   | 'scan'
  //   | 'therapy'
  //   | 'consultation'
  //   | 'emergency'
  //   | 'operation'
  //   | 'lab'
  //   | 'diagnostic'
  //   | 'followup';
  start: Date;
  doctor?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
}

@Component({
  selector: 'app-health-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './health-events.component.html',
  styleUrls: ['./health-events.component.css'],
})
export class HealthEventsComponent {
  @Input() healthEvents: HealthEvent[] = [];
  @Input() patientDetails: PublicPatientProfile | null = null;

  // Modal state
  showAddEventModal = false;
  newEvent: Partial<HealthEvent> = {};
  updateEvent: Partial<HealthEvent> = {};

  // Reactive Form
  eventForm!: FormGroup;

  constructor(
    private patientService: PatientService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      status: ['scheduled', Validators.required],
      doctor: [''],
    });
  }

  ngOnInit(): void {
    this.getPatientEvents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['patientDetails']) {
    //   this.getPatientEvents();
    // }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getEventTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      surgery: 'bg-gradient-to-br from-red-500 to-pink-600',
      scan: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      therapy: 'bg-gradient-to-br from-green-500 to-emerald-600',
      consultation: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      emergency: 'bg-gradient-to-br from-red-600 to-orange-600',
      operation: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      lab: 'bg-gradient-to-br from-yellow-500 to-orange-600',
      diagnostic: 'bg-gradient-to-br from-purple-500 to-pink-600',
      followup: 'bg-gradient-to-br from-green-500 to-teal-600',
    };
    return classes[type] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  }

  getEventIcon(type: string): string {
    const icons: { [key: string]: string } = {
      surgery: '🏥',
      scan: '🔬',
      therapy: '💪',
      consultation: '👨‍⚕️',
      emergency: '🚨',
      operation: '⚕️',
      lab: '🧪',
      diagnostic: '🔬',
      followup: '📅',
    };
    return icons[type] || '📋';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  // Modal functions
  openAddEventModal(eventType?: string): void {
    this.showAddEventModal = true;
    this.eventForm.reset({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'scheduled',
      doctor: '',
    });
    // this.newEvent = {
    //   // type: eventType as any,
    //   status: 'scheduled',
    //   date: new Date(),
    // };
  }

  closeAddEventModal(): void {
    this.showAddEventModal = false;
    this.eventForm.reset();
    this.newEvent = {};
  }

  isFormValid(): boolean {
    return this.eventForm.valid;
  }

  // Quick Actions helper functions
  getUpcomingEventsCount(): number {
    return this.healthEvents.filter(
      (event) =>
        event.status === 'scheduled' && new Date(event.start) > new Date()
    ).length;
  }

  getNextEvent(): string {
    const upcomingEvents = this.healthEvents
      .filter(
        (event) =>
          event.status === 'scheduled' && new Date(event.start) > new Date()
      )
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    if (upcomingEvents.length > 0) {
      const nextEvent = upcomingEvents[0];
      return `${nextEvent.title} on ${this.formatDate(nextEvent.start)}`;
    }
    return '';
  }

  // ========================== APIS CALLS ==========================
  /** Get patient events */
  getPatientEvents(): void {
    if (this.patientDetails?.healthId) {
      this.patientService
        .getPatientEvents({
          healthId: this.patientDetails?.healthId,
          page: 1,
          limit: 10,
        })
        .subscribe((response) => {
          console.log('response', response);
          this.healthEvents = response;
        });
    }
  }

  /** Add patient event */
  addPatientEvent(): void {
    const formValue = this.eventForm.value;
    const payload = {
      healthId: this.patientDetails?.healthId,
      title: formValue.title,
      description: formValue.description,
      // type: this.newEvent.type,
      start: new Date(formValue.date),
      doctor: formValue.doctor,
      status: formValue.status,
    };

    this.patientService.addPatientEvent(payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success(
            'Success',
            'Health event added successfully'
          );
          this.getPatientEvents();
          this.closeAddEventModal();
        } else {
          this.toastService.error('Error', 'Failed to add health event');
        }
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to add health event');
        console.error('Error adding health event:', error);
      },
    });
  }

  /** Update patient event */
  updatePatientEvent(): void {
    const formValue = this.eventForm.value;
    const payload = {
      eventId: this.updateEvent?.id,
      title: formValue.title,
      description: formValue.description,
      start: new Date(formValue.date),
      doctor: formValue.doctor,
      status: formValue.status,
    };

    this.patientService.updatePatientEvent(payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success(
            'Success',
            'Health event updated successfully'
          );
          this.getPatientEvents();
          this.closeAddEventModal();
        } else {
          this.toastService.error('Error', 'Failed to update health event');
        }
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to update health event');
        console.error('Error updating health event:', error);
      },
    });
  }
}
