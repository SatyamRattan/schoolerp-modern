import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';

export interface Subject {
  id?: number;
  subject_name: string;
}

export interface Term {
  id?: number;
  term_name: string;
}

export interface Assessment {
  id?: number;
  assessment_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AcademicService {
  constructor(private api: ApiService) { }

  // Subject APIs
  getSubjects(): Observable<Subject[]> {
    return this.api.get<Subject[]>('students/subjects');
  }

  createSubject(subject: Subject): Observable<Subject> {
    return this.api.post<Subject>('students/subjects', subject);
  }

  deleteSubject(id: number): Observable<any> {
    return this.api.delete(`students/subjects/${id}`);
  }

  // Term APIs
  getTerms(): Observable<Term[]> {
    return this.api.get<Term[]>('students/terms');
  }

  createTerm(term: Term): Observable<Term> {
    return this.api.post<Term>('students/terms', term);
  }

  deleteTerm(id: number): Observable<any> {
    return this.api.delete(`students/terms/${id}`);
  }

  // Assessment APIs
  getAssessments(): Observable<Assessment[]> {
    return this.api.get<Assessment[]>('students/assessments');
  }

  createAssessment(assessment: Assessment): Observable<Assessment> {
    return this.api.post<Assessment>('students/assessments', assessment);
  }

  deleteAssessment(id: number): Observable<any> {
    return this.api.delete(`students/assessments/${id}`);
  }
}
