import { Component, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    @if (message) {
      <div class="error-message">
        <span>{{ message }}</span>
        <button (click)="dismiss()" class="dismiss-btn">&times;</button>
      </div>
    }
  `,
  styles: [`
    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dismiss-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #721c24;
    }
  `]
})
export class ErrorMessage {
  @Input() message: string | null = null;
  @Output() dismissed = new EventEmitter<void>();
  dismiss() {
    this.message = null;
  }
}