import { Task } from './models/task.model';
import { User } from './models/auth.model';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true, 
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './app.html',
    styleUrls: ['./app.css']
})
export class App implements OnInit {
    protected title = 'MyTaskManager';
    tasks: Task[] = [];
    currentUser: User | null = null;
    isAuthenticated = false;

    constructor(
        private taskService: TaskService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });

        this.authService.isAuthenticated$.subscribe(isAuth => {
            this.isAuthenticated = isAuth;
            if (isAuth) {
                this.tasks = this.taskService.getTasks();
            }
        });
    }
    
    navigateToTasks() {
        this.router.navigate(['/tasks']);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}