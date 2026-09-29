import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { ManageSessionUseCase } from '../../use-cases';

@Injectable({
  providedIn: 'root'
})
export class AuthorizatedGuard implements CanActivate {
  private readonly router = inject(Router);
  private readonly sessionUseCase = inject(ManageSessionUseCase);

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const id: string = route.params['id'];
    const session = this.sessionUseCase.parseId(id);
    if (session) {
      this.sessionUseCase.saveSession(id);
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
