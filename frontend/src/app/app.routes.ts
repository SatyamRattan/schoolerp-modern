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
import { CertificatesComponent } from './modules/reports/components/certificates/certificates.component';
import { ExamListComponent } from './modules/exams/pages/exam-list/exam-list';
import { ExamCreateComponent } from './modules/exams/pages/exam-create/exam-create';
import { ExamScheduleComponent } from './modules/exams/pages/exam-schedule/exam-schedule';
import { MarksEntryComponent } from './modules/exams/pages/marks-entry/marks-entry';
import { AdmissionFormComponent } from './modules/students/pages/admission-form/admission-form';
import { AdmissionListComponent } from './modules/students/pages/admission-list/admission-list';
import { BookListComponent } from './modules/library/pages/book-list/book-list';
import { IssueReturnComponent } from './modules/library/pages/issue-return/issue-return';
import { TimeTableViewComponent } from './modules/timetable/pages/timetable-view/timetable-view.component';
import { TimeTableManageComponent } from './modules/timetable/pages/timetable-manage/timetable-manage.component';
import { VehicleListComponent } from './modules/transport/pages/vehicle-list/vehicle-list.component';
import { RouteManagerComponent } from './modules/transport/pages/route-manager/route-manager.component';
import { TransportAllocationComponent } from './modules/transport/pages/transport-allocation/transport-allocation.component';
import { StaffListComponent } from './modules/hr/pages/staff-list/staff-list.component';
import { LeaveManagerComponent } from './modules/hr/pages/leave-manager/leave-manager.component';
import { EnquiryListComponent } from './modules/enquiry/pages/enquiry-list/enquiry-list.component';
import { SettingsViewComponent } from './modules/settings/pages/settings-view/settings-view';
import { NoticesListComponent } from './modules/notices/pages/notices-list/notices-list';

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
        canActivate: [authGuard],
        children: [
            { path: 'financial', component: FinancialReportsComponent },
            { path: 'certificates', component: CertificatesComponent },
            { path: '', redirectTo: 'certificates', pathMatch: 'full' }
        ]
    },
    {
        path: 'exams',
        canActivate: [authGuard],
        children: [
            { path: '', component: ExamListComponent },
            { path: 'create', component: ExamCreateComponent },
            { path: 'schedule/:id', component: ExamScheduleComponent },
            { path: 'marks/:id', component: MarksEntryComponent }
        ]
    },
    {
        path: 'students',
        canActivate: [authGuard],
        children: [
            { path: 'admission/apply', component: AdmissionFormComponent },
            { path: 'admission/list', component: AdmissionListComponent },
            { path: '', redirectTo: 'admission/list', pathMatch: 'full' }
        ]
    },
    {
        path: 'library',
        canActivate: [authGuard],
        children: [
            { path: 'books', component: BookListComponent },
            { path: 'circulation', component: IssueReturnComponent },
            { path: '', redirectTo: 'books', pathMatch: 'full' }
        ]
    },
    {
        path: 'timetable',
        canActivate: [authGuard],
        children: [
            { path: 'view', component: TimeTableViewComponent },
            { path: 'manage', component: TimeTableManageComponent },
            { path: '', redirectTo: 'view', pathMatch: 'full' }
        ]
    },
    {
        path: 'transport',
        canActivate: [authGuard],
        children: [
            { path: 'vehicles', component: VehicleListComponent },
            { path: 'routes', component: RouteManagerComponent },
            { path: 'allocation', component: TransportAllocationComponent },
            { path: '', redirectTo: 'routes', pathMatch: 'full' }
        ]
    },
    {
        path: 'hr',
        canActivate: [authGuard],
        children: [
            { path: 'staff', component: StaffListComponent },
            { path: 'leaves', component: LeaveManagerComponent },
            { path: '', redirectTo: 'staff', pathMatch: 'full' }
        ]
    },
    {
        path: 'lms',
        canActivate: [authGuard],
        loadChildren: () => import('./modules/lms/lms.routes').then(m => m.LmsRoutes)
    },
    {
        path: 'enquiry',
        canActivate: [authGuard],
        children: [
            { path: 'list', component: EnquiryListComponent },
            { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
    },
    {
        path: 'discussion',
        canActivate: [authGuard],
        loadChildren: () => import('./modules/discussion/discussion.module').then(m => m.DiscussionModule)
    },
    {
        path: 'calendar',
        canActivate: [authGuard],
        loadChildren: () => import('./modules/calendar/calendar-module').then(m => m.CalendarModule)
    },
    {
        path: 'settings',
        component: SettingsViewComponent,
        canActivate: [authGuard]
    },
    {
        path: 'notices',
        component: NoticesListComponent,
        canActivate: [authGuard]
    },
];
