import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { FormatMessagePipe } from './format-message.pipe';
import { ApiService } from '../../apis/api.service';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  fileAttachments?: File[];
  isTyping?: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadProgress?: number;
}

@Component({
  selector: 'app-medical-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatMessagePipe],
  templateUrl: './medical-chatbot.component.html',
  styleUrls: ['./medical-chatbot.component.css'],
})
export class MedicalChatbotComponent implements OnInit, OnDestroy {
  @Input() patientId?: number;
  @Input() patientName?: string;

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;

  messages: ChatMessage[] = [];
  messageInput = '';
  attachedFiles: File[] = [];
  isTyping = false;
  isBotThinking = false;

  // Minimizable state
  isMinimized = true;
  hasUnreadMessages = false;

  // Typing indicator
  private typingSubject = new Subject<void>();
  private typingSubscription?: Subscription;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.initializeChat();

    // Setup typing indicator (bot will respond after user stops typing for 1 second)
    this.typingSubscription = this.typingSubject
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.isTyping = false;
      });
  }

  ngOnDestroy(): void {
    this.typingSubscription?.unsubscribe();
  }

  private initializeChat(): void {
    // Welcome message from the AI (will show when first opened)
    this.addBotMessage(
      `👋 Hello Doctor! I'm your AI assistant for ${
        this.patientName || 'this patient'
      }.\n\nI can help you with:\n• Medical history & timeline\n• Lab results & medications\n• Risk assessments\n• Treatment recommendations\n\nWhat would you like to know?`
    );
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;

    if (!this.isMinimized) {
      // Mark messages as read when opening
      this.hasUnreadMessages = false;
      this.scrollToBottom();
    }
  }

  minimize(): void {
    this.isMinimized = true;
  }

  onTyping(): void {
    this.isTyping = true;
    this.typingSubject.next();
  }


  private generateBotResponse(userInput: string): void {
    const input = userInput.toLowerCase();
    let response = '';

    // Smart responses based on keywords
    if (input.includes('history') || input.includes('timeline')) {
      response = `📅 Based on the medical timeline, ${
        this.patientName || 'the patient'
      } has:\n\n• Last admission: 15 days ago for routine checkup\n• Recent surgery: Successful appendectomy 3 months ago\n• Ongoing medications: 3 active prescriptions\n• Last lab results: All parameters within normal range\n\nWould you like me to provide more details on any specific event?`;
    } else if (
      input.includes('medication') ||
      input.includes('drug') ||
      input.includes('prescription')
    ) {
      response = `💊 Current Medications:\n\n1. **Metformin 500mg** - Twice daily\n   Status: Active | Started: 6 months ago\n   Compliance: Excellent (98%)\n\n2. **Lisinopril 10mg** - Once daily\n   Status: Active | Started: 8 months ago\n   For: Blood pressure management\n\n3. **Aspirin 81mg** - Once daily\n   Status: Active | Started: 1 year ago\n   For: Cardiovascular protection\n\nAll medications show good tolerance with no reported side effects.`;
    } else if (input.includes('risk') || input.includes('predict')) {
      response = `⚠️ AI Risk Assessment:\n\n**Overall Risk Level:** Low-Medium\n**Confidence:** 92%\n\n**Key Risk Factors:**\n• Mild cardiovascular risk (15% probability)\n• Glucose fluctuation requiring monitoring\n• BMI slightly elevated (25.7)\n\n**Protective Factors:**\n• Excellent medication compliance\n• Regular follow-ups maintained\n• Stable vital signs for 2+ weeks\n\n**Recommendation:** Continue current treatment plan with follow-up in 2 weeks.`;
    } else if (
      input.includes('lab') ||
      input.includes('test') ||
      input.includes('result')
    ) {
      response = `🔬 Recent Lab Results (Last 7 days):\n\n**Blood Panel:**\n• Glucose: 105 mg/dL (Slightly elevated)\n• HbA1c: 6.2% (Good control)\n• Cholesterol: 185 mg/dL (Normal)\n• Blood Pressure: 130/85 mmHg (Controlled)\n\n**Liver Function:** Normal\n**Kidney Function:** Normal\n**Complete Blood Count:** Within range\n\n✅ Overall: Results indicate well-controlled condition with minor glucose monitoring needed.`;
    } else if (input.includes('vitals') || input.includes('vital signs')) {
      response = `📊 Latest Vital Signs:\n\n• **Blood Pressure:** 128/82 mmHg\n• **Heart Rate:** 72 bpm (Regular rhythm)\n• **Temperature:** 98.6°F (37°C)\n• **Respiratory Rate:** 16 breaths/min\n• **Oxygen Saturation:** 98%\n• **Weight:** 70.5 kg\n• **BMI:** 25.7\n\nAll vital signs are stable and within acceptable ranges.`;
    } else if (
      input.includes('recommend') ||
      input.includes('suggest') ||
      input.includes('action')
    ) {
      response = `💡 AI Recommended Actions:\n\n**Immediate (Next 2 weeks):**\n✓ Schedule follow-up consultation\n✓ Review Metformin dosage\n✓ Monitor glucose levels twice weekly\n\n**Short-term (1-3 months):**\n✓ Dietary consultation for weight management\n✓ Cardiovascular screening\n✓ Physical activity assessment\n\n**Long-term:**\n✓ Continue current monitoring schedule\n✓ Annual comprehensive health screening\n✓ Preventive care optimization\n\nWould you like me to schedule any of these appointments?`;
    } else if (input.includes('thank') || input.includes('thanks')) {
      response = `You're welcome! I'm here to help you navigate ${
        this.patientName || 'the patient'
      }'s medical journey anytime. Feel free to ask any other questions! 😊`;
    } else if (
      input.includes('hello') ||
      input.includes('hi') ||
      input.includes('hey')
    ) {
      response = `Hello, Doctor! 👋 I'm ready to assist you with ${
        this.patientName || 'this patient'
      }'s medical information. What would you like to know?`;
    } else {
      // Default intelligent response
      response = `I understand you're asking about "${userInput}". Let me analyze the patient's medical records...\n\n🔍 Based on the available data for ${
        this.patientName || 'this patient'
      }:\n\n• Medical history: Comprehensive records spanning 5+ years\n• Recent activity: Last consultation was 2 weeks ago\n• Current status: Stable with ongoing monitoring\n• AI confidence: 94% data completeness\n\nCould you please be more specific about what aspect you'd like me to focus on? For example:\n• Medical history & timeline\n• Current medications\n• Lab results & vitals\n• Risk predictions\n• Treatment recommendations`;
    }

    this.addBotMessage(response);
  }

  private addBotMessage(content: string): void {
    const botMessage: ChatMessage = {
      id: this.generateId(),
      type: 'bot',
      content,
      timestamp: new Date(),
    };

    this.messages.push(botMessage);

    // Show unread indicator if minimized
    if (this.isMinimized && this.messages.length > 1) {
      this.hasUnreadMessages = true;
    }

    this.scrollToBottom();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    Array.from(input.files).forEach((file) => {
      const attachment: FileAttachment = {
        id: this.generateId(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadProgress: 0,
      };

      this.attachedFiles.push(file);

      // Simulate file upload progress
      this.simulateUpload(attachment);
    });

    // Reset file input
    input.value = '';
  }

  private simulateUpload(file: FileAttachment): void {
    const interval = setInterval(() => {
      if (file.uploadProgress !== undefined) {
        file.uploadProgress += 10;
        if (file.uploadProgress >= 100) {
          file.uploadProgress = 100;
          clearInterval(interval);
        }
      }
    }, 100);
  }

  removeFile(fileId: any): void {
    this.attachedFiles = [];
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  clearChat(): void {
    if (confirm('Are you sure you want to clear the chat history?')) {
      this.messages = [];
      this.initializeChat();
    }
  }

  downloadTranscript(): void {
    const transcript = this.messages
      .map((msg) => {
        const time = new Date(msg.timestamp).toLocaleString();
        const sender = msg.type === 'user' ? 'Doctor' : 'AI Assistant';
        return `[${time}] ${sender}:\n${msg.content}\n`;
      })
      .join('\n---\n\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-chat-${
      this.patientName || 'patient'
    }-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  onKeyDown(event: KeyboardEvent): void {
    // Send message on Enter (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // this.sendMessage();
    }
  }

  // Quick action buttons
  askAboutHistory(): void {
    this.messageInput = 'Can you provide a summary of the medical history?';
    // this.sendMessage();
  }

  askAboutMedications(): void {
    this.messageInput = 'What are the current medications and their status?';
    // this.sendMessage();
  }

  askAboutRisks(): void {
    this.messageInput = 'What are the predicted health risks?';
    // this.sendMessage();
  }

  askAboutRecommendations(): void {
    this.messageInput = 'What are your recommendations for next steps?';
    // this.sendMessage();
  }

  // ============================ USER QUERY ============================ //
  sendUserQuery(): void {
    const text = this.messageInput.trim();
    if (!text) return;

    const file =
      this.attachedFiles.length > 0 ? (this.attachedFiles.pop() as File) : null;
    const messageText = this.messageInput.trim();

    // Send image with text if provided, otherwise just image
    if (messageText) {
      this.sendImageWithText(file, messageText);
      this.messageInput = ''; // Clear the input after sending
    }
  }

  // ============================ API CALLS ============================ //

  // Observable<BotResponse>
  sendImageWithText(file: File | null, text: string): void {

    // Create user message
    const userMessage: ChatMessage = {
      id: this.generateId(),
      type: 'user',
      content: text ? text : '',
      timestamp: new Date(),
      fileAttachments:
        this.attachedFiles.length > 0 ? [...this.attachedFiles] : undefined,
    };
    this.messages.push(userMessage);
    this.scrollToBottom();
    this.isBotThinking = true;

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    console.log('text', text);
    formData.append('query', text);
    formData.append('patientId', this.patientId?.toString() || '');

    this.apiService.botUserQuery(formData).subscribe({
      next: (response) => {
        this.isTyping = false;
        this.addBotMessage(response.message);
        this.isBotThinking = false;
      },
      error: () => {
        this.isTyping = false;
        this.isBotThinking = false;
        this.addBotMessage('Sorry, I couldn\'t process that. Please try again or type your message instead.');
      },
    });
  }
}
