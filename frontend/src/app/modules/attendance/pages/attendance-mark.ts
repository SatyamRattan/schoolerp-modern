import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../services/attendance.service';
import { LucideAngularModule, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-attendance-mark',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    templateUrl: './attendance-mark.html',
    styleUrls: ['./attendance-mark.css']
})
export class AttendanceMarkComponent implements OnInit {
    students = [
        { id: 1, name: 'Akshat Gupta', roll: '101', status: 'P' },
        { id: 2, name: 'Rahul Sharma', roll: '102', status: 'P' },
        { id: 3, name: 'Sneha Jain', roll: '103', status: 'A' },
        { id: 4, name: 'Priya Singh', roll: '104', status: 'P' },
        { id: 5, name: 'Amit Kumar', roll: '105', status: 'L' },
    ];

    selectedClass = '10';
    selectedSection = 'A';
    selectedDate = new Date().toISOString().split('T')[0];

    readonly searchIcon = Search;
    readonly presentIcon = CheckCircle;
    readonly absentIcon = XCircle;
    readonly leaveIcon = AlertCircle;

    constructor(private attendanceService: AttendanceService) { }

    ngOnInit(): void { }

    setStatus(studentId: number, status: string) {
        const student = this.students.find(s => s.id === studentId);
        if (student) student.status = status;
    }

    saveAttendance() {
        alert('Attendance saved successfully!');
    }
}
