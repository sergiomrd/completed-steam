import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'completed-steam-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private readonly router = inject(Router);
  showLoginError: boolean = false;

  ngOnInit(): void {
    this.showLoginError = false;
  }

  login(): void {
    this.showLoginError = false;
    window.location.href = `${environment.API}api/auth/steam`;
  }

  goToMain(): void {
    this.router.navigate(['/main']);
  }

  goToSample(): void {
    this.router.navigate(['/main', 'sample']);
  }
}
