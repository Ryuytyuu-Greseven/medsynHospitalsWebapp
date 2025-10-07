import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineEvent {
  id: number;
  date: Date;
  title: string;
  description: string;
  type: 'past' | 'present' | 'future';
  status?: 'completed' | 'ongoing' | 'scheduled';
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styles: []
})
export class TimelineComponent {
  @Input() events: TimelineEvent[] = [];

  trackByEventId(index: number, event: TimelineEvent): number {
    return event.id;
  }

  getEventClasses(event: TimelineEvent): string {
    const typeClasses = {
      past: 'past',
      present: 'present',
      future: 'future'
    };

    return typeClasses[event.type] || '';
  }

  getStatusClasses(status: string): string {
    const statusClasses = {
      completed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
      ongoing: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
      scheduled: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
    };

    return statusClasses[status as keyof typeof statusClasses] || '';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
