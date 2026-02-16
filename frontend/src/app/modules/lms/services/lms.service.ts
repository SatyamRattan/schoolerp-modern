import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Topic {
    id: number;
    lesson: number;
    title: string;
    content: string;
    video_url: string;
    pdf_file: string | null;
    order: number;
    created_at: string;
}

export interface Lesson {
    id: number;
    subject: number;
    title: string;
    description: string;
    order: number;
    created_at: string;
    topics?: Topic[];
    quizzes?: Quiz[];
}

export interface Choice {
    id: number;
    text: string;
}

export interface Question {
    id: number;
    text: string;
    order: number;
    choices: Choice[];
}

export interface Quiz {
    id: number;
    lesson: number;
    title: string;
    description: string;
    created_at: string;
    questions?: Question[];
}

export interface QuizResult {
    score: number;
    total: number;
    attempt_id: number;
}

@Injectable({
    providedIn: 'root'
})
export class LmsService {
    private apiUrl = `${environment.apiUrl}/lms`;

    constructor(private http: HttpClient) { }

    getLessons(): Observable<Lesson[]> {
        return this.http.get<Lesson[]>(`${this.apiUrl}/lessons/`);
    }

    getLesson(id: number): Observable<Lesson> {
        return this.http.get<Lesson>(`${this.apiUrl}/lessons/${id}/`);
    }

    getTopics(): Observable<Topic[]> {
        return this.http.get<Topic[]>(`${this.apiUrl}/topics/`);
    }

    getTopic(id: number): Observable<Topic> {
        return this.http.get<Topic>(`${this.apiUrl}/topics/${id}/`);
    }

    getQuizzes(): Observable<Quiz[]> {
        return this.http.get<Quiz[]>(`${this.apiUrl}/quizzes/`);
    }

    getQuiz(id: number): Observable<Quiz> {
        return this.http.get<Quiz>(`${this.apiUrl}/quizzes/${id}/`);
    }

    submitQuiz(id: number, answers: { [questionId: number]: number }): Observable<QuizResult> {
        return this.http.post<QuizResult>(`${this.apiUrl}/quizzes/${id}/submit/`, { answers });
    }
}
