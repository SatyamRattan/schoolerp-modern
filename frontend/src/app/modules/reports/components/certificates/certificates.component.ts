import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';
import { StudentsService, Student } from '../../../students/services/students';
import { LucideAngularModule, FileText, Download } from 'lucide-angular';

@Component({
    selector: 'app-certificates',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './certificates.html',
    styleUrls: ['./certificates.css']
})
export class CertificatesComponent implements OnInit {
    students: Student[] = [];
    filteredStudents: Student[] = [];
    searchTerm: string = '';
    loading = false;

    readonly fileIcon = FileText;
    readonly downloadIcon = Download;

    constructor(
        private reportsService: ReportsService,
        private studentsService: StudentsService
    ) { }

    ngOnInit() {
        this.loadStudents();
    }

    loadStudents() {
        this.loading = true;
        this.studentsService.getAdmissions().subscribe({
            next: (data) => {
                this.students = data;
                this.filteredStudents = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading students:', err);
                this.loading = false;
            }
        });
    }

    filterStudents() {
        if (!this.searchTerm) {
            this.filteredStudents = this.students;
            return;
        }
        const term = this.searchTerm.toLowerCase();
        this.filteredStudents = this.students.filter(student =>
            (student.student_first_name + ' ' + student.student_last_name).toLowerCase().includes(term) ||
            student.admission_no?.toString().includes(term) ||
            student.student_class?.toLowerCase().includes(term)
        );
    }

    downloadCertificate(student: Student, type: string) {
        if (!student.id) return;

        this.reportsService.downloadCertificate(student.id, type).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${type}_certificate_${student.admission_no || student.id}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Download failed', err);
                alert('Failed to download certificate. Please try again.');
            }
        });
    }
}
