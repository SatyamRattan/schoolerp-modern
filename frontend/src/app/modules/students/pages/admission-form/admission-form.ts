import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentsService } from '../../services/students';

@Component({
    selector: 'app-admission-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admission-form.html'
})
export class AdmissionFormComponent implements OnInit {
    student: any = {
        student_first_name: '',
        student_last_name: '',
        student_dob: '',
        gender: '',
        student_class: '',
        student_section: '',
        fathers_first_name: '',
        f_mobile: '',
        mothers_first_name: '',
        m_mobile: '',
        house_no: '',
        street_name: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'India',
        caste: '',
        category: '',
        house: '',
        year: new Date().toISOString().split('T')[0], // Default today
        admission_form_no: Math.floor(Math.random() * 10000) // Temp random
    };

    classes: any[] = [];
    sections: any[] = [];
    castes: any[] = [];
    categories: any[] = [];
    houses: any[] = [];

    constructor(private studentsService: StudentsService, private router: Router) { }

    ngOnInit(): void {
        this.loadMetadata();
    }

    loadMetadata() {
        this.studentsService.getClasses().subscribe(data => this.classes = data);
        this.studentsService.getSections().subscribe(data => this.sections = data);
        this.studentsService.getCastes().subscribe(data => this.castes = data);
        this.studentsService.getCategories().subscribe(data => this.categories = data);
        this.studentsService.getHouses().subscribe(data => this.houses = data);
    }

    onSubmit() {
        this.studentsService.createAdmission(this.student).subscribe({
            next: () => {
                alert('Application submitted successfully!');
                this.router.navigate(['/']); // Redirect to home or dashboard
            },
            error: (err) => {
                console.error('Submission failed', err);
                alert('Failed to submit application. Please check all fields.');
            }
        });
    }
}
