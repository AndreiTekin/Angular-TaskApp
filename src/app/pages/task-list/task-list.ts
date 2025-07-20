import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router, RouterLink } from '@angular/router';
import { ErrorMessage } from '../../components/error-message/error-message';
import { TaskCard } from '../../components/task-card/task-card';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [RouterLink, ErrorMessage, TaskCard],
  template: `
    <div class="task-list">
      <div class="header-row">
        <h2>My Tasks</h2>
        <a routerLink="/tasks/new" class="btn btn-add">Add New Task</a>
      </div>          
      <app-error-message [message]="errorMessage"></app-error-message>
      <div class="task-grid">
        @for (task of tasks; let i = $index; track task.id || i) {
          <app-task-card 
            [task]="task" 
            [index]="i"
            (complete)="completeTask($event)"
            (edit)="editTask($event)"
            (view)="viewTask($event)">
          </app-task-card>
        } @empty {
          <div class="empty-state">
            <p>No tasks available. Add your first task!</p>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./task-list.css']
})
export class TaskList implements OnInit {
  tasks: Task[] = [];
  errorMessage: string | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

loadTasks() {
  console.log('🔄 TaskList - Loading tasks...');
  this.taskService.getAllTasks().subscribe({
    next: (tasks) => {
      console.log('📥 TaskList - Received tasks:', tasks);
      console.log('📥 TaskList - Tasks length:', tasks.length);
      this.tasks = tasks;
      this.errorMessage = null;
    },
    error: (error) => {
      console.error('Error loading tasks:', error);
      this.errorMessage = 'Failed to load tasks';
    }
  });
}

completeTask(index: number) {
  console.log('🔥 TaskList - completeTask called with index:', index);
  console.log('🔥 Available tasks:', this.tasks);
  
  const task = this.tasks[index];
  console.log('🔥 Found task:', task);
  
  if (task && task.id) {
    console.log('🔥 Completing task with ID:', task.id);
    this.taskService.completeTask(task.id.toString()).subscribe({
      next: (completedTask) => {
        console.log('✅ Task completed successfully:', completedTask);
        this.loadTasks(); // Reload to show updated stats
      },
      error: (error) => {
        console.error('❌ Error completing task:', error);
        this.errorMessage = 'Failed to complete task';
      }
    });
  } else {
    console.log('❌ Task not found or missing ID');
  }
}

editTask(event: { task: Task, index: number }) {
  const { task, index } = event;
  this.router.navigate(['/tasks', index, 'edit']);
}

viewTask(event: { task: Task, index: number }) {
  const { task, index } = event;
  this.router.navigate(['/tasks', index]);
}
}