import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService)


    return authService.check().pipe(
        switchMap((authenticated) => {

            const permisssions = route.data['permissions'] as number[];
            const routeName = route.data['name'] as string;

            //check for authentication
            if (!authenticated) {
                router.navigate(['/sign-in'])
                return of(false)
            }
            //check for authorization
            if (!authService.checkPermission(permisssions)) {
                return of(false)
            }

            return of(true)
        })
    );
}