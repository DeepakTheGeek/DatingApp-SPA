import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;
  confirmPassword: AbstractControl;

  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createRegisterForm();
    this.username = this.registerForm.get('username');
    this.password = this.registerForm.get('password');
    this.confirmPassword = this.registerForm.get('confirmPassword');
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup) {
    return g.controls.password.value === g.controls.confirmPassword.value ? null : { mismatch: true };
  }
  register() {
    // this.authService.register(this.model).subscribe(
    //   () => {
    //     this.alertify.success('registration successful.');
    //   },
    //   (error) => {
    //     this.alertify.error(error);
    //   }
    // );
    console.log(this.registerForm.value);
  }

  cancel() {
    this.cancelRegister.emit(false);
    this.alertify.message('cancelled');
  }
}
