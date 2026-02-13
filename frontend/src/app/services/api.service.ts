import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private auth: AuthService) { }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.auth.getToken()}`
        });
    }

    get<T>(path: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${path}/`, { headers: this.getHeaders() });
    }

    post<T>(path: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}/${path}/`, body, { headers: this.getHeaders() });
    }

    put<T>(path: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${path}/`, body, { headers: this.getHeaders() });
    }

    delete<T>(path: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}/${path}/`, { headers: this.getHeaders() });
    }
}
