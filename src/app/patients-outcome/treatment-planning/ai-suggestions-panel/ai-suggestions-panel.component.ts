import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AISuggestionGoal, AISuggestionIntervention } from '../treatment-planning.types';

@Component({
  selector: 'app-ai-suggestions-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-suggestions-panel.component.html',
  styleUrls: ['./ai-suggestions-panel.component.css']
})
export class AiSuggestionsPanelComponent {
  @Input({ required: true }) goalSuggestions: AISuggestionGoal[] = [];
  @Input({ required: true }) interventionSuggestions: AISuggestionIntervention[] = [];

  @Output() acceptGoal = new EventEmitter<AISuggestionGoal>();
  @Output() dismissGoal = new EventEmitter<AISuggestionGoal>();
  @Output() acceptIntervention = new EventEmitter<AISuggestionIntervention>();
  @Output() dismissIntervention = new EventEmitter<AISuggestionIntervention>();
}

