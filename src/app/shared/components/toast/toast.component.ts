import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
      <div
        class="toast"
        [ngClass]="{
          success: toast.type === 'success',
          error: toast.type === 'error',
          info: toast.type === 'info'
        }"
        (click)="toastService.removeToast(toast.id)"
      >
        <div class="toast-content">
          <p>{{ toast.message }}</p>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 300px;
      }

      .toast {
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slide-in 0.3s ease-out;
        cursor: pointer;
        transition: transform 0.2s;
      }

      .toast:hover {
        transform: translateY(-3px);
      }

      .toast-content {
        display: flex;
        align-items: center;
      }

      .toast-content p {
        margin: 0;
        font-size: 14px;
      }

      .success {
        background-color: green;
        color: #fff;
        border-left: 4px solid #ffb6c1;
      }

      .error {
        background-color: #ffe8e8;
        color: #7a6e6e;
        border-left: 4px solid #ff6b6b;
      }

      .info {
        background-color: #e8daff;
        color: #7a6e6e;
        border-left: 4px solid #9d7fff;
      }

      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ToastComponent {
  toastService = inject(ToastService);
}
