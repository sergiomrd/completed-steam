import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class UnauthorizedGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = localStorage.getItem('id');

    if(id) {
        this.router.navigate(['/main', id])
        return false;
    }

    return true;
  }
}
