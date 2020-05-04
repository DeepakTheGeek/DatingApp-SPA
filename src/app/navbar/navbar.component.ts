import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  model: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  Login() {
    this.authService.login(this.model).subscribe(
      (next) => {
        console.log('logged in successfully.');
      },
      (error) => {
        console.log('login failed');
      }
    );
  }
}
