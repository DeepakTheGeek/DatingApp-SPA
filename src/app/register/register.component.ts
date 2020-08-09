import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

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

  constructor(private authService: AuthService, private alertify: AlertifyService) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
      confirmPassword: new FormControl('', Validators.required)
    }, this.passwordMatchValidator);
    this.username = this.registerForm.get('username');
    this.password = this.registerForm.get('password');
    this.confirmPassword = this.registerForm.get('confirmPassword');
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
