import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastCounter = 0;
  toasts = signal<Toast[]>([]);

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000): void {
    const id = this.toastCounter++;
    
    // Add the toast
    this.toasts.update(toasts => [
      ...toasts,
      { id, message, type, duration }
    ]);

    // Remove the toast after duration
    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id: number): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }
}