import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard';
import { LoginComponent } from './modules/auth/login';
import { authGuard } from './services/auth.guard';
import { AccountListComponent } from './modules/accounting/pages/account-list';
import { JournalListComponent } from './modules/accounting/pages/journal-list';
import { FeesListComponent } from './modules/fees/pages/fees-list';
import { AttendanceMarkComponent } from './modules/attendance/pages/attendance-mark';
import { AcademicMastersComponent } from './modules/academic-masters/components/academic-masters.component';
import { FinancialReportsComponent } from './modules/reports/components/financial-reports.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'accounting',
        canActivate: [authGuard],
        children: [
            { path: 'accounts', component: AccountListComponent },
            { path: 'journal', component: JournalListComponent },
            { path: '', redirectTo: 'accounts', pathMatch: 'full' }
        ]
    },
    {
        path: 'fees',
        canActivate: [authGuard],
        children: [
            { path: 'heads', component: FeesListComponent },
            { path: '', redirectTo: 'heads', pathMatch: 'full' }
        ]
    },
    {
        path: 'attendance',
        canActivate: [authGuard],
        children: [
            { path: 'mark', component: AttendanceMarkComponent },
            { path: '', redirectTo: 'mark', pathMatch: 'full' }
        ]
    },
    {
        path: 'academic',
        component: AcademicMastersComponent,
        canActivate: [authGuard]
    },
    {
        path: 'reports',
        component: FinancialReportsComponent,
        canActivate: [authGuard]
    },
];
