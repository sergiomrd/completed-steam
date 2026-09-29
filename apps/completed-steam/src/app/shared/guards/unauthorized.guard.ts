import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UnauthorizedGuard implements CanActivate {
  private readonly router = inject(Router);

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const id = localStorage.getItem('id');
    if (id) {
      this.router.navigate(['/main', id]);
      return false;
    }
    return true;
  }
}
