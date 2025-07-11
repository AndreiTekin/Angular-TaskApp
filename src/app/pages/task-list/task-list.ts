import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { RouterLink } from '@angular/router';
import { ErrorMessage } from '../../components/error-message/error-message';
import { TaskCard } from '../../components/task-card/task-card';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [RouterLink, ErrorMessage, TaskCard],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <div class="task-list">
      <div class="header-row">
        <h2>My Tasks</h2>
        <a routerLink="/tasks/new" class="btn btn-add">Add New Task</a>
        </div>          
          <app-error-message [message]="errorMessage"></app-error-message>
          <div class="task-grid">
            @for (t of tasks; let i = $index; track t) {
              <app-task-card 
                [task]="t" 
                [index]="i"
                (complete)="completeTask($event)">
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

export class TaskList {
  tasks: any[] = [];
  errorMessage: string | null = null;

  constructor(private taskService: TaskService) {
    this.tasks = this.taskService.getTasks();
    this.taskService.error$.subscribe(error => {
    this.errorMessage = error;
        });
  }

  completeTask(index: number) {
    if (this.taskService.deleteTask(index)) {
      this.tasks = this.taskService.getTasks();
    }
  }
}