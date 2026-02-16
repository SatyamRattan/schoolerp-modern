import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamsService, Exam } from '../../services/exams';
import { LucideAngularModule, Plus, Calendar, FileText, Trash2, Edit, MoreVertical, ClipboardList } from 'lucide-angular';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './exam-list.html',
  styleUrl: './exam-list.css'
})
export class ExamListComponent implements OnInit {
  exams: Exam[] = [];
  loading = true;

  // Icons
  readonly Plus = Plus;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  readonly Trash2 = Trash2;
  readonly Edit = Edit;
  readonly MoreVertical = MoreVertical;
  readonly examIcon = ClipboardList;

  constructor(private examsService: ExamsService) { }

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.examsService.getExams().subscribe({
      next: (data) => {
        this.exams = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching exams', err);
        this.loading = false;
      }
    });
  }

  deleteExam(id: number): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examsService.deleteExam(id).subscribe(() => {
        this.loadExams();
      });
    }
  }

  publishResult(id: number): void {
    if (confirm('Publish results? Students will be able to see their report cards.')) {
      this.examsService.publishResult(id).subscribe(() => this.loadExams());
    }
  }

  unpublishResult(id: number): void {
    if (confirm('Unpublish results?')) {
      this.examsService.unpublishResult(id).subscribe(() => this.loadExams());
    }
  }

  openCreateModal(): void {
    // Logic would go here to open a modal
    alert("Opening New Exam Wizard...");
  }
}
