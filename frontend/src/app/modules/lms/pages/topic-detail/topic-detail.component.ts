import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LmsService, Topic } from '../../services/lms.service';
import { LucideAngularModule, ArrowLeft, PlayCircle, FileText, CheckCircle } from 'lucide-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-topic-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './topic-detail.html',
    styleUrls: ['./topic-detail.css']
})
export class TopicDetailComponent implements OnInit {
    topic: Topic | null = null;
    safeVideoUrl: SafeResourceUrl | null = null;
    readonly backIcon = ArrowLeft;
    readonly playIcon = PlayCircle;
    readonly fileIcon = FileText;
    readonly checkIcon = CheckCircle;

    constructor(
        private route: ActivatedRoute,
        private lmsService: LmsService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = +params['id'];
            if (id) {
                this.lmsService.getTopic(id).subscribe(data => {
                    this.topic = data;
                    if (this.topic.video_url) {
                        // Simple YouTube embed transformation if possible, otherwise use as is
                        // Ideally backend should provide embed URL or specific field
                        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.topic.video_url);
                    }
                });
            }
        });
    }
}
