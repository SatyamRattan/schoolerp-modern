import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Bell, User } from 'lucide-angular';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './header.html',
    styleUrls: ['./header.css']
})
export class HeaderComponent {
    readonly searchIcon = Search;
    readonly bellIcon = Bell;
    readonly userIcon = User;
}
