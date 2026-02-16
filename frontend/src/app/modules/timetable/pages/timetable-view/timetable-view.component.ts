import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeTableService, Period, TimeTableEntry } from '../../services/timetable.service';
import { StudentsService } from '../../../students/services/students';
import { LucideAngularModule, Calendar, Clock } from 'lucide-angular';

@Component({
    selector: 'app-timetable-view',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './timetable-view.html'
})
export class TimeTableViewComponent implements OnInit {
    periods: Period[] = [];
    timetable: TimeTableEntry[] = [];
    classes: any[] = [];
    sections: any[] = [];

    selectedClass: number | null = null;
    selectedSection: number | null = null;
    loading = false;

    days = [
        { id: 0, name: 'Monday' },
        { id: 1, name: 'Tuesday' },
        { id: 2, name: 'Wednesday' },
        { id: 3, name: 'Thursday' },
        { id: 4, name: 'Friday' },
        { id: 5, name: 'Saturday' }
    ];

    // Icons
    readonly Calendar = Calendar;
    readonly Clock = Clock;

    constructor(
        private timetableService: TimeTableService,
        private studentsService: StudentsService
    ) { }

    ngOnInit() {
        this.loadInitialData();
    }

    loadInitialData() {
        this.studentsService.getClasses().subscribe(data => this.classes = data);
        this.timetableService.getPeriods().subscribe(data => this.periods = data);
    }

    onClassChange() {
        if (this.selectedClass) {
            this.studentsService.getSections(this.selectedClass).subscribe(data => this.sections = data);
        }
    }

    loadTimeTable() {
        if (!this.selectedClass || !this.selectedSection) return;

        this.loading = true;
        this.timetableService.getTimeTable(this.selectedClass, this.selectedSection).subscribe({
            next: (data) => {
                this.timetable = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    getEntry(dayId: number, periodId: number): TimeTableEntry | undefined {
        return this.timetable.find(t => t.day === dayId && t.period === periodId);
    }
}
