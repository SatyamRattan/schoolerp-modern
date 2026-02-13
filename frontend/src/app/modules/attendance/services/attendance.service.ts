import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    constructor(private api: ApiService) { }

    getAttendance(filters: any): Observable<any[]> {
        return this.api.get<any[]>('attendance/attendance');
    }

    markAttendance(data: any): Observable<any> {
        return this.api.post<any>('attendance/attendance', data);
    }
}
