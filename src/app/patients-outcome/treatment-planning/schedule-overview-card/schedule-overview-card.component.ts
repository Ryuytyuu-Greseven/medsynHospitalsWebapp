import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScheduleOverviewDay } from '../treatment-planning.types';

type WeekDaySlot = {
  label: string;
  dateLabel: string;
  total: number;
  breakdown: Array<{
    label: string;
    value: number;
    className: string;
  }>;
};

@Component({
  selector: 'app-schedule-overview-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-overview-card.component.html',
  styleUrls: ['./schedule-overview-card.component.css'],
})
export class ScheduleOverviewCardComponent {
  @Input({ required: true }) schedule: ScheduleOverviewDay[] = [];
  @Output() viewFullSchedule = new EventEmitter<void>();

  private readonly breakdownMap = [
    { key: 'pt', label: 'PT', className: 'segment-pt' },
    { key: 'ot', label: 'OT', className: 'segment-ot' },
    { key: 'st', label: 'ST', className: 'segment-st' },
    { key: 'other', label: 'Other', className: 'segment-other' },
  ] as const;

  private readonly dayNameFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  });

  private readonly dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  });

  trackByWeekDay(_: number, day: WeekDaySlot): string {
    return `${day.label}-${day.dateLabel}`;
  }

  get weekWindow(): WeekDaySlot[] {
    const today = new Date();
    return Array.from({ length: 6 }, (_, offset) => {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + offset);
      const dayKey = this.getDayKey(dayDate);
      const entry = this.schedule.find(
        (item) => this.normalizeDay(item.day) === dayKey,
      );
      const breakdown = this.getDisciplineBreakdown(entry);
      const total = entry?.totalSessions ?? 0;
      return {
        label: this.dayNameFormatter.format(dayDate),
        dateLabel: this.dateFormatter.format(dayDate),
        breakdown,
        total,
      };
    });
  }

  private getDisciplineBreakdown(
    day?: ScheduleOverviewDay,
  ): WeekDaySlot['breakdown'] {
    if (!day) {
      return [];
    }
    return this.breakdownMap
      .map((item) => ({
        label: item.label,
        className: item.className,
        value: (day as unknown as Record<string, number>)[item.key] ?? 0,
      }))
      .filter((entry) => entry.value > 0);
  }

  private normalizeDay(value: string | undefined): string {
    return value ? value.slice(0, 3).toLowerCase() : '';
  }

  private getDayKey(date: Date): string {
    return this.dayNameFormatter.format(date).slice(0, 3).toLowerCase();
  }
}

