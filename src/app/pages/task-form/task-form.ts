import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model'; 

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div>
      <h2>Add New Task</h2>
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div>
          <label for="title">Title</label>
          <input id="title" type="text" formControlName="title">
          @if (titleControl && titleControl.invalid && titleControl.touched) {
            <div>Title is required</div>
          }
        </div>
        
        <div>
          <label for="description">Description</label>
          <textarea id="description" formControlName="description"></textarea>
        </div>
        <button type="submit" [disabled]="taskForm.invalid">Add Task</button>
        <button (click)="goBack()">Cancel</button>
          </form>
    </div>
  `
})
export class TaskForm {
  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('')
  });
  
  get titleControl(): AbstractControl | null {
    return this.taskForm.get('title');
  }
  
  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}
  
  onSubmit() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        title: this.taskForm.value.title || '',
        description: this.taskForm.value.description || ''
      };
      
      this.taskService.addTask(newTask);
      this.router.navigate(['/tasks']);
    }
  }

  
  goBack() {
    this.router.navigate(['/tasks']);
  }
}