import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  contactForm: FormGroup;
  formSubmitted = signal(false);
  formSuccess = signal(false);
  router = inject(Router);
  // Contact information
  contactInfo = {
    phone: '01002338226',
    whatsapp: '01002338226',
    email: 'contact@vervy.com',
  };

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    this.formSubmitted.set(true);

    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      this.formSuccess.set(true);

      setTimeout(() => {
        this.contactForm.reset();
        this.formSubmitted.set(false);
        this.formSuccess.set(false);
        this.router.navigate(['/']);
      }, 3000);
    }
  }

  // Helper methods for form validation
  hasError(controlName: string, errorName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!(
      control &&
      control.hasError(errorName) &&
      (control.dirty || control.touched || this.formSubmitted())
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);

    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('minlength')) {
      return `Minimum length is ${control.getError('minlength').requiredLength} characters`;
    }

    if (control.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }

    return '';
  }
}
