import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class AuthorizatedGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params["id"];

    if(id) {
        localStorage.setItem('id', id);
        return true;
    } else {
        this.router.navigate(['/login'])
    }

    return false;
  }
}
