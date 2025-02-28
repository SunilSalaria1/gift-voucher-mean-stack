import { Routes } from '@angular/router';
import { EmployeeCodeComponent } from './pages/auth/employee-code/employee-code.component';
import { AdminLoginAccessComponent } from './pages/auth/admin-login-access/admin-login-access.component';
import { SelectGiftVoucherComponent } from './pages/employee/select-gift-voucher/select-gift-voucher.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { AddGiftItemComponent } from './pages/admin/add-gift-item/add-gift-item.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { GiftInventoryComponent } from './pages/admin/gift-inventory/gift-inventory.component';
import { EmployeePicksComponent } from './pages/admin/employee-picks/employee-picks.component';
import { SettingsComponent } from './pages/admin/settings/settings.component';
import { PageNotFoundComponent } from './pages/error/page-not-found/page-not-found.component';
import { RewardClaimedComponent } from './pages/employee/reward-claimed/reward-claimed.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { EditGiftItemComponent } from './pages/admin/edit-gift-item/edit-gift-item.component';
import {GenerateEmpCodeComponent} from './pages/admin/generate-emp-code/generate-emp-code.component';
import { AddEmpCodeComponent } from './pages/admin/add-emp-code/add-emp-code.component';
import { EditEmpCodeComponent } from './pages/admin/edit-emp-code/edit-emp-code.component';
import { FeedbackComponent } from './pages/admin/feedback/feedback.component';
import { SelectedGiftDetailsComponent } from './pages/employee/selected-gift-details/selected-gift-details.component';
import { EventsComponent } from './pages/admin/events/events.component';
import { AddEventComponent } from './pages/admin/add-event/add-event.component';

export const routes: Routes = [
    //auth routes
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'employee-code', component: EmployeeCodeComponent },
    { path: 'admin-login-access', component: AdminLoginAccessComponent },
    { path: 'select-gift-voucher', component: SelectGiftVoucherComponent,canActivate:[authGuardGuard ]},
    { path: 'reward-claimed', component: RewardClaimedComponent,canActivate:[authGuardGuard ] },
    { path: 'selected-gift-details', component: SelectedGiftDetailsComponent,canActivate:[authGuardGuard ] },


    { path: 'admin', component: AdminDashboardComponent,canActivate:[authGuardGuard ],
        children: [
            { path: 'dashboard', component: DashboardComponent},
            { path: 'gift-inventory', component: GiftInventoryComponent },
            { path: 'employee-picks', component: EmployeePicksComponent },
            { path: 'feedback', component: FeedbackComponent},
            { path: 'settings', component: SettingsComponent },
            { path: 'add-gift-item', component: AddGiftItemComponent },
            { path: 'edit-gift-item/:id', component: EditGiftItemComponent },
            { path: 'generate-emp-code', component: GenerateEmpCodeComponent },
            { path: 'add-emp-code', component: AddEmpCodeComponent },
            { path: 'edit-emp-code/:id', component:EditEmpCodeComponent },            
            { path: 'events', component:EventsComponent },
            { path: 'add-event', component:AddEventComponent },

        ]
     },
    { path: '**', component: PageNotFoundComponent }
];
