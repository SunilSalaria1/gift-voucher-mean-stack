import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlSegment } from '@angular/router';


export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
   
  // Retrieve the logged-in user from localStorage
  const loggedUser = window.localStorage.getItem('loginUser');
  const token = localStorage.getItem('authToken')

  // If the user is logged in
  if (loggedUser != null) {
    const user = JSON.parse(loggedUser);
    const employeeRoutes = ['select-gift-voucher', 'reward-claimed'];
    const adminRoutes = [
      'select-gift-voucher', 'reward-claimed',
      'admin',
      'dashboard',
      'gift-inventory',
      'employee-picks',
      'product-reports',
      'settings',
      'add-gift-item',
    ];
    console.log("user...........0",user.role)

    // If the user is an employee
    if (user.role === 'employee') {
      // If the route is for employee pages, allow access
      if (
        route.url.some((segment: UrlSegment) =>
          employeeRoutes.includes(segment.path)
        )
      ) {
        return true; // Allow access to employee pages
      } else if (
        route.url.some((segment: UrlSegment) =>
          adminRoutes.includes(segment.path)
        )
      ) {
        // If it's an admin page, redirect to admin login
        router.navigateByUrl('admin-login-access');
        return false;
      }
    } else if (user.isAdmin === true) {
      // If the user is an admin
      // If the route is for admin pages, allow access
      if (
        route.url.some((segment: UrlSegment) =>
          adminRoutes.includes(segment.path)
        )
      ) {
        return true; // Allow access to admin pages
      } else if (
        route.url.some((segment: UrlSegment) =>
          employeeRoutes.includes(segment.path)
        )
      ) {
        // If it's an employee page, redirect to employee login
        router.navigateByUrl('employee-code');
        return false;
      }
    }

    return true;
  } else {
    router.navigateByUrl('employee-code');
    return false;
  }
};
