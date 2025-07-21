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
  templateUrl:'./dashboard.html' ,
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