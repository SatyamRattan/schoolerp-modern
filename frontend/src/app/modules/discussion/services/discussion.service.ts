import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

export interface Author {
    id: number;
    username: string;
    email: string;
}

export interface Reply {
    id: number;
    thread: number;
    content: string;
    author: number;
    author_details?: Author;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

export interface Thread {
    id: number;
    title: string;
    content: string;
    author: number;
    author_details?: Author;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    views_count: number;
    replies?: Reply[];
    reply_count?: number;
}

@Injectable({
    providedIn: 'root'
})
export class DiscussionService {
    private apiUrl = environment.apiUrl + '/discussion';

    constructor(private http: HttpClient, private auth: AuthService) { }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.auth.getToken()}`
        });
    }

    getThreads(page = 1, pageSize = 20): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/threads/?page=${page}&page_size=${pageSize}`, { headers: this.getHeaders() });
    }

    getThread(id: number): Observable<Thread> {
        return this.http.get<Thread>(`${this.apiUrl}/threads/${id}/`, { headers: this.getHeaders() });
    }

    createThread(data: { title: string, content: string }): Observable<Thread> {
        return this.http.post<Thread>(`${this.apiUrl}/threads/`, data, { headers: this.getHeaders() });
    }

    getReplies(threadId: number): Observable<Reply[]> {
        return this.http.get<Reply[]>(`${this.apiUrl}/replies/?thread_id=${threadId}`, { headers: this.getHeaders() });
    }

    createReply(data: { thread: number, content: string }): Observable<Reply> {
        return this.http.post<Reply>(`${this.apiUrl}/replies/`, data, { headers: this.getHeaders() });
    }

    incrementView(threadId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/threads/${threadId}/view/`, {}, { headers: this.getHeaders() });
    }
}
