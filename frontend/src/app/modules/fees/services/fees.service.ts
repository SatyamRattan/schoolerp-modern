import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class FeesService {
    constructor(private api: ApiService) { }

    // Fee Heads
    getFeesHeads(): Observable<any[]> {
        return this.api.get<any[]>('fees/fees-heads');
    }

    createFeesHead(data: any): Observable<any> {
        return this.api.post<any>('fees/fees-heads', data);
    }

    // Fee Head Groups
    getFeesHeadGroups(): Observable<any[]> {
        return this.api.get<any[]>('fees/fees-head-groups');
    }

    // Fees Plans
    getFeesPlans(): Observable<any[]> {
        return this.api.get<any[]>('fees/fees-plans');
    }

    // Fees Receipts
    getFeesReceipts(): Observable<any[]> {
        return this.api.get<any[]>('fees/fees-receipts');
    }
}
