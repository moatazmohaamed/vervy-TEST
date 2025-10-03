import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  checkoutForm: FormGroup;
  orderPlaced = signal(false);

  constructor(public cartService: CartService, private router: Router, private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,12}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      // Generate a random order number
      const randomOrderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      this.router.navigate(['/allorders']);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.checkoutForm.controls).forEach((key) => {
        const control = this.checkoutForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }

  getErrorMessage(controlName: string): string {
    const control = this.checkoutForm.get(controlName);

    if (control?.hasError('required')) {
      return 'This field is required';
    }

    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Must be at least ${requiredLength} characters`;
    }

    if (control?.hasError('pattern')) {
      if (controlName === 'phone') {
        return 'Please enter a valid phone number (10-12 digits)';
      }
      if (controlName === 'zipCode') {
        return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
      }
    }

    return 'Invalid input';
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }
}
