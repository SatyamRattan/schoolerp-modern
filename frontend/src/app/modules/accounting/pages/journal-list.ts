import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountingService } from '../services/accounting.service';
import { LucideAngularModule, Plus, Search, Calendar, DollarSign, Tag } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-journal-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    templateUrl: './journal-list.html',
    styleUrls: ['./journal-list.css']
})
export class JournalListComponent implements OnInit {
    journals: any[] = [];
    searchTerm = '';
    loading = false;

    readonly plusIcon = Plus;
    readonly searchIcon = Search;
    readonly calendarIcon = Calendar;
    readonly amountIcon = DollarSign;
    readonly tagIcon = Tag;

    constructor(private accountingService: AccountingService) { }

    ngOnInit(): void {
        this.loadJournals();
    }

    loadJournals(): void {
        this.loading = true;
        this.accountingService.getJournals().subscribe({
            next: (data) => {
                this.journals = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    filteredJournals() {
        return this.journals.filter(j =>
            j.account_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            j.short_narration.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            j.voucher_no.toString().includes(this.searchTerm)
        );
    }
}
