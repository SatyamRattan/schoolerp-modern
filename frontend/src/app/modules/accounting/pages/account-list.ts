import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountingService } from '../services/accounting.service';
import { LucideAngularModule, Plus, Search, Edit2, Trash2, FileText } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-account-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    templateUrl: './account-list.html',
    styleUrls: ['./account-list.css']
})
export class AccountListComponent implements OnInit {
    accounts: any[] = [];
    searchTerm = '';
    loading = false;

    readonly plusIcon = Plus;
    readonly searchIcon = Search;
    readonly editIcon = Edit2;
    readonly deleteIcon = Trash2;
    readonly detailIcon = FileText;

    constructor(private accountingService: AccountingService) { }

    ngOnInit(): void {
        this.loadAccounts();
    }

    loadAccounts(): void {
        this.loading = true;
        this.accountingService.getAccounts().subscribe({
            next: (data) => {
                this.accounts = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    filteredAccounts() {
        return this.accounts.filter(acc =>
            acc.account_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            acc.group_acc.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            acc.city.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    deleteAccount(id: number): void {
        if (confirm('Are you sure you want to delete this account?')) {
            this.accountingService.deleteAccount(id).subscribe(() => this.loadAccounts());
        }
    }
}
