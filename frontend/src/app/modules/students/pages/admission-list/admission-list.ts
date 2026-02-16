import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentsService, Student } from '../../services/students';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
    selector: 'app-admission-list',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './admission-list.html'
})
export class AdmissionListComponent implements OnInit {
    admissions: Student[] = [];
    loading = true;
    readonly searchIcon = Search;

    constructor(private studentsService: StudentsService) { }

    ngOnInit(): void {
        this.loadAdmissions();
    }

    loadAdmissions() {
        this.loading = true;
        this.studentsService.getAdmissions().subscribe({
            next: (data) => {
                this.admissions = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading admissions', err);
                this.loading = false;
            }
        });
    }

    getPendingCount() {
        return this.admissions.filter(a => a.status_adm === 'Pending').length;
    }

    getApprovedCount() {
        return this.admissions.filter(a => a.status_adm === 'Approved').length;
    }

    approve(id: number) {
        if (confirm(`Approve this admission?`)) {
            this.studentsService.approveAdmission(id).subscribe({
                next: () => {
                    alert('Admission approved successfully!');
                    this.loadAdmissions();
                },
                error: (err) => {
                    console.error('Error approving', err);
                    alert('Approval failed.');
                }
            });
        }
    }
}
