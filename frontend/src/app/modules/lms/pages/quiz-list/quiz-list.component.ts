import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LmsService, Quiz } from '../../services/lms.service';
import { LucideAngularModule, GraduationCap, ChevronRight, Clock } from 'lucide-angular';

@Component({
    selector: 'app-quiz-list',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './quiz-list.html',
    styleUrls: ['./quiz-list.css']
})
export class QuizListComponent implements OnInit {
    quizzes: Quiz[] = [];
    readonly quizIcon = GraduationCap;
    readonly arrowIcon = ChevronRight;
    readonly clockIcon = Clock;

    constructor(private lmsService: LmsService) { }

    ngOnInit(): void {
        this.lmsService.getQuizzes().subscribe(data => {
            this.quizzes = data;
        });
    }
}
