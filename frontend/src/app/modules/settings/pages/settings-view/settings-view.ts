import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Save, School, Globe, Bell, ShieldCheck, User, Camera, Calendar } from 'lucide-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-settings-view',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './settings-view.html',
    styleUrls: ['./settings-view.css']
})
export class SettingsViewComponent {
    readonly Save = Save;
    readonly School = School;
    readonly Globe = Globe;
    readonly Bell = Bell;
    readonly ShieldCheck = ShieldCheck;
    readonly User = User;
    readonly Camera = Camera;
    readonly Calendar = Calendar;

    activeTab = 'general';

    constructor(private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            if (params['tab']) {
                this.activeTab = params['tab'];
            }
        });
    }

    schoolInfo = {
        name: 'Modern International School',
        address: '123 Education Lane, Knowledge City',
        phone: '+1 234 567 8900',
        email: 'contact@modernschool.edu',
        website: 'www.modernschool.edu',
        logo: 'S'
    };

    profileInfo = {
        name: 'Administrator',
        role: 'Super Admin',
        email: 'admin@schoolerp.com',
        phone: '+1 987 654 3210'
    };

    systemPrefs = {
        timezone: 'UTC +5:30',
        language: 'English',
        academicYear: '2025-26',
        notifications: true
    };

    onSave() {
        alert('Settings saved successfully!');
    }
}
