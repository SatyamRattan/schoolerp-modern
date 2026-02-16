import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExamsService, ExamType, AcademicYear } from '../../services/exams';
import { LucideAngularModule, Save, X } from 'lucide-angular';

@Component({
  selector: 'app-exam-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './exam-create.html',
  styleUrl: './exam-create.css'
})
export class ExamCreateComponent implements OnInit {
  examForm: FormGroup;
  examTypes: ExamType[] = [];
  academicYears: AcademicYear[] = [];
  loading = false;
  submitted = false;

  readonly Save = Save;
  readonly X = X;

  constructor(
    private fb: FormBuilder,
    private examsService: ExamsService,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      name: ['', Validators.required],
      exam_type: ['', Validators.required],
      academic_year: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadExamTypes();
    this.loadAcademicYears();
  }

  loadExamTypes(): void {
    this.examsService.getExamTypes().subscribe(data => {
      this.examTypes = data;
    });
  }

  loadAcademicYears(): void {
    this.examsService.getAcademicYears().subscribe(data => {
      this.academicYears = data;
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.examForm.invalid) {
      return;
    }

    this.loading = true;
    this.examsService.createExam(this.examForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        console.error('Error creating exam', err);
        this.loading = false;
      }
    });
  }
}
