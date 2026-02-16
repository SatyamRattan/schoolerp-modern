import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Bell, Calendar, Info, AlertTriangle, CheckCircle, Search, Plus, Trash2, Edit2 } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-notices-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    templateUrl: './notices-list.html',
    styleUrls: ['./notices-list.css']
})
export class NoticesListComponent {
    readonly Bell = Bell;
    readonly Calendar = Calendar;
    readonly Info = Info;
    readonly AlertTriangle = AlertTriangle;
    readonly CheckCircle = CheckCircle;
    readonly Search = Search;
    readonly Plus = Plus;
    readonly Trash = Trash2;
    readonly Edit = Edit2;

    searchQuery = '';

    notices = [
        {
            id: 1,
            title: 'Summer Vacation Announcement',
            content: 'The school will remain closed from June 1st to July 15th for the summer break.',
            date: '2026-02-15',
            type: 'info',
            sender: 'Principal Office'
        },
        {
            id: 2,
            title: 'Annual Sports Day Postponed',
            content: 'Due to unexpected weather forecasts, the Sports Day is moved to next Saturday.',
            date: '2026-02-14',
            type: 'warning',
            sender: 'Sports Department'
        },
        {
            id: 3,
            title: 'New Library Policy',
            content: 'Students can now borrow up to 5 books at a time for a duration of 14 days.',
            date: '2026-02-12',
            type: 'success',
            sender: 'Library Admin'
        },
        {
            id: 4,
            title: 'Parent-Teacher Meeting',
            content: 'Scheduled for the upcoming Friday to discuss the mid-term progress of students.',
            date: '2026-02-10',
            type: 'info',
            sender: 'Academic Coordinator'
        }
    ];

    get filteredNotices() {
        return this.notices.filter(n =>
            n.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            n.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    getBadgeClass(type: string) {
        switch (type) {
            case 'warning': return 'bg-warning-light text-warning';
            case 'success': return 'bg-success-light text-success';
            default: return 'bg-info-light text-info';
        }
    }

    getIcon(type: string) {
        switch (type) {
            case 'warning': return this.AlertTriangle;
            case 'success': return this.CheckCircle;
            default: return this.Info;
        }
    }

    showNoticeDetail(notice: any) {
        alert(`Title: ${notice.title}\n\nContent: ${notice.content}\n\nPosted by: ${notice.sender}`);
    }

    addNotice() {
        const title = prompt('Enter Notice Title:');
        if (!title) return;

        const content = prompt('Enter Notice Content:');
        if (!content) return;

        const newId = this.notices.length + 1;
        this.notices.unshift({
            id: newId,
            title: title,
            content: content,
            date: new Date().toISOString().split('T')[0],
            type: 'info',
            sender: 'Administrator'
        });
    }

    deleteNotice(id: number, event: Event) {
        event.stopPropagation();
        if (confirm('Are you sure you want to delete this notice?')) {
            this.notices = this.notices.filter(n => n.id !== id);
        }
    }

    editNotice(notice: any, event: Event) {
        event.stopPropagation();
        const newTitle = prompt('Edit Title:', notice.title);
        if (newTitle) notice.title = newTitle;

        const newContent = prompt('Edit Content:', notice.content);
        if (newContent) notice.content = newContent;
    }
}
