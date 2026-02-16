import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnquiryService, Enquiry } from '../../services/enquiry.service';
import { LucideAngularModule, Plus, PhoneCall, CheckCircle, XCircle } from 'lucide-angular';

@Component({
    selector: 'app-enquiry-list',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './enquiry-list.html'
})
export class EnquiryListComponent implements OnInit {
    enquiries: Enquiry[] = [];
    showModal = false;
    isEditing = false;
    currentEnquiry: Enquiry = this.getEmptyEnquiry();

    readonly Plus = Plus;
    readonly PhoneCall = PhoneCall;
    readonly CheckCircle = CheckCircle;
    readonly XCircle = XCircle;

    constructor(private enquiryService: EnquiryService) { }

    ngOnInit() {
        this.loadData();
    }

    getEmptyEnquiry(): Enquiry {
        return {
            student_name: '',
            parent_name: '',
            phone: '',
            email: '',
            class_applying_for: '',
            previous_school: '',
            status: 'NEW',
            remarks: ''
        };
    }

    loadData() {
        this.enquiryService.getEnquiries().subscribe(data => this.enquiries = data);
    }

    openAddModal() {
        this.isEditing = false;
        this.currentEnquiry = this.getEmptyEnquiry();
        this.showModal = true;
    }

    openEditModal(enquiry: Enquiry) {
        this.isEditing = true;
        this.currentEnquiry = { ...enquiry };
        this.showModal = true;
    }

    saveEnquiry() {
        if (this.isEditing && this.currentEnquiry.id) {
            this.enquiryService.updateEnquiry(this.currentEnquiry.id, this.currentEnquiry).subscribe(() => {
                this.loadData();
                this.showModal = false;
            });
        } else {
            this.enquiryService.createEnquiry(this.currentEnquiry).subscribe(() => {
                this.loadData();
                this.showModal = false;
            });
        }
    }

    updateStatus(enquiry: Enquiry, status: 'CONTACTED' | 'CONVERTED' | 'CLOSED') {
        if (enquiry.id) {
            this.enquiryService.updateEnquiry(enquiry.id, { ...enquiry, status }).subscribe(() => this.loadData());
        }
    }
}
