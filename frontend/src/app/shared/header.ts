import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Bell, User, Calendar, ChevronDown, LogOut, UserCircle, Settings as SettingsIcon } from 'lucide-angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, RouterModule, FormsModule],
    templateUrl: './header.html',
    styleUrls: ['./header.css']
})
export class HeaderComponent {
    readonly Search = Search;
    readonly Bell = Bell;
    readonly User = User;
    readonly Calendar = Calendar;
    readonly ChevronDown = ChevronDown;
    readonly LogOut = LogOut;
    readonly UserCircle = UserCircle;
    readonly Settings = SettingsIcon;

    showProfileDropdown = false;
    showNotificationsDropdown = false;

    searchQuery = '';
    showSearchResults = false;

    searchItems = [
        { label: 'Dashboard', route: '/dashboard', category: 'General' },
        { label: 'Student Admissions', route: '/students/admission/apply', category: 'Students' },
        { label: 'Student List', route: '/students/admission/list', category: 'Students' },
        { label: 'Staff Management', route: '/hr/staff', category: 'HR' },
        { label: 'Employee Leaves', route: '/hr/leaves', category: 'HR' },
        { label: 'Fee Structures', route: '/fees/heads', category: 'Finance' },
        { label: 'Accounting Ledger', route: '/accounting/accounts', category: 'Finance' },
        { label: 'Journal Entries', route: '/accounting/journal', category: 'Finance' },
        { label: 'Attendance Marking', route: '/attendance/mark', category: 'Academic' },
        { label: 'Class Timetables', route: '/timetable/view', category: 'Academic' },
        { label: 'Exam Management', route: '/exams', category: 'Academic' },
        { label: 'Library Books', route: '/library/books', category: 'Resources' },
        { label: 'Transport Vehicles', route: '/transport/vehicles', category: 'Resources' },
        { label: 'Bulletin Board', route: '/notices', category: 'Communication' },
        { label: 'System Settings', route: '/settings', category: 'Admin' }
    ];

    get filteredSearchItems() {
        if (!this.searchQuery) return [];
        return this.searchItems.filter(item =>
            item.label.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(this.searchQuery.toLowerCase())
        ).slice(0, 5);
    }

    onSearchInput() {
        this.showSearchResults = this.searchQuery.length > 0;
    }

    navigateToResult(route: string) {
        this.router.navigate([route]);
        this.searchQuery = '';
        this.showSearchResults = false;
    }

    notifications = [
        { title: 'New Admission Request', time: '5 mins ago', type: 'info', icon: 'UserCircle' },
        { title: 'Fee Payment Received', time: '1 hour ago', type: 'success', icon: 'CreditCard' },
        { title: 'Exam Schedule Updated', time: '4 hours ago', type: 'warning', icon: 'Calendar' }
    ];

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    toggleNotificationsDropdown() {
        this.showNotificationsDropdown = !this.showNotificationsDropdown;
        if (this.showNotificationsDropdown) this.showProfileDropdown = false;
    }

    hideResults() {
        setTimeout(() => {
            this.showSearchResults = false;
        }, 200);
    }

    onCalendarClick() {
        this.router.navigate(['/calendar']);
    }

    toggleProfileDropdown() {
        this.showProfileDropdown = !this.showProfileDropdown;
        if (this.showProfileDropdown) this.showNotificationsDropdown = false;
    }

    logout() {
        if (confirm('Are you sure you want to sign out?')) {
            this.authService.logout();
            this.router.navigate(['/login']);
        }
    }
}
