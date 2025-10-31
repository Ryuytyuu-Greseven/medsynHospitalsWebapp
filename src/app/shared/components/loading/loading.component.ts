import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  @Input() text: string = 'Loading...';
  @Input() size: LoadingSize = 'md';
  @Input() fullScreen: boolean = false;
  @Input() overlay: boolean = false;

  get sizeClasses(): { spinner: string; text: string; container: string } {
    const sizes = {
      sm: {
        spinner: 'h-6 w-6',
        text: 'text-xs',
        container: 'gap-2'
      },
      md: {
        spinner: 'h-10 w-10',
        text: 'text-sm',
        container: 'gap-3'
      },
      lg: {
        spinner: 'h-16 w-16',
        text: 'text-base',
        container: 'gap-4'
      },
      xl: {
        spinner: 'h-24 w-24',
        text: 'text-lg',
        container: 'gap-5'
      }
    };
    return sizes[this.size];
  }

  get colorClasses(): { border: string; bg: string; text: string } {
    // Using the application's primary teal medical theme
    return {
      border: 'border-teal-500',
      bg: 'bg-teal-500',
      text: 'text-teal-700'
    };
  }
}

