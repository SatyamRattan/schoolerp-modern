import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Department {
    id?: number;
    name: string;
}

export interface Staff {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    designation: string;
    department: number | null;
    department_name?: string;
    joining_date: string;
    salary: string;
    is_active: boolean;
}

export interface Leave {
    id?: number;
    staff: number;
    staff_name?: string;
    leave_type: 'SL' | 'CL' | 'EL';
    start_date: string;
    end_date: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

@Injectable({
    providedIn: 'root'
})
export class HrService {
    private apiUrl = 'http://localhost:8000/api/hr';

    constructor(private http: HttpClient) { }

    // Departments
    getDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(`${this.apiUrl}/departments/`);
    }

    // Staff
    getStaff(): Observable<Staff[]> {
        return this.http.get<Staff[]>(`${this.apiUrl}/staff/`);
    }

    createStaff(data: Staff): Observable<Staff> {
        return this.http.post<Staff>(`${this.apiUrl}/staff/`, data);
    }

    updateStaff(id: number, data: Staff): Observable<Staff> {
        return this.http.patch<Staff>(`${this.apiUrl}/staff/${id}/`, data);
    }

    deleteStaff(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/staff/${id}/`);
    }

    // Leaves
    getLeaves(): Observable<Leave[]> {
        return this.http.get<Leave[]>(`${this.apiUrl}/leaves/`);
    }

    createLeave(data: Leave): Observable<Leave> {
        return this.http.post<Leave>(`${this.apiUrl}/leaves/`, data);
    }

    updateLeaveStatus(id: number, status: string): Observable<Leave> {
        return this.http.patch<Leave>(`${this.apiUrl}/leaves/${id}/`, { status });
    }
}
