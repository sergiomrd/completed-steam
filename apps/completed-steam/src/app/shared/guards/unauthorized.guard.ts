import { EncryptService } from './../services/encrypt/encrypt.service';
import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class UnauthorizedGuard implements CanActivate {
  constructor(private router: Router, private encryptService: EncryptService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = localStorage.getItem('id');

    if(id) {
        this.router.navigate(['/main', localStorage.getItem('id')])
        return false;
    }

    return true;
  }
}
