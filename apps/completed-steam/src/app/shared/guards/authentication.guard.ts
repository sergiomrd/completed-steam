import { EncryptService } from './../services/encrypt/encrypt.service';
import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class AuthorizatedGuard implements CanActivate {
  constructor(private router: Router, private encrypService: EncryptService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id: string = route.params["id"];
    const encrypted = this.encrypService.decrypt(id);
    if(id && id.includes('sample') || encrypted.length >= 17) {
        localStorage.setItem('id', id);
        return true;
    } else {
        this.router.navigate(['/login'])
    }

    return false;
  }
}
