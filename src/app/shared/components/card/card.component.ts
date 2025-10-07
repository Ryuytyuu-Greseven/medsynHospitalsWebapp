import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'glass' | 'elevated';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styles: []
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() padding = true;
  @Input() hover = false;

  get cardClasses(): string {
    const baseClasses = 'rounded-xl shadow-md border';
    const variantClasses = {
      default: 'card',
      glass: 'card-glass',
      elevated: 'card shadow-lg'
    };
    const paddingClass = this.padding ? 'p-6' : '';
    const hoverClass = this.hover ? 'hover:shadow-lg transition-shadow duration-200' : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${paddingClass} ${hoverClass}`;
  }
}
