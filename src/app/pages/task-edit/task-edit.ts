import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <h2>Edit Task</h2>
      <form #taskForm="ngForm" (ngSubmit)="onSubmit()">
        <div>
          <label for="title">Title</label>
          <input 
            type="text" 
            id="title"
            name="title"
            [(ngModel)]="task.title"
            required
            #title="ngModel">
          @if (title.invalid && (title.dirty || title.touched)) {
            <div>Title is required</div>
          }
        </div>
        
        <div>
          <label for="description">Description</label>
          <textarea 
            id="description"
            name="description"
            [(ngModel)]="task.description"
            rows="4"></textarea>
        </div>
        
        <div>
          <button type="submit" [disabled]="taskForm.invalid">Update Task</button>
          <button type="button" (click)="cancel()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class TaskEdit {
  task: Task = { title: '', description: '' };
  taskIndex: number = -1;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const tasks = this.taskService.getTasks();
      this.taskIndex = parseInt(id, 10);
      if (tasks[this.taskIndex]) {
        
        this.task = { ...tasks[this.taskIndex] };
      }
    }
  }
  
  onSubmit() {
    if (this.taskIndex >= 0) {
      this.taskService.updateTask(this.taskIndex, this.task);
    }
    this.router.navigate(['/tasks']);
  }
  
  cancel() {
    this.router.navigate(['/tasks']);
  }
}