import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookCategory {
    id?: number;
    name: string;
    description: string;
}

export interface Book {
    id?: number;
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    category: number;
    category_name?: string;
    quantity: number;
    available: number;
    price: string;
    added_date?: string;
}

export interface LibraryMember {
    id?: number;
    student: number;
    student_details?: any;
    date_joined: string;
    is_active: boolean;
}

export interface BookIssue {
    id?: number;
    book: number;
    book_title?: string;
    member: number;
    member_name?: string;
    member_id_card?: string;
    issue_date: string;
    due_date: string;
    return_date?: string;
    fine_amount: string;
    status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
    remarks: string;
}

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    private apiUrl = 'http://localhost:8000/api/library';

    constructor(private http: HttpClient) { }

    // Categories
    getCategories(): Observable<BookCategory[]> {
        return this.http.get<BookCategory[]>(`${this.apiUrl}/categories/`);
    }

    // Books
    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(`${this.apiUrl}/books/`);
    }

    createBook(book: Book): Observable<Book> {
        return this.http.post<Book>(`${this.apiUrl}/books/`, book);
    }

    updateBook(id: number, book: Book): Observable<Book> {
        return this.http.put<Book>(`${this.apiUrl}/books/${id}/`, book);
    }

    deleteBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/books/${id}/`);
    }

    // Members
    getMembers(): Observable<LibraryMember[]> {
        return this.http.get<LibraryMember[]>(`${this.apiUrl}/members/`);
    }

    syncMembers(): Observable<any> {
        return this.http.post(`${this.apiUrl}/members/sync_students/`, {});
    }

    // Issues
    getIssues(search?: string): Observable<BookIssue[]> {
        let url = `${this.apiUrl}/issues/`;
        if (search) {
            url += `?search=${search}`;
        }
        return this.http.get<BookIssue[]>(url);
    }

    issueBook(issue: BookIssue): Observable<BookIssue> {
        return this.http.post<BookIssue>(`${this.apiUrl}/issues/`, issue);
    }

    returnBook(id: number): Observable<BookIssue> {
        return this.http.post<BookIssue>(`${this.apiUrl}/issues/${id}/return_book/`, {});
    }
}
