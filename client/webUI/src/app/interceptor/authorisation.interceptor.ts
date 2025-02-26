import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { tap } from 'rxjs/operators';

export const authorisationInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UsersService);
  const router = inject(Router);
  const token = userService.getToken(); // Retrieve token

  // Clone request and add Authorization header if token exists
  const clonedRequest = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(clonedRequest).pipe(
    tap({
      error: (error) => {
        console.log('@@@@@')
        if (error.status === 401) {
          userService.logout(); // Clear token and user data
          router.navigate(['/home']); // Redirect to home page
        }
      }
    })
  );
};
