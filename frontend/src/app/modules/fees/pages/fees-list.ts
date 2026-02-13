import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeesService } from '../services/fees.service';
import { LucideAngularModule, Plus, Search, Layers, Calendar } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-fees-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    templateUrl: './fees-list.html',
    styleUrls: ['./fees-list.css']
})
export class FeesListComponent implements OnInit {
    feesHeads: any[] = [];
    searchTerm = '';
    loading = false;

    readonly plusIcon = Plus;
    readonly searchIcon = Search;
    readonly groupIcon = Layers;
    readonly freqIcon = Calendar;

    constructor(private feesService: FeesService) { }

    ngOnInit(): void {
        this.loadFeesHeads();
    }

    loadFeesHeads(): void {
        this.loading = true;
        this.feesService.getFeesHeads().subscribe({
            next: (data) => {
                this.feesHeads = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    filteredFees() {
        return this.feesHeads.filter(head =>
            head.fees_heading.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            head.group_name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }
}
