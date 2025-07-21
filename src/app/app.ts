import { Task } from './models/task.model';
import { User } from './models/auth.model';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected title = 'MyTaskManager';
  tasks: Task[] = [];
  currentUser: User | null = null;
  isAuthenticated = false;
  mobileMenuOpen = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        // Load tasks from server initially
        this.taskService.getAllTasks().subscribe({
          next: (tasks) => {
            console.log('✅ Tasks loaded successfully:', tasks);
          },
          error: (error) => {
            console.error('❌ Failed to load tasks:', error);
          },
        });

        // Subscribe to real-time task updates
        this.taskService.tasks$.subscribe((tasks) => {
          console.log('🔄 Tasks updated:', tasks.length, 'tasks');
          this.tasks = tasks;
        });
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  navigateToDashBoard() {
    this.router.navigate(['/dashboard']);
    this.mobileMenuOpen = false;
  }

  navigateToTasks() {
    this.router.navigate(['/tasks']);
    this.mobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
