import { Routes } from '@angular/router';
import { EmployeeCodeComponent } from './pages/employee-code/employee-code.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AdminLoginAccessComponent } from './pages/admin-login-access/admin-login-access.component';
import { SelectGiftVoucherComponent } from './pages/select-gift-voucher/select-gift-voucher.component';

export const routes: Routes = [
    //auth routes
    { path: '', component: EmployeeCodeComponent },
    { path: 'employee-code', component: EmployeeCodeComponent },  
    { path: 'admin-login-access', component: AdminLoginAccessComponent }, 
    { path: 'select-gift-voucher', component: SelectGiftVoucherComponent }, 
    { path: '**', component: PageNotFoundComponent }
];
