import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(private router: Router) {}

  canActivate: CanActivateFn = (route, state) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  };
}

export const authGuard: CanActivateFn = (route, state) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    return true;
  } else {
    const router = (route as any).injector?.get(Router);
    if (router) {
      router.navigate(['/login']);
    }
    return false;
  }
};
