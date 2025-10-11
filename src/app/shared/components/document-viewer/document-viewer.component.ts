import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DocumentViewerData {
  title: string;
  url: string;
  type: 'image' | 'pdf' | 'document';
  fileSize?: string;
  uploadedBy?: string;
  uploadedAt?: Date;
  description?: string;
}

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Document Viewer Modal -->
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto" (click)="onBackdropClick()">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full" (click)="$event.stopPropagation()">

          <!-- Modal Header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div [class]="'w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ' + getDocumentTypeClass(document?.type)">
                  {{ getDocumentIcon(document?.type) }}
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ document?.title || 'Document' }}</h3>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span *ngIf="document?.fileSize">{{ document?.fileSize }}</span>
                    <span *ngIf="document?.uploadedBy">Uploaded by {{ document?.uploadedBy }}</span>
                    <span *ngIf="document?.uploadedAt">{{ formatDate(document?.uploadedAt) }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <!-- Zoom Controls -->
                <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button (click)="zoomOut()" class="p-1 hover:bg-gray-200 rounded transition-colors" title="Zoom Out">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                  <span class="px-2 text-xs font-medium text-gray-600">{{ getZoomPercentage() }}%</span>
                  <button (click)="zoomIn()" class="p-1 hover:bg-gray-200 rounded transition-colors" title="Zoom In">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                  <button (click)="resetZoom()" class="p-1 hover:bg-gray-200 rounded transition-colors" title="Reset Zoom">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                </div>

                <!-- Download Button -->
                <button (click)="downloadDocument()" class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" title="Download">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </button>

                <!-- Close Button -->
                <button (click)="close()" class="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Close">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="bg-gray-50 p-4">
            <div class="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
              <!-- Document Content -->
              <div class="relative" [style.transform]="'scale(' + zoomLevel + ')'" [style.transform-origin]="'top left'">

                <!-- Image Display -->
                <div *ngIf="document?.type === 'image'" class="flex items-center justify-center min-h-[400px]">
                  <img [src]="document?.url || ''" [alt]="document?.title || 'Document'"
                       class="max-w-full max-h-[600px] object-contain"
                       (load)="onImageLoad()"
                       (error)="onImageError()">
                </div>

                <!-- PDF Display -->
                <div *ngIf="document?.type === 'pdf'" class="w-full h-[600px]">
                  <iframe [src]="document?.url || ''"
                          class="w-full h-full border-0"
                          title="PDF Document">
                  </iframe>
                </div>

                <!-- Document Display (for other file types) -->
                <div *ngIf="document?.type === 'document'" class="flex items-center justify-center min-h-[400px] p-8">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ document?.title || 'Document' }}</h4>
                    <p class="text-gray-600 mb-4">This document type cannot be previewed in the browser.</p>
                    <button (click)="downloadDocument()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Download to View
                    </button>
                  </div>
                </div>

                <!-- Loading State -->
                <div *ngIf="isLoading" class="flex items-center justify-center min-h-[400px]">
                  <div class="text-center">
                    <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p class="text-gray-600">Loading document...</p>
                  </div>
                </div>

                <!-- Error State -->
                <div *ngIf="hasError" class="flex items-center justify-center min-h-[400px]">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900 mb-2">Unable to Load Document</h4>
                    <p class="text-gray-600 mb-4">There was an error loading this document.</p>
                    <button (click)="downloadDocument()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Download to View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-white px-6 py-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span *ngIf="document?.description">{{ document?.description }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="close()" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-lift {
      transition: all 0.2s ease;
    }
    .hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() document: DocumentViewerData | null = null;
  @Output() closeEvent = new EventEmitter<void>();

  zoomLevel: number = 1;
  isLoading: boolean = false;
  hasError: boolean = false;

  ngOnInit() {
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  onBackdropClick() {
    this.close();
  }

  close() {
    this.closeEvent.emit();
    document.body.style.overflow = 'auto';
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.25, 3);
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.25, 0.25);
  }

  resetZoom() {
    this.zoomLevel = 1;
  }

  downloadDocument() {
    if (this.document?.url) {
      const link = document.createElement('a');
      link.href = this.document.url;
      link.download = this.document.title;
      link.click();
    }
  }

  onImageLoad() {
    this.isLoading = false;
    this.hasError = false;
  }

  onImageError() {
    this.isLoading = false;
    this.hasError = true;
  }

  getDocumentTypeClass(type: string | undefined): string {
    switch (type) {
      case 'image': return 'bg-green-500';
      case 'pdf': return 'bg-red-500';
      case 'document': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }

  getDocumentIcon(type: string | undefined): string {
    switch (type) {
      case 'image': return '🖼️';
      case 'pdf': return '📄';
      case 'document': return '📋';
      default: return '📄';
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getZoomPercentage(): number {
    return Math.round(this.zoomLevel * 100);
  }
}
