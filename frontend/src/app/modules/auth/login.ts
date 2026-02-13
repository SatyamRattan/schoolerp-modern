import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, LogIn, Lock, User } from 'lucide-angular';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';
    loading = false;

    readonly loginIcon = LogIn;
    readonly lockIcon = Lock;
    readonly userIcon = User;

    constructor(private auth: AuthService, private router: Router) {
        if (this.auth.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
    }

    onLogin() {
        this.loading = true;
        this.error = '';
        this.auth.login(this.username, this.password).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.error = 'Invalid credentials. Please try again.';
                this.loading = false;
            }
        });
    }
}
