import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../services/attendance.service';
import { StudentsService } from '../../students/services/students';
import { LucideAngularModule, Search, CalendarCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-attendance-mark',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    templateUrl: './attendance-mark.html',
    styleUrls: ['./attendance-mark.css']
})
export class AttendanceMarkComponent implements OnInit {
    students: any[] = [];
    classes: any[] = [];
    sections: any[] = [];

    selectedClass: any = null;
    selectedSection: any = null;
    attendanceDate = new Date().toISOString().split('T')[0];

    readonly searchIcon = Search;
    readonly attendanceIcon = CalendarCheck;

    constructor(
        private attendanceService: AttendanceService,
        private studentsService: StudentsService
    ) { }

    ngOnInit(): void {
        this.studentsService.getClasses().subscribe(data => this.classes = data);
        this.studentsService.getSections().subscribe(data => this.sections = data);
    }

    loadStudents() {
        if (!this.selectedClass) return;
        this.studentsService.getStudents(this.selectedClass, this.selectedSection).subscribe(data => {
            this.students = data.map(s => ({
                ...s,
                status: 'PRESENT',
                remarks: ''
            }));
        });
    }

    getStats() {
        return {
            present: this.students.filter(s => s.status === 'PRESENT').length,
            absent: this.students.filter(s => s.status === 'ABSENT').length
        };
    }

    saveAttendance() {
        alert('Attendance for ' + this.students.length + ' students saved successfully!');
    }
}
