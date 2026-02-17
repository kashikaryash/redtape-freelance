import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.user()) {
        return true;
    }

    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.user();
    if (user && (['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(user.role) ||
        (user.roles && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MODERATOR') || user.roles.includes('ROLE_SUPER_ADMIN'))))) {
        return true;
    }

    router.navigate(['/']);
    return false;
};

export const superAdminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.user();
    if (user && (user.role === 'SUPER_ADMIN' || (user.roles && user.roles.includes('ROLE_SUPER_ADMIN')))) {
        return true;
    }

    router.navigate(['/']);
    return false;
};
