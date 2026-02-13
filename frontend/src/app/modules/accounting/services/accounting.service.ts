import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class AccountingService {
    constructor(private api: ApiService) { }

    // Accounts
    getAccounts(): Observable<any[]> {
        return this.api.get<any[]>('accounts/accounts');
    }

    getAccount(id: number): Observable<any> {
        return this.api.get<any>(`accounts/accounts/${id}`);
    }

    createAccount(data: any): Observable<any> {
        return this.api.post<any>('accounts/accounts', data);
    }

    updateAccount(id: number, data: any): Observable<any> {
        return this.api.put<any>(`accounts/accounts/${id}`, data);
    }

    deleteAccount(id: number): Observable<any> {
        return this.api.delete<any>(`accounts/accounts/${id}`);
    }

    // Account Groups
    getAccountGroups(): Observable<any[]> {
        return this.api.get<any[]>('accounts/account-groups');
    }

    // Journals
    getJournals(): Observable<any[]> {
        return this.api.get<any[]>('accounts/journal');
    }

    createJournal(data: any): Observable<any> {
        return this.api.post<any>('accounts/journal', data);
    }
}
