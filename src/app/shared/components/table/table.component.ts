import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styles: []
})
export class TableComponent {
  @Input() columns: Array<{key: string, label: string, sortable?: boolean}> = [];
  @Input() striped = true;
  @Input() hover = true;

  get tableClasses(): string {
    const baseClasses = 'table w-full border-collapse';
    const stripedClass = this.striped ? 'table-striped' : '';
    const hoverClass = this.hover ? 'table-hover' : '';

    return `${baseClasses} ${stripedClass} ${hoverClass}`;
  }

  getHeaderClasses(column: any): string {
    const baseClasses = 'px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200';
    const sortableClass = column.sortable ? 'cursor-pointer hover:bg-gray-50' : '';

    return `${baseClasses} ${sortableClass}`;
  }
}
