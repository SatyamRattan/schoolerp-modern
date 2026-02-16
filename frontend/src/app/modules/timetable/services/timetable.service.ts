import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Period {
    id?: number;
    name: string;
    start_time: string;
    end_time: string;
    is_break: boolean;
}

export interface TeacherAllocation {
    id?: number;
    teacher: number;
    teacher_name?: string;
    subject: number;
    subject_name?: string;
    class_obj: number;
    class_name?: string;
    section: number;
    section_name?: string;
}

export interface TimeTableEntry {
    id?: number;
    class_obj: number;
    section: number;
    day: number;
    day_name?: string;
    period: number;
    period_detail?: Period;
    subject: number;
    subject_name?: string;
    teacher?: number;
    teacher_name?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TimeTableService {
    private apiUrl = 'http://localhost:8000/api/timetable';

    constructor(private http: HttpClient) { }

    // Periods
    getPeriods(): Observable<Period[]> {
        return this.http.get<Period[]>(`${this.apiUrl}/periods/`);
    }

    createPeriod(period: Period): Observable<Period> {
        return this.http.post<Period>(`${this.apiUrl}/periods/`, period);
    }

    // Allocations
    getAllocations(): Observable<TeacherAllocation[]> {
        return this.http.get<TeacherAllocation[]>(`${this.apiUrl}/allocations/`);
    }

    createAllocation(allocation: TeacherAllocation): Observable<TeacherAllocation> {
        return this.http.post<TeacherAllocation>(`${this.apiUrl}/allocations/`, allocation);
    }

    // Time Table Entries
    getTimeTable(classId: number, sectionId: number): Observable<TimeTableEntry[]> {
        return this.http.get<TimeTableEntry[]>(`${this.apiUrl}/entries/?class_id=${classId}&section_id=${sectionId}`);
    }

    saveTimeTable(entries: any[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/entries/bulk_create_entries/`, { entries });
    }
}
