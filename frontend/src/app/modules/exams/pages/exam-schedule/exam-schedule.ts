import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExamsService, ExamSchedule, Exam } from '../../services/exams';
import { StudentsService } from '../../../students/services/students';
import { LucideAngularModule, Save, X, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-exam-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './exam-schedule.html',
  styleUrl: './exam-schedule.css'
})
export class ExamScheduleComponent implements OnInit {
  scheduleForm: FormGroup;
  schedules: ExamSchedule[] = [];
  subjects: any[] = []; // TODO: Add Subject interface/service
  sections: any[] = []; // TODO: Add Section interface/service
  examId: number | null = null;
  loading = false;

  readonly Save = Save;
  readonly X = X;
  readonly Trash2 = Trash2;

  constructor(
    private fb: FormBuilder,
    private examsService: ExamsService,
    private studentsService: StudentsService,
    private route: ActivatedRoute
  ) {
    this.scheduleForm = this.fb.group({
      subject: ['', Validators.required],
      section: ['', Validators.required],
      date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      max_marks: [100, Validators.required],
      passing_marks: [33, Validators.required],
      room_no: ['']
    });
  }

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.examId) {
      this.loadSchedules();
    }
    this.studentsService.getSubjects().subscribe(data => this.subjects = data);
    this.studentsService.getSections().subscribe(data => this.sections = data);
  }

  loadSchedules(): void {
    if (!this.examId) return;
    this.examsService.getExamSchedules(this.examId).subscribe(data => {
      this.schedules = data;
    });
  }

  onSubmit(): void {
    if (this.scheduleForm.invalid || !this.examId) return;

    const schedule: ExamSchedule = {
      ...this.scheduleForm.value,
      exam: this.examId
    };

    this.examsService.createExamSchedule(schedule).subscribe(() => {
      this.loadSchedules();
      this.scheduleForm.reset({
        max_marks: 100,
        passing_marks: 33
      });
    });
  }

  deleteSchedule(id: number): void {
    if (confirm('Delete this schedule?')) {
      this.examsService.deleteExamSchedule(id).subscribe(() => {
        this.loadSchedules();
      });
    }
  }
}
