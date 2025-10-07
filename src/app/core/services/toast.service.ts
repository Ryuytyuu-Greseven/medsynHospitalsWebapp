import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastContainer: HTMLElement | null = null;

  constructor() {
    this.createToastContainer();
  }

  private createToastContainer(): void {
    this.toastContainer = document.createElement('div');
    this.toastContainer.style.position = 'fixed';
    this.toastContainer.style.top = '8rem';
    this.toastContainer.style.right = '1rem';
    this.toastContainer.style.zIndex = '2147483647';
    this.toastContainer.style.pointerEvents = 'none';
    this.toastContainer.style.display = 'flex';
    this.toastContainer.style.flexDirection = 'column';
    this.toastContainer.style.gap = '0.5rem';
    this.toastContainer.style.width = '400px';
    this.toastContainer.style.minHeight = '100px';
    this.toastContainer.style.isolation = 'isolate';
    this.toastContainer.style.willChange = 'transform';
    document.body.appendChild(this.toastContainer);
  }

  show(type: ToastType, title: string, message: string, duration: number = 5000): void {
    const toast: Toast = {
      id: this.generateId(),
      type,
      title,
      message,
      duration
    };

    this.toasts.push(toast);
    this.renderToast(toast);

    // Auto-dismiss
    setTimeout(() => {
      this.dismiss(toast.id);
    }, duration);
  }

  success(title: string, message: string, duration?: number): void {
    this.show('success', title, message, duration);
  }

  error(title: string, message: string, duration?: number): void {
    this.show('error', title, message, duration);
  }

  warning(title: string, message: string, duration?: number): void {
    this.show('warning', title, message, duration);
  }

  info(title: string, message: string, duration?: number): void {
    this.show('info', title, message, duration);
  }

  private renderToast(toast: Toast): void {
    if (!this.toastContainer) return;

    const toastElement = document.createElement('div');
    toastElement.id = `toast-${toast.id}`;
    toastElement.className = `toast toast-${toast.type} animate-slide-in-right`;
    toastElement.style.pointerEvents = 'auto';
    toastElement.style.transform = 'translateX(100%)';
    toastElement.style.transition = 'transform 0.3s ease-out';

    const iconMap = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toastElement.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <span class="text-lg">${iconMap[toast.type]}</span>
        </div>
        <div class="ml-3 flex-1">
          <h4 class="text-sm font-medium text-gray-900">${toast.title}</h4>
          <p class="text-sm text-gray-600 mt-1">${toast.message}</p>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button
            onclick="this.closest('.toast').remove()"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <span class="sr-only">Close</span>
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    this.toastContainer.appendChild(toastElement);

    // Animate in
    setTimeout(() => {
      toastElement.style.transform = 'translateX(0)';
    }, 10);
  }

  private dismiss(toastId: string): void {
    const toastElement = document.getElementById(`toast-${toastId}`);
    if (toastElement) {
      toastElement.style.transform = 'translateX(100%)';
      setTimeout(() => {
        toastElement.remove();
      }, 300);
    }

    this.toasts = this.toasts.filter(t => t.id !== toastId);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
