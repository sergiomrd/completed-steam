import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'completed-steam-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showLoginError: boolean;
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.showLoginError = false;
    let id = localStorage.getItem('id');
    if(!id) {

    } else {
      this.goToMain();
    }
  }

  login(){
    this.http.get(`${environment.API}api/auth/profile`).subscribe((response) => {
      if(response) {
        localStorage.setItem('id', response['id']);
        this.goToMain();
      }
    }, (error: HttpErrorResponse) => {
      this.showLoginError = true;
    });

    this.showLoginError = false;
    window.location.href = `${environment.API}api/auth/steam`;
  }

  goToMain() {
    this.router.navigate(['/main']);
  }

}
