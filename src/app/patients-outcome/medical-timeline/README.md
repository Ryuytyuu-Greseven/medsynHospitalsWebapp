# Medical Timeline Component

## Overview
The Medical Timeline Component is a standalone, reusable Angular component that displays a patient's medical journey in a chronological timeline format. It provides a visual representation of all medical events, procedures, medications, and consultations in a patient's healthcare history.

## Features

### Visual Timeline
- **Chronological Display**: Events are displayed in reverse chronological order (most recent first)
- **Color-Coded Risk Levels**: Events are visually differentiated by risk level (low/medium/high)
- **Animated Entrance**: Smooth fade-in animations for better user experience
- **Interactive Cards**: Clickable event cards that emit selection events

### Event Information
Each timeline event displays:
- Event icon (emoji representation)
- Event title and description
- Event type badge
- Date and time
- Doctor/provider information (if available)
- AI-generated insights
- Outcome information
- Risk level indicator

### Empty State
- Displays a friendly empty state when no medical events are recorded
- Provides clear messaging to users about what will appear

## Component Structure

```
medical-timeline/
├── medical-timeline.component.ts      # Component logic
├── medical-timeline.component.html    # Component template
├── medical-timeline.component.css     # Component styles
└── README.md                          # This file
```

## Usage

### Import the Component

```typescript
import { MedicalTimelineComponent, MedicalJourneyEvent } from './medical-timeline/medical-timeline.component';

@Component({
  selector: 'app-your-component',
  standalone: true,
  imports: [MedicalTimelineComponent],
  // ...
})
```

### Use in Template

```html
<app-medical-timeline 
  [medicalJourney]="medicalJourneyEvents"
  (eventSelected)="handleEventSelection($event)">
</app-medical-timeline>
```

### Handle Event Selection

```typescript
handleEventSelection(event: MedicalJourneyEvent): void {
  console.log('Selected event:', event);
  // Your logic here
}
```

## Interface

### MedicalJourneyEvent

```typescript
export interface MedicalJourneyEvent {
  id: number;
  date: Date;
  type: 'admission' | 'discharge' | 'surgery' | 'operation' | 'report' | 
        'lab' | 'imaging' | 'therapy' | 'medication' | 'consultation' | 'emergency';
  title: string;
  description: string;
  icon: string;
  aiInsight?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  attachments?: string[];
  doctor?: string;
  outcome?: string;
}
```

## Inputs

| Property | Type | Description |
|----------|------|-------------|
| `medicalJourney` | `MedicalJourneyEvent[]` | Array of medical events to display |

## Outputs

| Event | Type | Description |
|-------|------|-------------|
| `eventSelected` | `EventEmitter<MedicalJourneyEvent>` | Emitted when a user clicks on an event card |

## Styling

### CSS Classes
- `.timeline-card` - Main container styling
- `.timeline-wrapper` - Timeline container
- `.timeline-event` - Individual event item
- `.hover-lift` - Hover effect for elevation

### Animations
- `fadeInUp` - Entry animation for events
- `fadeIn` - General fade-in animation

### Risk Level Colors
- **Low Risk**: Green border (#10B981)
- **Medium Risk**: Yellow border (#FBBF24)
- **High Risk**: Red border (#EF4444)

## Customization

### Event Icons
Icons are emoji-based and automatically assigned based on event type:
- Surgery: 🏥
- Scan/Lab: 🔬
- Therapy: 🧘
- Consultation: 👨‍⚕️
- Medication: 💊
- Imaging: 📸
- Emergency: 🚨
- Admission: 🏥
- Discharge: 🎉

### Styling Overrides
You can override the default styles by targeting the component classes in your parent component's styles or global styles.

```css
app-medical-timeline {
  .timeline-event {
    /* Custom styles */
  }
}
```

## Event Types

The component supports the following event types:
- `admission` - Hospital admission
- `discharge` - Hospital discharge
- `surgery` - Surgical procedures
- `operation` - Operational procedures
- `report` - Medical reports
- `lab` - Laboratory tests
- `imaging` - Medical imaging (X-ray, MRI, etc.)
- `therapy` - Therapy sessions
- `medication` - Medication prescriptions
- `consultation` - Doctor consultations
- `emergency` - Emergency visits

## Best Practices

1. **Data Loading**: Load medical journey data before rendering the component
2. **Event Selection**: Implement proper event selection handlers for interactivity
3. **Performance**: For large datasets, consider implementing virtual scrolling
4. **Accessibility**: Ensure event cards are keyboard accessible
5. **Error Handling**: Handle missing or incomplete event data gracefully

## Future Enhancements

Potential improvements for the component:
- [ ] Virtual scrolling for large datasets
- [ ] Filtering by event type
- [ ] Date range filtering
- [ ] Export timeline to PDF
- [ ] Print functionality
- [ ] Detailed event modal view
- [ ] Timeline zoom levels (day/week/month/year)
- [ ] Search within timeline
- [ ] Timeline statistics dashboard

## Dependencies

- Angular Common Module
- Card Component (`../../shared/components/card/card.component`)

## Browser Support

The component uses modern CSS features and should work in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (latest)

## Example

```typescript
// In your component
export class PatientDetailComponent {
  medicalJourney: MedicalJourneyEvent[] = [
    {
      id: 1,
      date: new Date('2024-01-15'),
      type: 'surgery',
      title: 'Appendectomy',
      description: 'Emergency appendectomy performed',
      icon: '🏥',
      aiInsight: 'Successful procedure with no complications',
      riskLevel: 'high',
      doctor: 'Dr. James Wilson',
      outcome: 'Patient recovering well, discharge expected in 2 days'
    },
    // More events...
  ];

  handleEventClick(event: MedicalJourneyEvent): void {
    // Show detailed view or perform other actions
    console.log('Event clicked:', event);
  }
}
```

```html
<!-- In your template -->
<app-medical-timeline 
  [medicalJourney]="medicalJourney"
  (eventSelected)="handleEventClick($event)">
</app-medical-timeline>
```

## Maintenance

- **Created**: October 2025
- **Last Updated**: October 2025
- **Owner**: MedSyn Development Team
- **Status**: Active Development

## Related Components

- `PatientOutcomeComponent` - Parent component that uses the timeline
- `CardComponent` - Shared UI component for card styling

## License

Internal use only - MedSyn Hospitals

