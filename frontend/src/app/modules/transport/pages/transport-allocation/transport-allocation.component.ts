import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransportService, Route, Stop, TransportAllocation } from '../../services/transport.service';
import { StudentsService } from '../../../students/services/students';
import { LucideAngularModule, ExternalLink, Save } from 'lucide-angular';

@Component({
    selector: 'app-transport-allocation',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './transport-allocation.html'
})
export class TransportAllocationComponent implements OnInit {
    routes: Route[] = [];
    classes: any[] = [];
    sections: any[] = [];
    students: any[] = [];

    selectedClass: number | null = null;
    selectedSection: number | null = null;
    selectedRoute: number | null = null;

    currentAllocation: TransportAllocation = this.getEmptyAllocation();

    // Helper for stops dropdown
    availableStops: Stop[] = [];

    readonly ExternalLink = ExternalLink;
    readonly Save = Save;

    constructor(
        private transportService: TransportService,
        private studentsService: StudentsService
    ) { }

    ngOnInit() {
        this.transportService.getRoutes().subscribe(data => this.routes = data);
        this.studentsService.getClasses().subscribe(data => this.classes = data);
    }

    getEmptyAllocation(): TransportAllocation {
        return {
            student: 0,
            stop: 0,
            start_date: new Date().toISOString().split('T')[0],
            is_active: true
        };
    }

    onClassChange() {
        if (this.selectedClass) {
            this.studentsService.getSections(this.selectedClass).subscribe(data => this.sections = data);
        }
    }

    loadStudents() {
        if (!this.selectedClass) {
            alert('Please select a class first');
            return;
        }
        this.studentsService.getStudents(this.selectedClass, this.selectedSection || undefined).subscribe(data => {
            this.students = data;
        });
    }

    onRouteChange() {
        const route = this.routes.find(r => r.id == this.selectedRoute);
        this.availableStops = route?.stops || [];
    }

    assignTransport(studentId: number) {
        if (!this.selectedRoute || !this.currentAllocation.stop) {
            alert('Please select a route and stop');
            return;
        }

        const allocation: TransportAllocation = {
            ...this.currentAllocation,
            student: studentId,
            start_date: new Date().toISOString().split('T')[0]
        };

        this.transportService.createAllocation(allocation).subscribe({
            next: () => alert('Transport assigned successfully!'),
            error: (err) => alert('Error assigning transport')
        });
    }
}
