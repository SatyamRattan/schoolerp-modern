import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ExamType {
  id?: number;
  name: string;
  description: string;
}

export interface AcademicYear {
  id?: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface Exam {
  id?: number;
  name: string;
  exam_type: number;
  exam_type_name?: string;
  academic_year: number;
  academic_year_name?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  result_published: boolean;
}

export interface ExamSchedule {
  id?: number;
  exam: number;
  subject: number;
  subject_name?: string;
  section: number;
  section_name?: string;
  date: string;
  start_time: string;
  end_time: string;
  max_marks: string;
  passing_marks: string;
  room_no: string;
}

export interface Marks {
  id?: number;
  student: number;
  student_name?: string;
  roll_no?: number;
  exam_schedule: number;
  marks_obtained: string;
  is_absent: boolean;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Academic Years
  getAcademicYears(): Observable<AcademicYear[]> {
    return this.http.get<AcademicYear[]>(`${this.apiUrl}/school-admin/academic-years/`);
  }

  // Exam Types
  getExamTypes(): Observable<ExamType[]> {
    return this.http.get<ExamType[]>(`${this.apiUrl}/exams/exam-types/`);
  }

  // Exams
  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/exams/exams/`);
  }

  createExam(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/exams/exams/`, exam);
  }

  updateExam(id: number, exam: Exam): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/exams/exams/${id}/`, exam);
  }

  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exams/exams/${id}/`);
  }

  publishResult(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/exams/exams/${id}/publish/`, {});
  }

  unpublishResult(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/exams/exams/${id}/unpublish/`, {});
  }

  // Schedules
  getExamSchedules(examId: number): Observable<ExamSchedule[]> {
    return this.http.get<ExamSchedule[]>(`${this.apiUrl}/exams/schedules/?exam_id=${examId}`);
  }

  getExamSchedule(id: number): Observable<ExamSchedule> {
    return this.http.get<ExamSchedule>(`${this.apiUrl}/exams/schedules/${id}/`);
  }

  createExamSchedule(schedule: ExamSchedule): Observable<ExamSchedule> {
    return this.http.post<ExamSchedule>(`${this.apiUrl}/exams/schedules/`, schedule);
  }

  deleteExamSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exams/schedules/${id}/`);
  }

  // Marks
  getMarks(examScheduleId: number): Observable<Marks[]> {
    return this.http.get<Marks[]>(`${this.apiUrl}/exams/marks/?exam_schedule_id=${examScheduleId}`);
  }

  saveMarks(marks: Marks): Observable<Marks> {
    if (marks.id) {
      return this.http.put<Marks>(`${this.apiUrl}/exams/marks/${marks.id}/`, marks);
    }
    return this.http.post<Marks>(`${this.apiUrl}/exams/marks/`, marks);
  }
}
