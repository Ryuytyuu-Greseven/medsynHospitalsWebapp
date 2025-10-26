import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatMessage',
  standalone: true
})
export class FormatMessagePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Convert line breaks to <br>
    let formatted = value.replace(/\n/g, '<br>');

    // Convert **bold** text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert bullet points
    formatted = formatted.replace(/^• /gm, '<span style="color: #14B8A6; font-weight: bold;">•</span> ');
    formatted = formatted.replace(/^✓ /gm, '<span style="color: #10B981; font-weight: bold;">✓</span> ');

    return this.sanitizer.sanitize(SecurityContext.HTML, formatted) || '';
  }
}

