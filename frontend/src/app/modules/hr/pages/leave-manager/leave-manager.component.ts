import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrService, Leave, Staff } from '../../services/hr.service';
import { LucideAngularModule, Plus, Check, X } from 'lucide-angular';

@Component({
    selector: 'app-leave-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './leave-manager.html'
})
export class LeaveManagerComponent implements OnInit {
    leaves: Leave[] = [];
    staffList: Staff[] = [];

    showModal = false;
    currentLeave: Leave = this.getEmptyLeave();

    readonly Plus = Plus;
    readonly Check = Check;
    readonly X = X;

    constructor(private hrService: HrService) { }

    ngOnInit() {
        this.loadData();
        this.hrService.getStaff().subscribe(data => this.staffList = data);
    }

    getEmptyLeave(): Leave {
        return {
            staff: 0,
            leave_type: 'CL',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
            reason: '',
            status: 'PENDING'
        };
    }

    loadData() {
        this.hrService.getLeaves().subscribe(data => this.leaves = data);
    }

    openApplyModal() {
        this.currentLeave = this.getEmptyLeave();
        this.showModal = true;
    }

    applyLeave() {
        if (!this.currentLeave.staff) {
            alert('Please select a staff member (Simulating login)');
            return;
        }
        this.hrService.createLeave(this.currentLeave).subscribe(() => {
            this.loadData();
            this.showModal = false;
        });
    }

    updateStatus(id: number, status: string) {
        if (confirm(`Are you sure you want to ${status} this leave?`)) {
            this.hrService.updateLeaveStatus(id, status).subscribe(() => this.loadData());
        }
    }
}
