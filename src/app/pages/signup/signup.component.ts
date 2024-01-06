import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public signupForm!: FormGroup;
  public errorMessage: { [key: string]: string } = {};
  public passwordVisible: boolean = false;
  public showPasswordIcon: string = 'fa-regular fa-eye';
  public confirmPasswordVisible: boolean = false;
  public showConfirmPasswordIcon: string = 'fa-regular fa-eye';

  constructor(
    private FormBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.FormBuilder.group(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,32}$'
          ),
        ]),
        confirmPassword: new FormControl('', Validators.required),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.showPasswordIcon = this.passwordVisible
      ? 'fa-regular fa-eye-slash'
      : 'fa-regular fa-eye';
  }

  toggleShowPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
    this.showConfirmPasswordIcon = this.showConfirmPasswordIcon
      ? 'fa-regular fa-eye-slash'
      : 'fa-regular fa-eye';
  }

  signUp() {
    if (this.signupForm.valid) {
      this.http
        .post<any>('http://localhost:3000/user', this.signupForm.value)
        .subscribe({
          next: (res) => {
            alert('Signup Successful');

            this.signupForm.reset();
            this.router.navigate(['login']);
          },
          error: (err) => {
            alert('Something went wrong');
          },
        });
    } else {
      const controls = this.signupForm.controls;
      for (const key in controls) {
        if (controls[key].errors) {
          for (const errorKey in controls[key].errors) {
            this.errorMessage[key] = this.getErrorMessage(key, errorKey);
          }
        }
      }
    }
  }
  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    return control.value.password === control.value.confirmPassword
      ? null
      : { mismatch: true };
  };

  getErrorMessage(key: string, errorKey: string): string {
    const errorMessages: { [key: string]: { [errorKey: string]: string } } = {
      email: {
        required: 'Email is required.',
        email: 'Please enter a valid email.',
      },
      password: {
        required: 'Password is required.',
        minlength: 'Password must be at least 8 characters long.',
        maxlength: 'Password cannot be more than 32 characters long.',
        pattern:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      },
      confirmPassword: {
        required: 'Confirm Password is required.',
        mismatch: 'Password and Confirm Password do not match.',
      },
    };

    return errorMessages[key][errorKey];
  }
}
