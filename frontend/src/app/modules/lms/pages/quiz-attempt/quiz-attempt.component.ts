import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LmsService, Quiz, QuizResult, Question } from '../../services/lms.service';
import { LucideAngularModule, ArrowLeft, CheckCircle, XCircle } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-quiz-attempt',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
    templateUrl: './quiz-attempt.html',
    styleUrls: ['./quiz-attempt.css']
})
export class QuizAttemptComponent implements OnInit {
    quiz: Quiz | null = null;
    questions: Question[] = [];
    answers: { [questionId: number]: number } = {}; // questionId: choiceId
    result: QuizResult | null = null;
    loading = true;
    submitting = false;

    readonly backIcon = ArrowLeft;
    readonly checkIcon = CheckCircle;
    readonly xIcon = XCircle;

    constructor(
        private route: ActivatedRoute,
        private lmsService: LmsService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = +params['id'];
            if (id) {
                this.lmsService.getQuiz(id).subscribe({
                    next: (data) => {
                        this.quiz = data;
                        this.questions = data.questions || [];
                        this.loading = false;
                    },
                    error: (err) => {
                        console.error(err);
                        this.loading = false;
                    }
                });
            }
        });
    }

    submitQuiz() {
        if (!this.quiz) return;
        this.submitting = true;

        this.lmsService.submitQuiz(this.quiz.id, this.answers).subscribe({
            next: (res) => {
                this.result = res;
                this.submitting = false;
            },
            error: (err) => {
                console.error(err);
                this.submitting = false;
                alert('Failed to submit quiz. Please try again.');
            }
        });
    }

    isAnswerSelected(questionId: number, choiceId: number): boolean {
        return this.answers[questionId] === choiceId;
    }

    selectAnswer(questionId: number, choiceId: number) {
        if (this.result) return; // Prevent changing after submission
        this.answers[questionId] = choiceId;
    }
}
