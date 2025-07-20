import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorMessage } from '../../components/error-message/error-message';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ErrorMessage],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Sign Up for Task Manager</h2>
        
        <app-error-message [message]="errorMessage"></app-error-message>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name (Optional)</label>
            <input 
              id="name" 
              type="text" 
              formControlName="name"
              placeholder="Enter your name">
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              placeholder="Enter your email"
              [class.error]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched">
            @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched) {
              <div class="field-error">Valid email is required</div>
            }
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              placeholder="Enter your password (min 6 characters)"
              [class.error]="signupForm.get('password')?.invalid && signupForm.get('password')?.touched">
            @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched) {
              <div class="field-error">Password must be at least 6 characters</div>
            }
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword" 
              type="password" 
              formControlName="confirmPassword"
              placeholder="Confirm your password"
              [class.error]="signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched">
            @if (signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched) {
              <div class="field-error">Passwords must match</div>
            }
          </div>
          
          <button 
            type="submit" 
            [disabled]="signupForm.invalid || loading"
            class="auth-button">
            {{ loading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>
        
        <p class="auth-link">
          Already have an account? <a routerLink="/login">Login here</a>
        </p>
      </div>
    </div>
  `,
	styleUrls: ['./signup.css']
  
})
export class Signup {
  signupForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true;
      this.errorMessage = null;

      const { confirmPassword, ...signupData } = this.signupForm.value;

      this.authService.signup(signupData).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
        }
      });
    }
  }
}