import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
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
    constructor(private api: ApiService, private http: HttpClient, private auth: AuthService) { }

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
    downloadCertificate(studentId: number, type: string): Observable<Blob> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.auth.getToken()}`
        });
        return this.http.get(`${environment.apiUrl}/reports/certificate/${studentId}/${type}/`, {
            responseType: 'blob',
            headers: headers
        });
    }
}
