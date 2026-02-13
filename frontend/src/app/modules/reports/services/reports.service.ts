import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';

export interface TrialBalanceItem {
    account_name: string;
    group: string;
    debit: number;
    credit: number;
}

export interface TrialBalanceResponse {
    trial_balance: TrialBalanceItem[];
    total_debit: number;
    total_credit: number;
    balanced: boolean;
}

export interface ProfitLossResponse {
    revenue: number;
    expenses: number;
    profit: number;
    profit_percentage: number;
}

export interface BalanceSheetResponse {
    assets: number;
    liabilities: number;
    difference: number;
}

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    constructor(private api: ApiService) { }

    getTrialBalance(): Observable<TrialBalanceResponse> {
        return this.api.get<TrialBalanceResponse>('accounts/reports/trial-balance');
    }

    getProfitLoss(): Observable<ProfitLossResponse> {
        return this.api.get<ProfitLossResponse>('accounts/reports/profit-loss');
    }

    getBalanceSheet(): Observable<BalanceSheetResponse> {
        return this.api.get<BalanceSheetResponse>('accounts/reports/balance-sheet');
    }

    // Certificate generation
    getTransferCertificate(studentId: number): string {
        return `${environment.apiUrl}/students/certificates/transfer/?student_id=${studentId}`;
    }

    getCharacterCertificate(studentId: number): string {
        return `${environment.apiUrl}/students/certificates/character/?student_id=${studentId}`;
    }
}
