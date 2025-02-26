import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authorisationInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const userService = inject(UsersService);
  const router = inject(Router);
  const token = userService.getToken(); // Retrieve token

  // Clone request and add Authorization header if token exists
  const clonedRequest = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(clonedRequest).pipe(
    tap({
      error: (error) => {        
        if (error.status === 401) {
          userService.logout(); // Clear token and user data
          router.navigate(['/home']); // Redirect to home page
          snackBar.open('Session expired. Please log in again.', 'close', {
            duration: 5000,
            panelClass: ['snackbar-success'],
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        }
      }
    })
  );
};
