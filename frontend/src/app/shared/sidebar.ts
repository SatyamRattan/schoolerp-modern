import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Users, UserCheck, CreditCard, BookOpen, Settings, LogOut, ChevronDown, ChevronUp, GraduationCap, FileText } from 'lucide-angular';

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

    accountingExpanded = false;
    feesExpanded = false;

    menuItems = [
        { label: 'Dashboard', icon: this.dashboardIcon, route: '/dashboard' },
        { label: 'Students', icon: this.studentIcon, route: '/students' },
        { label: 'Academic Masters', icon: this.academicIcon, route: '/academic' },
        { label: 'Reports & Certificates', icon: this.reportsIcon, route: '/reports' },
    ];

    toggleAccounting() {
        this.accountingExpanded = !this.accountingExpanded;
        if (this.accountingExpanded) this.feesExpanded = false;
    }

    toggleFees() {
        this.feesExpanded = !this.feesExpanded;
        if (this.feesExpanded) this.accountingExpanded = false;
    }
}
