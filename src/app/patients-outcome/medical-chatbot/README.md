# Medical Time Machine AI Chatbot

## Overview

The Medical Chatbot component is an interactive AI-powered assistant that allows doctors to explore and query a patient's complete medical journey through natural conversation. Designed with a "Time Machine" theme, it provides intelligent responses about medical history, medications, lab results, risk assessments, and treatment recommendations.

## Features

### 🤖 Intelligent Conversational Interface
- Natural language processing for medical queries
- Context-aware responses based on patient data
- Real-time typing indicators and smooth animations

### ⏰ Time Machine Theme
- Animated time machine icon with pulsing effects
- Gradient backgrounds with teal/emerald medical theme
- Futuristic UI matching the Digital Time Machine design system

### 💬 Chat Capabilities
- **Text Messages**: Send and receive formatted text messages
- **File Uploads**: Attach medical documents (PDF, DICOM, images, etc.)
- **Quick Actions**: Pre-defined queries for common medical questions
- **Smart Responses**: AI generates contextual responses about:
  - Medical history & timeline
  - Current medications & prescriptions
  - Lab results & vital signs
  - Risk predictions & assessments
  - Treatment recommendations

### 📎 File Management
- Multiple file attachments support
- Upload progress indicators
- File preview with name, type, and size
- Remove files before sending

### 🎯 Quick Action Buttons
Pre-configured queries for instant access:
1. **Medical History** - View complete medical timeline
2. **Medications** - Check current prescriptions and status
3. **Risk Assessment** - Get AI-powered risk predictions
4. **Recommendations** - Receive suggested follow-up actions

### 💾 Chat Management
- **Download Transcript**: Export entire conversation history
- **Clear Chat**: Reset conversation (with confirmation)
- **Message Timestamps**: Shows relative time for each message

## Usage

### Integration

```typescript
import { MedicalChatbotComponent } from './medical-chatbot/medical-chatbot.component';

// In your component
@Component({
  imports: [MedicalChatbotComponent]
})
export class YourComponent {
  patientId = 123;
  patientName = "John Doe";
}
```

### Template

```html
<app-medical-chatbot 
  [patientId]="patient?.id" 
  [patientName]="patient?.name">
</app-medical-chatbot>
```

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `patientId` | `number` | No | Patient's unique identifier |
| `patientName` | `string` | No | Patient's name for personalized responses |

## Components Structure

```
medical-chatbot/
├── medical-chatbot.component.ts    # Main component logic
├── medical-chatbot.component.html  # Template with chat UI
├── medical-chatbot.component.css   # Styling with time machine theme
├── format-message.pipe.ts          # Custom pipe for message formatting
└── README.md                       # This file
```

## Message Interface

```typescript
interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  fileAttachments?: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadProgress?: number;
}
```

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message input

## Styling & Theme

The chatbot follows the Medsyn medical theme:
- **Primary Colors**: Teal (#14B8A6) and Emerald (#10B981)
- **Gradients**: Dynamic gradients for modern medical feel
- **Animations**: Smooth transitions and pulse effects
- **Responsive**: Fully responsive for mobile and desktop

### Key CSS Classes

- `.medical-chatbot-container` - Main container
- `.time-machine-icon` - Animated icon with pulse effects
- `.message-bubble` - Chat message styling
- `.bot-bubble` / `.user-bubble` - Different styling for bot/user
- `.quick-action-chip` - Quick action buttons

## Bot Response Keywords

The AI bot recognizes and responds to various keywords:

- `history`, `timeline` → Medical history overview
- `medication`, `drug`, `prescription` → Current medications
- `risk`, `predict` → Risk assessment
- `lab`, `test`, `result` → Lab results
- `vitals`, `vital signs` → Latest vital signs
- `recommend`, `suggest`, `action` → Recommended actions

## Future Enhancements

- [ ] Real API integration for actual patient data
- [ ] Voice input/output capabilities
- [ ] Multi-language support
- [ ] Advanced NLP for better query understanding
- [ ] Integration with EHR systems
- [ ] Real-time collaboration with other doctors
- [ ] Medical image analysis in chat
- [ ] Scheduled reminders and follow-ups

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading for file attachments
- Debounced typing indicators
- Optimized message rendering
- Smooth scroll performance with large message history

## Accessibility

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatible
- Focus management for modal interactions

## Dependencies

- Angular 17+
- RxJS for reactive programming
- FormsModule for input handling
- CommonModule for Angular directives

## License

Part of the Medsyn Hospital Management System

