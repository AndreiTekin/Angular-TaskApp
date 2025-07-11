import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-detail',
  template: `
    @if (task) {
      <div>
        <h2>{{ task.title }}</h2>
        <p>{{ task.description }}</p>
        <button (click)="goBack()">Back</button>
      </div>
    }
  `
})
export class TaskDetail {
  task: any;
  
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const tasks = this.taskService.getTasks();
      this.task = tasks[parseInt(id, 10)];
    }
  }
  
  goBack() {
    window.history.back();
  }
}