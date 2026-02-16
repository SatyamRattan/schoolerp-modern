import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService, TrialBalanceResponse, ProfitLossResponse, BalanceSheetResponse } from '../services/reports.service';

@Component({
    selector: 'app-financial-reports',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './financial-reports.component.html',
    styleUrls: ['./financial-reports.component.css']
})
export class FinancialReportsComponent implements OnInit {
    activeReport: 'trial-balance' | 'profit-loss' | 'balance-sheet' = 'trial-balance';

    trialBalance: TrialBalanceResponse | null = null;
    profitLoss: ProfitLossResponse | null = null;
    balanceSheet: BalanceSheetResponse | null = null;

    loading = false;

    constructor(private reportsService: ReportsService) { }

    ngOnInit() {
        this.loadTrialBalance();
    }

    loadTrialBalance() {
        this.loading = true;
        this.reportsService.getTrialBalance().subscribe({
            next: (data) => {
                this.trialBalance = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading trial balance:', err);
                this.loading = false;
                alert('Failed to load trial balance');
            }
        });
    }

    loadProfitLoss() {
        this.loading = true;
        this.reportsService.getProfitLoss().subscribe({
            next: (data) => {
                this.profitLoss = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading P&L:', err);
                this.loading = false;
                alert('Failed to load Profit & Loss');
            }
        });
    }

    loadBalanceSheet() {
        this.loading = true;
        this.reportsService.getBalanceSheet().subscribe({
            next: (data) => {
                this.balanceSheet = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading balance sheet:', err);
                this.loading = false;
                alert('Failed to load Balance Sheet');
            }
        });
    }

    switchReport(report: 'trial-balance' | 'profit-loss' | 'balance-sheet') {
        this.activeReport = report;
        if (report === 'trial-balance' && !this.trialBalance) {
            this.loadTrialBalance();
        } else if (report === 'profit-loss' && !this.profitLoss) {
            this.loadProfitLoss();
        } else if (report === 'balance-sheet' && !this.balanceSheet) {
            this.loadBalanceSheet();
        }
    }

    // Certificate methods moved to CertificatesComponent
}
