import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Enquiry {
    id?: number;
    student_name: string;
    parent_name: string;
    phone: string;
    email: string;
    class_applying_for: string;
    previous_school: string;
    status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED';
    follow_up_date?: string;
    remarks: string;
    created_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class EnquiryService {
    private apiUrl = 'http://localhost:8000/api/enquiry';

    constructor(private http: HttpClient) { }

    getEnquiries(): Observable<Enquiry[]> {
        return this.http.get<Enquiry[]>(`${this.apiUrl}/enquiries/`);
    }

    createEnquiry(data: Enquiry): Observable<Enquiry> {
        return this.http.post<Enquiry>(`${this.apiUrl}/enquiries/`, data);
    }

    updateEnquiry(id: number, data: Enquiry): Observable<Enquiry> {
        return this.http.patch<Enquiry>(`${this.apiUrl}/enquiries/${id}/`, data);
    }
}
