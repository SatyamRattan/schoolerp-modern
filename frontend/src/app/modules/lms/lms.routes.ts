import { Routes } from '@angular/router';
import { LmsComponent } from './lms.component';
import { LessonListComponent } from './pages/lesson-list/lesson-list.component';
import { TopicDetailComponent } from './pages/topic-detail/topic-detail.component';
import { QuizListComponent } from './pages/quiz-list/quiz-list.component';
import { QuizAttemptComponent } from './pages/quiz-attempt/quiz-attempt.component';

export const LmsRoutes: Routes = [
    {
        path: '',
        component: LmsComponent,
        children: [
            { path: 'lessons', component: LessonListComponent },
            { path: 'topic/:id', component: TopicDetailComponent },
            { path: 'quizzes', component: QuizListComponent },
            { path: 'quiz/:id', component: QuizAttemptComponent },
            { path: '', redirectTo: 'lessons', pathMatch: 'full' }
        ]
    }
];
