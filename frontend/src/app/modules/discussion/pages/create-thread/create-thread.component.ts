import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DiscussionService } from '../../services/discussion.service';

@Component({
    selector: 'app-create-thread',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './create-thread.component.html',
    styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent {
    threadForm: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private discussionService: DiscussionService,
        private router: Router
    ) {
        this.threadForm = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(200)]],
            content: ['', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.threadForm.valid) {
            this.loading = true;
            this.discussionService.createThread(this.threadForm.value).subscribe({
                next: (response) => {
                    this.loading = false;
                    this.router.navigate(['/discussion', response.id]);
                },
                error: (err) => {
                    console.error('Error creating thread:', err);
                    this.loading = false;
                    alert('Failed to start discussion. Please try again.');
                }
            });
        }
    }
}
