import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LmsService, Lesson } from '../../services/lms.service';
import { LucideAngularModule, BookOpen, ChevronRight, PlayCircle, FileText } from 'lucide-angular';

@Component({
    selector: 'app-lesson-list',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './lesson-list.html',
    styleUrls: ['./lesson-list.css']
})
export class LessonListComponent implements OnInit {
    lessons: Lesson[] = [];
    readonly bookIcon = BookOpen;
    readonly arrowIcon = ChevronRight;
    readonly videoIcon = PlayCircle;
    readonly pdfIcon = FileText;

    constructor(private lmsService: LmsService) { }

    ngOnInit(): void {
        this.lmsService.getLessons().subscribe(data => {
            this.lessons = data;
        });
    }
}
