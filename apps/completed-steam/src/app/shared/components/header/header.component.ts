import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PlayerSummaries } from '@completed-steam/api-interfaces';
import { UserStore } from '../../../stores';
import { UserService } from '../../services/user/user.service';
import { DeviceDetectionUtil } from '../../utils/device-detection.util';

@Component({
  selector: 'completed-steam-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  isMobile = false;

  get userInfo(): PlayerSummaries | null {
    const profile = this.userStore.profile();
    if (profile) {
      this.userService.userInfo = profile;
    }
    return profile;
  }

  constructor() {
    DeviceDetectionUtil.isMobile.subscribe((value: boolean) => (this.isMobile = value));
  }

  async ngOnInit(): Promise<void> {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      this.userStore.initSession(storedId);
      await this.userStore.loadProfile();
    }
  }

  goToProfile(): void {
    const url = this.userStore.profileUrl();
    if (url) {
      window.open(url, '_blank');
    }
  }

  logout(): void {
    this.userStore.logout();
    this.userService.userInfo = null;
    this.router.navigate(['/login']);
  }
}
