import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicService, Subject, Term, Assessment } from '../services/academic.service';

@Component({
    selector: 'app-academic-masters',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './academic-masters.component.html',
    styleUrls: ['./academic-masters.component.css']
})
export class AcademicMastersComponent implements OnInit {
    activeTab: 'subjects' | 'terms' | 'assessments' = 'subjects';

    // Subjects
    subjects: Subject[] = [];
    newSubject: Subject = { subject_name: '' };

    // Terms
    terms: Term[] = [];
    newTerm: Term = { term_name: '' };

    // Assessments
    assessments: Assessment[] = [];
    newAssessment: Assessment = { assessment_name: '' };

    loading = false;

    constructor(private academicService: AcademicService) { }

    ngOnInit() {
        this.loadAll();
    }

    loadAll() {
        this.loadSubjects();
        this.loadTerms();
        this.loadAssessments();
    }

    // Subject Methods
    loadSubjects() {
        this.loading = true;
        this.academicService.getSubjects().subscribe({
            next: (data) => {
                this.subjects = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading subjects:', err);
                this.loading = false;
            }
        });
    }

    addSubject() {
        if (!this.newSubject.subject_name.trim()) return;

        this.academicService.createSubject(this.newSubject).subscribe({
            next: () => {
                this.loadSubjects();
                this.newSubject = { subject_name: '' };
                alert('Subject added successfully');
            },
            error: (err) => {
                console.error('Error adding subject:', err);
                alert('Failed to add subject');
            }
        });
    }

    deleteSubject(id: number) {
        if (confirm('Delete this subject?')) {
            this.academicService.deleteSubject(id).subscribe({
                next: () => {
                    this.loadSubjects();
                    alert('Subject deleted');
                },
                error: (err) => {
                    console.error('Error deleting subject:', err);
                    alert('Failed to delete subject');
                }
            });
        }
    }

    // Term Methods
    loadTerms() {
        this.academicService.getTerms().subscribe({
            next: (data) => this.terms = data,
            error: (err) => console.error('Error loading terms:', err)
        });
    }

    addTerm() {
        if (!this.newTerm.term_name.trim()) return;

        this.academicService.createTerm(this.newTerm).subscribe({
            next: () => {
                this.loadTerms();
                this.newTerm = { term_name: '' };
                alert('Term added successfully');
            },
            error: (err) => {
                console.error('Error adding term:', err);
                alert('Failed to add term');
            }
        });
    }

    deleteTerm(id: number) {
        if (confirm('Delete this term?')) {
            this.academicService.deleteTerm(id).subscribe({
                next: () => {
                    this.loadTerms();
                    alert('Term deleted');
                },
                error: (err) => {
                    console.error('Error deleting term:', err);
                    alert('Failed to delete term');
                }
            });
        }
    }

    // Assessment Methods
    loadAssessments() {
        this.academicService.getAssessments().subscribe({
            next: (data) => this.assessments = data,
            error: (err) => console.error('Error loading assessments:', err)
        });
    }

    addAssessment() {
        if (!this.newAssessment.assessment_name.trim()) return;

        this.academicService.createAssessment(this.newAssessment).subscribe({
            next: () => {
                this.loadAssessments();
                this.newAssessment = { assessment_name: '' };
                alert('Assessment added successfully');
            },
            error: (err) => {
                console.error('Error adding assessment:', err);
                alert('Failed to add assessment');
            }
        });
    }

    deleteAssessment(id: number) {
        if (confirm('Delete this assessment?')) {
            this.academicService.deleteAssessment(id).subscribe({
                next: () => {
                    this.loadAssessments();
                    alert('Assessment deleted');
                },
                error: (err) => {
                    console.error('Error deleting assessment:', err);
                    alert('Failed to delete assessment');
                }
            });
        }
    }
}
