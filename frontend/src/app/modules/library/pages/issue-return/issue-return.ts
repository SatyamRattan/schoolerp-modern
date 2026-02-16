import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService, Book, LibraryMember, BookIssue } from '../../services/library';
import { LucideAngularModule, Search, CheckCircle, XCircle, RotateCcw } from 'lucide-angular';

@Component({
    selector: 'app-issue-return',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './issue-return.html'
})
export class IssueReturnComponent implements OnInit {
    issues: BookIssue[] = [];
    members: LibraryMember[] = [];
    books: Book[] = [];
    loading = false;

    // New Issue Form
    selectedMember: number | null = null;
    selectedBook: number | null = null;
    issueDate: string = new Date().toISOString().split('T')[0];
    dueDate: string = '';

    // Icons
    readonly Search = Search;
    readonly CheckCircle = CheckCircle;
    readonly XCircle = XCircle;
    readonly RotateCcw = RotateCcw;

    constructor(private libraryService: LibraryService) { }

    ngOnInit() {
        this.loadData();
        this.calculateDueDate();
    }

    loadData() {
        this.loading = true;
        this.libraryService.getIssues().subscribe(data => {
            this.issues = data;
            this.loading = false;
        });
        this.libraryService.getMembers().subscribe(data => this.members = data);
        this.libraryService.getBooks().subscribe(data => this.books = data.filter(b => b.available > 0));
    }

    calculateDueDate() {
        const date = new Date(this.issueDate);
        date.setDate(date.getDate() + 14); // Default 14 days
        this.dueDate = date.toISOString().split('T')[0];
    }

    issueBook() {
        if (!this.selectedMember || !this.selectedBook) return;

        const newIssue: any = {
            member: this.selectedMember,
            book: this.selectedBook,
            issue_date: this.issueDate,
            due_date: this.dueDate
        };

        this.libraryService.issueBook(newIssue).subscribe({
            next: () => {
                alert('Book Issued Successfully');
                this.loadData();
                this.selectedBook = null;
                this.selectedMember = null;
            },
            error: (err) => alert('Failed to issue book: ' + JSON.stringify(err))
        });
    }

    returnBook(id: number) {
        if (confirm('Confirm return of this book?')) {
            this.libraryService.returnBook(id).subscribe({
                next: (res) => {
                    alert(`Book Returned. Fine Amount: ${res.fine_amount}`);
                    this.loadData();
                },
                error: (err) => alert('Failed to return book')
            });
        }
    }

    syncMembers() {
        this.libraryService.syncMembers().subscribe(() => {
            alert('Members synced with Students');
            this.loadData();
        });
    }
}
