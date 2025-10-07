import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styles: []
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalItems = 0;
  @Input() itemsPerPage = 10;
  @Input() currentPage = 1;
  @Input() maxVisiblePages = 5;
  @Output() pageChanged = new EventEmitter<number>();

  totalPages = 0;
  visiblePages: number[] = [];

  ngOnInit(): void {
    this.calculatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage'] || changes['currentPage']) {
      this.calculatePagination();
    }
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = Math.min(Math.max(1, this.currentPage), this.totalPages);
    this.calculateVisiblePages();
  }

  private calculateVisiblePages(): void {
    const half = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

    if (end - start + 1 < this.maxVisiblePages) {
      start = Math.max(1, end - this.maxVisiblePages + 1);
    }

    this.visiblePages = [];
    for (let i = start; i <= end; i++) {
      this.visiblePages.push(i);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.calculateVisiblePages();
      this.pageChanged.emit(page);
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  get showPagination(): boolean {
    return this.totalPages > 1;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  get showFirstEllipsis(): boolean {
    return this.visiblePages.length > 0 && this.visiblePages[0] > 1;
  }

  get showLastEllipsis(): boolean {
    return this.visiblePages.length > 0 && this.visiblePages[this.visiblePages.length - 1] < this.totalPages;
  }
}
