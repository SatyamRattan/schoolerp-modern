import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

export interface CalendarEvent {
  id?: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  type: 'holiday' | 'event' | 'exam' | 'meeting' | 'other';
  audience: 'all' | 'students' | 'staff' | 'parents';
  created_by?: number;
  created_by_details?: { id: number, username: string };
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = environment.apiUrl + '/calendar/events/';

  constructor(private http: HttpClient, private auth: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  getEvents(start?: string, end?: string): Observable<CalendarEvent[]> {
    let params = new HttpParams();
    if (start) params = params.set('start', start);
    if (end) params = params.set('end', end);

    return this.http.get<CalendarEvent[]>(this.apiUrl, {
      headers: this.getHeaders(),
      params: params
    });
  }

  createEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(this.apiUrl, event, { headers: this.getHeaders() });
  }

  updateEvent(id: number, event: Partial<CalendarEvent>): Observable<CalendarEvent> {
    return this.http.patch<CalendarEvent>(`${this.apiUrl}${id}/`, event, { headers: this.getHeaders() });
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}
