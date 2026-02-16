import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LucideAngularModule, LayoutDashboard, Users, UserCheck, CreditCard, BookOpen, Settings, LogOut, ChevronDown, ChevronUp, GraduationCap, FileText, ClipboardList, Calendar, Bus, PhoneCall, MessageSquare } from 'lucide-angular';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './sidebar.html',
    styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
    readonly dashboardIcon = LayoutDashboard;
    readonly studentIcon = Users;
    readonly attendanceIcon = UserCheck;
    readonly feesIcon = CreditCard;
    readonly accountingIcon = BookOpen;
    readonly academicIcon = GraduationCap;
    readonly reportsIcon = FileText;
    readonly settingsIcon = Settings;
    readonly logoutIcon = LogOut;
    readonly downIcon = ChevronDown;
    readonly upIcon = ChevronUp;
    readonly examIcon = ClipboardList;
    readonly libraryIcon = BookOpen;
    readonly timetableIcon = Calendar;
    readonly transportIcon = Bus;
    readonly hrIcon = Users;
    readonly enquiryIcon = PhoneCall;
    readonly discussionIcon = MessageSquare;

    accountingExpanded = false;
    feesExpanded = false;

    menuItems = [
        { label: 'Dashboard', icon: this.dashboardIcon, route: '/dashboard' },
        { label: 'Students', icon: this.studentIcon, route: '/students' },
        { label: 'Exams', icon: this.examIcon, route: '/exams' },
        { label: 'Library', icon: this.libraryIcon, route: '/library' },
        { label: 'Time Table', icon: this.timetableIcon, route: '/timetable' },
        { label: 'Transport', icon: this.transportIcon, route: '/transport' },
        { label: 'HR', icon: this.hrIcon, route: '/hr' },
        { label: 'LMS', icon: this.libraryIcon, route: '/lms' },
        { label: 'Quizzes', icon: this.examIcon, route: '/lms/quizzes' },
        { label: 'Enquiry', icon: this.enquiryIcon, route: '/enquiry' },
        { label: 'Academic Masters', icon: this.academicIcon, route: '/academic' },
        { label: 'Reports & Certificates', icon: this.reportsIcon, route: '/reports' },
        { label: 'Discussion Forum', icon: this.discussionIcon, route: '/discussion' },
        { label: 'School Calendar', icon: this.timetableIcon, route: '/calendar' },
    ];

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    toggleAccounting() {
        this.accountingExpanded = !this.accountingExpanded;
        if (this.accountingExpanded) this.feesExpanded = false;
    }

    toggleFees() {
        this.feesExpanded = !this.feesExpanded;
        if (this.feesExpanded) this.accountingExpanded = false;
    }

    logout() {
        if (confirm('Are you sure you want to sign out?')) {
            this.authService.logout();
            this.router.navigate(['/login']);
        }
    }
}
