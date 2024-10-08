import { Routes } from '@angular/router';
import { EmployeeCodeComponent } from './pages/employee-code/employee-code.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
    //auth routes
    { path: '', component: EmployeeCodeComponent },
    { path: 'employee-code', component: EmployeeCodeComponent },    
    { path: '**', component: PageNotFoundComponent }
];
