import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrService, Staff, Department } from '../../services/hr.service';
import { LucideAngularModule, Plus, Edit, Trash2, User } from 'lucide-angular';

@Component({
    selector: 'app-staff-list',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './staff-list.html'
})
export class StaffListComponent implements OnInit {
    staffList: Staff[] = [];
    departments: Department[] = [];
    showModal = false;
    isEditing = false;
    currentStaff: Staff = this.getEmptyStaff();

    readonly Plus = Plus;
    readonly Edit = Edit;
    readonly Trash2 = Trash2;
    readonly User = User;

    constructor(private hrService: HrService) { }

    ngOnInit() {
        this.loadData();
    }

    getEmptyStaff(): Staff {
        return {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            designation: '',
            department: null,
            joining_date: new Date().toISOString().split('T')[0],
            salary: '',
            is_active: true
        };
    }

    loadData() {
        this.hrService.getStaff().subscribe(data => this.staffList = data);
        this.hrService.getDepartments().subscribe(data => this.departments = data);
    }

    openAddModal() {
        this.isEditing = false;
        this.currentStaff = this.getEmptyStaff();
        this.showModal = true;
    }

    openEditModal(staff: Staff) {
        this.isEditing = true;
        this.currentStaff = { ...staff };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveStaff() {
        if (this.isEditing && this.currentStaff.id) {
            this.hrService.updateStaff(this.currentStaff.id, this.currentStaff).subscribe(() => {
                this.loadData();
                this.closeModal();
            });
        } else {
            this.hrService.createStaff(this.currentStaff).subscribe(() => {
                this.loadData();
                this.closeModal();
            });
        }
    }

    deleteStaff(id: number) {
        if (confirm('Are you sure you want to remove this staff member?')) {
            this.hrService.deleteStaff(id).subscribe(() => this.loadData());
        }
    }
}
