import { Routes } from '@angular/router';
import { EmployeeCodeComponent } from './pages/auth/employee-code/employee-code.component';
import { AdminLoginAccessComponent } from './pages/auth/admin-login-access/admin-login-access.component';
import { SelectGiftVoucherComponent } from './pages/employee/select-gift-voucher/select-gift-voucher.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { AddGiftItemComponent } from './pages/admin/add-gift-item/add-gift-item.component';
import { PageNotFoundComponent } from './pages/error/page-not-found/page-not-found.component';

export const routes: Routes = [
    //auth routes
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'employee-code', component: EmployeeCodeComponent },  
    { path: 'admin-login-access', component: AdminLoginAccessComponent }, 
    { path: 'select-gift-voucher', component: SelectGiftVoucherComponent }, 
    { path: 'dashboard', component: AdminDashboardComponent }, 
    { path : 'add-gift-item', component: AddGiftItemComponent},
    { path: '**', component: PageNotFoundComponent }
];
