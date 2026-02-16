import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExamsService, ExamSchedule, Marks } from '../../services/exams';
import { StudentsService } from '../../../students/services/students';
import { LucideAngularModule, Save, Search } from 'lucide-angular';

@Component({
  selector: 'app-marks-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './marks-entry.html',
  styleUrl: './marks-entry.css'
})
export class MarksEntryComponent implements OnInit {
  filterForm: FormGroup;
  students: any[] = [];
  marks: Marks[] = [];
  examSchedule: ExamSchedule | null = null;
  examScheduleId: number | null = null;
  loading = false;

  readonly Save = Save;
  readonly Search = Search;

  constructor(
    private fb: FormBuilder,
    private examsService: ExamsService,
    private studentsService: StudentsService,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      exam_schedule: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.examScheduleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.examScheduleId) {
      this.filterForm.patchValue({ exam_schedule: this.examScheduleId });
      this.loadData();
    }
  }

  loadData(): void {
    if (!this.examScheduleId) return;
    this.loading = true;

    // Load schedule info first
    this.examsService.getExamSchedule(this.examScheduleId).subscribe(schedule => {
      this.examSchedule = schedule;

      // Load current marks
      this.examsService.getMarks(this.examScheduleId!).subscribe(marksData => {
        this.marks = marksData;

        // Load students in that section
        this.studentsService.getStudents(undefined, schedule.section).subscribe(students => {
          this.students = students.map(s => {
            const existingMark = this.marks.find(m => m.student === s.id);
            return {
              ...s,
              obtained: existingMark ? existingMark.marks_obtained : '',
              is_absent: existingMark ? existingMark.is_absent : false,
              remarks: existingMark ? existingMark.remarks : '',
              mark_id: existingMark ? existingMark.id : null
            };
          });
          this.loading = false;
        });
      });
    });
  }

  saveMark(student: any): void {
    const mark: Marks = {
      id: student.mark_id,
      student: student.id,
      exam_schedule: this.examScheduleId!,
      marks_obtained: student.obtained,
      is_absent: student.is_absent || false,
      remarks: student.remarks || ''
    };

    this.examsService.saveMarks(mark).subscribe(res => {
      student.mark_id = res.id;
      // Ideally show a success indicator
    });
  }
}
