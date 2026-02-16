import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
    id?: number;
    student_first_name: string;
    student_last_name: string;
    student_dob: string;
    gender: string;
    student_class: string;
    student_section: string;
    fathers_first_name: string;
    f_mobile: string;
    mothers_first_name: string;
    m_mobile: string;
    house_no: string;
    street_name: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    caste: string;
    category: string;
    house: string;
    year: string;
    admission_form_no: number;
    status_adm?: string;
    admission_no?: number;
    date_admission?: string;
}

export interface Class {
    id?: number;
    class_num: number;
}

export interface Section {
    id?: number;
    section_name: string;
}

@Injectable({
    providedIn: 'root'
})
export class StudentsService {
    private apiUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient) { }

    // Admissions
    createAdmission(student: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/students/admissions/`, student);
    }

    getAdmissions(): Observable<Student[]> {
        return this.http.get<Student[]>(`${this.apiUrl}/students/admissions/`);
    }

    approveAdmission(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/students/admissions/${id}/approve/`, {});
    }

    getStudents(classId?: number, sectionId?: number): Observable<Student[]> {
        let url = `${this.apiUrl}/students/students/`;
        let params: string[] = [];
        if (classId) params.push(`student_class=${classId}`);
        if (sectionId) params.push(`student_section=${sectionId}`);
        if (params.length > 0) url += `?${params.join('&')}`;
        return this.http.get<Student[]>(url);
    }

    // Helpers
    getClasses(): Observable<Class[]> {
        return this.http.get<Class[]>(`${this.apiUrl}/students/classes/`);
    }

    getSections(classId?: number): Observable<Section[]> {
        let url = `${this.apiUrl}/students/sections/`;
        if (classId) {
            url += `?class_id=${classId}`;
        }
        return this.http.get<Section[]>(url);
    }

    getCastes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/students/castes/`);
    }

    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/students/categories/`);
    }

    getHouses(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/students/houses/`);
    }

    getSubjects(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/students/subjects/`);
    }
}
