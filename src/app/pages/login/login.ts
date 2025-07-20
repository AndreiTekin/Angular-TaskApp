import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorMessage } from '../../components/error-message/error-message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ErrorMessage],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login to Task Manager</h2>
        
        <app-error-message [message]="errorMessage"></app-error-message>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              placeholder="Enter your email"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <div class="field-error">Valid email is required</div>
            }
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              placeholder="Enter your password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <div class="field-error">Password is required</div>
            }
          </div>
          
          <button 
            type="submit" 
            [disabled]="loginForm.invalid || loading"
            class="auth-button">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        
        <p class="auth-link">
          Don't have an account? <a routerLink="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  `,
	styleUrls: ['./login.css']
  
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}