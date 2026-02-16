import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DiscussionService, Thread, Reply } from '../../services/discussion.service';

@Component({
    selector: 'app-thread-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
    templateUrl: './thread-detail.component.html',
    styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit {
    thread: Thread | null = null;
    replies: Reply[] = [];
    newReplyContent = '';
    loading = true;
    submitting = false;

    constructor(
        private route: ActivatedRoute,
        private discussionService: DiscussionService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadThread(+id);
        }
    }

    loadThread(id: number) {
        this.discussionService.getThread(id).subscribe({
            next: (thread) => {
                this.thread = thread;
                this.loadReplies(id);
                // Increment view count
                this.discussionService.incrementView(id).subscribe();
            },
            error: (err) => {
                console.error('Error loading thread:', err);
                this.loading = false;
            }
        });
    }

    loadReplies(threadId: number) {
        this.discussionService.getReplies(threadId).subscribe({
            next: (replies) => {
                this.replies = replies;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading replies:', err);
                this.loading = false;
            }
        });
    }

    postReply() {
        if (!this.thread || !this.newReplyContent.trim()) return;

        this.submitting = true;
        this.discussionService.createReply({
            thread: this.thread.id,
            content: this.newReplyContent
        }).subscribe({
            next: (reply) => {
                this.replies.push(reply); // Optimistic update
                this.newReplyContent = '';
                this.submitting = false;
                // Reload to be safe and get proper sorting if needed
                if (this.thread) this.loadReplies(this.thread.id);
            },
            error: (err) => {
                console.error('Error posting reply:', err);
                this.submitting = false;
                alert('Failed to post reply.');
            }
        });
    }
}
