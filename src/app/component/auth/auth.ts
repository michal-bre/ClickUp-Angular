import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // ייבוא חדש


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLoginMode = true; // משתנה למעבר בין מצב התחברות להרשמה
  errorMessage: string = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    // הגדרת השדות בטופס עם ולידציה בסיסית
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: [''] // שדה שם נדרש רק בהרשמה
    });
  }
  ngOnInit() {
    this.route.url.subscribe(() => {
      this.isLoginMode = this.router.url.includes('login');
    });
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const data = this.authForm.value;
    this.isLoading = true;
    this.errorMessage = '';

    if (this.isLoginMode) {
      // קריאת התחברות
      this.authService.login(data).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/teams']); // מעבר למסך צוותים לאחר הצלחה
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || err.error?.message || 'Login failed';
        }
      });
    } else {
      // קריאת הרשמה 
      this.authService.register(data).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/teams']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || err.error?.message || 'Registration failed';
        }
      });
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}