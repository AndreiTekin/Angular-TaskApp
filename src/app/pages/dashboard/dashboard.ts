import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { RouterLink } from '@angular/router';
import { Task } from '../../models/task.model';
import { User } from '../../models/auth.model';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <div class="welcome-section">
          <h1>Welcome back, {{ user?.name || user?.email }}!</h1>
          <p>Here's your task overview</p>
        </div>
        
      </div>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>{{ totalTasks }}</h3>
          <p>Total Tasks</p>
        </div>
        <div class="stat-card">
          <h3>{{ completedTasks }}</h3>
          <p>Completed</p>
        </div>
        <div class="stat-card">
          <h3>{{ pendingTasks }}</h3>
          <p>Pending</p>
        </div>
      </div>
      
      <div class="dashboard-actions">
        <a routerLink="/tasks" class="action-btn primary">View All Tasks</a>
        <a routerLink="/tasks/new" class="action-btn secondary">Create New Task</a>
      </div>
      
      <div class="recent-tasks">
        <h2>Recent Tasks</h2>
        @if (recentTasks.length > 0) {
          <div class="task-list">
            @for (task of recentTasks; track task) {
              <div class="task-item">
                <h4>{{ task.title }}</h4>
                <p>{{ task.description }}</p>
                <span class="task-status" [class.completed]="task.completed">
                  {{ task.completed ? 'Completed' : 'Pending' }}
                </span>
              </div>
            }
          </div>
        } @else {
          <p class="no-tasks">No tasks yet. <a routerLink="/tasks/new">Create your first task!</a></p>
        }
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  user: User | null = null;
  tasks: Task[] = [];
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  recentTasks: Task[] = [];
  
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    // Subscribe to user
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
    this.subscriptions.add(userSub);

    // Load tasks initially
    this.loadTasks();

    // Refresh tasks every 2 seconds to catch changes
    const refreshSub = interval(2000).subscribe(() => {
      this.loadTasks();
    });
    this.subscriptions.add(refreshSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

loadTasks(): void {
  this.taskService.getAllTasks().subscribe({
    next: (tasks) => {
      this.tasks = tasks;
      this.calculateStats();
      console.log('📊 Dashboard refreshed - Stats:', {
        total: this.totalTasks,
        completed: this.completedTasks,
        pending: this.pendingTasks
      });
    },
    error: (error) => {
      console.error('Error loading tasks:', error);
    }
  });
}

  private calculateStats(): void {
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter(task => task.completed === true).length;
    this.pendingTasks = this.totalTasks - this.completedTasks;
    this.recentTasks = this.tasks.slice(0, 5);
  }

  logout(): void {
    this.authService.logout();
  }
}