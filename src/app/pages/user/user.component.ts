import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminUser } from 'src/app/auth/interfaces/admin-user';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  userForm!: FormGroup;
  listAdminUser: AdminUser[] = [];
  isAction: boolean = false;
  type = 'add';
  visible: boolean = false;
  errorMessage: { [key: string]: string } = {};
  passwordVisible: boolean = false;
  showPasswordIcon: string = 'fa-regular fa-eye';
  userChoose: any;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private http: HttpClient,
    private FormBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getListUsers();
    this.userForm = this.FormBuilder.group(
      {
        fullName: new FormControl('', Validators.required),
        userName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,32}$'
          ),
        ]),
        phoneNumber: new FormControl('', [Validators.required]),
        // address: new FormControl(''),
      }
      // { validators: this.passwordMatchValidator }
    );
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.showPasswordIcon = this.passwordVisible
      ? 'fa-regular fa-eye-slash'
      : 'fa-regular fa-eye';
  }

  // toggleShowPasswordVisibility() {
  //   this.confirmPasswordVisible = !this.confirmPasswordVisible;
  //   this.showConfirmPasswordIcon = this.showConfirmPasswordIcon
  //     ? 'fa-regular fa-eye-slash'
  //     : 'fa-regular fa-eye';
  // }

  getListUsers() {
    this.userService.getListUsers().subscribe({
      next: (data) => {
        if (data) {
          console.log({ data });
          this.listAdminUser = data;
        }
      },
    });
  }

  toggleAction() {
    this.isAction = !this.isAction;
  }

  removeUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: (data) => {
        this.toastr.success('Delete User Success');
        this.getListUsers();
      },
      error: (error) => {
        this.toastr.warning('Some thing went wrong');
      },
    });
  }

  handleForm() {
    if (this.type === 'add') {
      this.addUser();
    } else if (this.type === 'edit') {
      this.editUser();
    }
  }

  addUser() {
    if (this.userForm.valid) {
      this.http
        .post<any>('http://localhost:3000/user', this.userForm.value)
        .subscribe({
          next: (res) => {
            this.toastr.success('Create User Success');
            this.userForm.reset();
            this.visible = false;
            this.errorMessage = {};
            this.getListUsers();
          },
          error: (err) => {
            alert('Something went wrong');
          },
        });
    } else {
      const controls = this.userForm.controls;
      for (const key in controls) {
        if (controls[key].errors) {
          for (const errorKey in controls[key].errors) {
            this.errorMessage[key] = this.getErrorMessage(key, errorKey);
          }
        }
      }
    }
  }

  editUser() {
    if (this.userForm.valid) {
      this.http;
      this.userService
        .updateUser(this.userForm.value, this.userChoose.id)
        .subscribe({
          next: (res) => {
            this.toastr.success('Update User Success');
            this.userForm.reset();
            this.errorMessage = {};
            this.visible = false;
            this.getListUsers();
          },
          error: (err) => {
            alert('Something went wrong');
          },
        });
    } else {
      const controls = this.userForm.controls;
      for (const key in controls) {
        if (controls[key].errors) {
          for (const errorKey in controls[key].errors) {
            this.errorMessage[key] = this.getErrorMessage(key, errorKey);
          }
        }
      }
    }
  }

  handleEditUser(userItem: any) {
    this.userChoose = userItem;
    this.userForm.patchValue({
      fullName: userItem.fullName,
      userName: userItem.userName,
      email: userItem.email,
      password: userItem.password,
      phoneNumber: userItem.phoneNumber,
      // address: userItem.address,
    });
    this.showDialog();
    this.type = 'edit';
  }

  getErrorMessage(key: string, errorKey: string): string {
    console.log(key);
    const errorMessages: { [key: string]: { [errorKey: string]: string } } = {
      fullName: {
        required: 'Full name is required.',
      },
      userName: {
        required: 'User name is required.',
      },
      phoneNumber: {
        required: 'Phone number is required.',
        // pattern: 'Phone number is invalid',
      },
      address: {
        required: 'Address is required.',
      },
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
    };

    return errorMessages[key][errorKey];
  }

  createUser() {
    this.showDialog();
    this.type = 'add';
  }

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.userForm.reset();
  }
}
