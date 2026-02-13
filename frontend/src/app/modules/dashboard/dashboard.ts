import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, GraduationCap, DollarSign, CalendarCheck } from 'lucide-angular';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
    readonly studentIcon = Users;
    readonly staffIcon = GraduationCap;
    readonly feesIcon = DollarSign;
    readonly attendanceIcon = CalendarCheck;

    stats = [
        { label: 'Total Students', value: '1,240', change: '+12%', icon: this.studentIcon, color: 'primary' },
        { label: 'Total Staff', value: '84', change: '+2', icon: this.staffIcon, color: 'success' },
        { label: 'Monthly Revenue', value: '₹4.2L', change: '+8%', icon: this.feesIcon, color: 'warning' },
        { label: 'Avg Attendance', value: '94%', change: '-1%', icon: this.attendanceIcon, color: 'info' },
    ];

    recentActivities = [
        { type: 'Fees', message: 'Fees collected from Akshat Gupta', time: '10 mins ago' },
        { type: 'Attendance', message: 'Attendance marked for Class 10A', time: '25 mins ago' },
        { type: 'Student', message: 'New student admission: Rahul Sharma', time: '1 hour ago' },
        { type: 'Exam', message: 'Results published for Mid-Term Exams', time: '4 hours ago' },
    ];
}
