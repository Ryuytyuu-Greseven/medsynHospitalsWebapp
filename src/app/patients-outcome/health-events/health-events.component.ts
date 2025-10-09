import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';

export interface HealthEvent {
  id: number;
  title: string;
  description: string;
  type: 'surgery' | 'scan' | 'therapy' | 'consultation' | 'emergency' | 'operation' | 'lab' | 'diagnostic' | 'followup';
  date: Date;
  doctor?: string;
  outcome?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
}

@Component({
  selector: 'app-health-events',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './health-events.component.html',
  styleUrls: ['./health-events.component.css']
})
export class HealthEventsComponent {
  @Input() healthEvents: HealthEvent[] = [];

  // Modal state
  showAddEventModal = false;
  newEvent: Partial<HealthEvent> = {};

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      followup: 'bg-gradient-to-br from-green-500 to-teal-600'
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
      followup: '📅'
    };
    return icons[type] || '📋';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  // Modal functions
  openAddEventModal(eventType?: string): void {
    this.showAddEventModal = true;
    this.newEvent = {
      type: eventType as any,
      status: 'scheduled',
      date: new Date()
    };
  }

  closeAddEventModal(): void {
    this.showAddEventModal = false;
    this.newEvent = {};
  }

  addHealthEvent(): void {
    if (this.isFormValid()) {
      const event: HealthEvent = {
        id: Date.now(), // Simple ID generation
        title: this.newEvent.title!,
        description: this.newEvent.description || '',
        type: this.newEvent.type!,
        date: new Date(this.newEvent.date!),
        doctor: this.newEvent.doctor,
        outcome: this.newEvent.outcome,
        status: this.newEvent.status || 'scheduled'
      };

      this.healthEvents.push(event);
      this.closeAddEventModal();
    }
  }

  isFormValid(): boolean {
    return !!(this.newEvent.title && this.newEvent.type && this.newEvent.date && this.newEvent.status);
  }

  // Quick Actions helper functions
  getUpcomingEventsCount(): number {
    return this.healthEvents.filter(event =>
      event.status === 'scheduled' && new Date(event.date) > new Date()
    ).length;
  }

  getNextEvent(): string {
    const upcomingEvents = this.healthEvents
      .filter(event => event.status === 'scheduled' && new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (upcomingEvents.length > 0) {
      const nextEvent = upcomingEvents[0];
      return `${nextEvent.title} on ${this.formatDate(nextEvent.date)}`;
    }
    return '';
  }
}

