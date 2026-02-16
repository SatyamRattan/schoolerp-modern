import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeTableService, Period, TeacherAllocation } from '../../services/timetable.service';
import { StudentsService } from '../../../students/services/students';
import { AcademicService } from '../../../academic-masters/services/academic.service';
import { LucideAngularModule, Plus, Save } from 'lucide-angular';

@Component({
    selector: 'app-timetable-manage',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './timetable-manage.html'
})
export class TimeTableManageComponent implements OnInit {
    periods: Period[] = [];
    classes: any[] = [];
    sections: any[] = [];
    teachers: any[] = []; // You might need a TeacherService or fetch from existing endpoint
    subjects: any[] = [];

    selectedClass: number | null = null;
    selectedSection: number | null = null;

    // Grid: [dayIndex][periodIndex] = { subjectId, teacherId }
    scheduleGrid: any[][] = [];

    days = [
        { id: 0, name: 'Monday' },
        { id: 1, name: 'Tuesday' },
        { id: 2, name: 'Wednesday' },
        { id: 3, name: 'Thursday' },
        { id: 4, name: 'Friday' },
        { id: 5, name: 'Saturday' }
    ];

    readonly Plus = Plus;
    readonly Save = Save;

    constructor(
        private timetableService: TimeTableService,
        private studentsService: StudentsService,
        private academicService: AcademicService
    ) { }

    ngOnInit() {
        this.studentsService.getClasses().subscribe(data => this.classes = data);
        this.timetableService.getPeriods().subscribe(data => {
            this.periods = data;
            this.resetGrid();
        });
        // Fetch teachers/subjects - reusing academic service or similar
        this.academicService.getSubjects().subscribe(data => this.subjects = data);
        // Assuming we have a way to get teachers, for now using dummy or implement getTeachers in a service
        // this.academicService.getTeachers().subscribe(t => this.teachers = t);
    }

    onClassChange() {
        if (this.selectedClass) {
            this.studentsService.getSections(this.selectedClass).subscribe(data => this.sections = data);
        }
    }

    resetGrid() {
        this.scheduleGrid = this.days.map(() =>
            this.periods.map(() => ({ subject: null, teacher: null }))
        );
    }

    loadSchedule() {
        if (!this.selectedClass || !this.selectedSection) return;

        this.timetableService.getTimeTable(this.selectedClass, this.selectedSection).subscribe(data => {
            this.resetGrid();
            data.forEach(entry => {
                if (this.scheduleGrid[entry.day] && this.scheduleGrid[entry.day][this.periods.findIndex(p => p.id === entry.period)]) {
                    this.scheduleGrid[entry.day][this.periods.findIndex(p => p.id === entry.period)] = {
                        subject: entry.subject,
                        teacher: entry.teacher
                    };
                }
            });
        });
    }

    saveSchedule() {
        if (!this.selectedClass || !this.selectedSection) return;

        const entries: any[] = [];
        this.days.forEach((day, dayIndex) => {
            this.periods.forEach((period, periodIndex) => {
                const cell = this.scheduleGrid[dayIndex][periodIndex];
                if (cell.subject) {
                    entries.push({
                        class_obj: this.selectedClass,
                        section: this.selectedSection,
                        day: day.id,
                        period: period.id,
                        subject: cell.subject,
                        teacher: cell.teacher // Optional
                    });
                }
            });
        });

        this.timetableService.saveTimeTable(entries).subscribe({
            next: (res) => alert(`Schedule saved! Created: ${res.created}`),
            error: (err) => alert('Error saving: ' + JSON.stringify(err.error))
        });
    }
}
