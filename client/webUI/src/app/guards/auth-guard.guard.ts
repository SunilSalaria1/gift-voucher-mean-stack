import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
const router = inject(Router)
// employee
  const loggedUser = localStorage.getItem('loginUser')
  if(loggedUser!=null){
    return true;
  }else{
router.navigateByUrl('employee-code');
return false;
  }
}