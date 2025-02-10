import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UsersService } from '../services/users.service';

export const authorisationInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UsersService); // Inject UsersService
  const token = userService.getToken(); // Retrieve token

  // If token exists, clone the request and attach Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Proceed with original request if no token is found
  return next(req);
};
