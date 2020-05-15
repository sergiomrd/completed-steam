import { UserService } from './../shared/services/user/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'completed-steam-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showLoginError: boolean;
  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.showLoginError = false;
  }

  login() {
    this.showLoginError = false;
    window.location.href = `${environment.API}api/auth/steam`;
  }

  goToMain() {
    this.router.navigate(['/main']);
  }
}
