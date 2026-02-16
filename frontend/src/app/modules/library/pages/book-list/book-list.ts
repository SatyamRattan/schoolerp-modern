import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService, Book, BookCategory } from '../../services/library';
import { LucideAngularModule, Plus, Trash2, Edit, Search } from 'lucide-angular';

@Component({
    selector: 'app-book-list',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './book-list.html'
})
export class BookListComponent implements OnInit {
    books: Book[] = [];
    categories: BookCategory[] = [];
    loading = true;
    showModal = false;
    editingBook: Book | null = null;

    newBook: Book = {
        title: '', author: '', isbn: '', publisher: '',
        category: 0, quantity: 1, available: 1, price: '0.00'
    };

    // Icons
    readonly Plus = Plus;
    readonly Trash2 = Trash2;
    readonly Edit = Edit;
    readonly Search = Search;

    constructor(private libraryService: LibraryService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.libraryService.getCategories().subscribe(cats => this.categories = cats);
        this.libraryService.getBooks().subscribe({
            next: (data) => {
                this.books = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading books', err);
                this.loading = false;
            }
        });
    }

    openAddModal() {
        this.editingBook = null;
        this.newBook = {
            title: '', author: '', isbn: '', publisher: '',
            category: this.categories.length > 0 ? this.categories[0].id! : 0,
            quantity: 1, available: 1, price: '0.00'
        };
        this.showModal = true;
    }

    openEditModal(book: Book) {
        this.editingBook = book;
        this.newBook = { ...book };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveBook() {
        if (this.editingBook) {
            this.libraryService.updateBook(this.editingBook.id!, this.newBook).subscribe(() => {
                this.loadData();
                this.closeModal();
            });
        } else {
            this.libraryService.createBook(this.newBook).subscribe(() => {
                this.loadData();
                this.closeModal();
            });
        }
    }

    deleteBook(id: number) {
        if (confirm('Are you sure you want to delete this book?')) {
            this.libraryService.deleteBook(id).subscribe(() => this.loadData());
        }
    }
}
