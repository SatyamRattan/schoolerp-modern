import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { DiscussionService, Thread } from '../../services/discussion.service';

@Component({
    selector: 'app-thread-list',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './thread-list.component.html',
    styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent implements OnInit {
    threads: Thread[] = [];
    loading = false;

    constructor(private discussionService: DiscussionService) { }

    ngOnInit() {
        this.loadThreads();
    }

    loadThreads() {
        this.loading = true;
        this.discussionService.getThreads().subscribe({
            next: (data) => {
                this.threads = data.results || data; // Handle pagination structure
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading threads:', err);
                this.loading = false;
            }
        });
    }
}
