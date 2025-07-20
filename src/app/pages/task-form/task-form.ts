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
        
        @if (errorMessage) {
          <div style="color: red;">{{ errorMessage }}</div>
        }
        
        <button type="submit" [disabled]="taskForm.invalid || isSubmitting">
          {{ isSubmitting ? 'Adding...' : 'Add Task' }}
        </button>
        <button type="button" (click)="goBack()">Cancel</button>
      </form>
    </div>
  `
})
export class TaskForm {
  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('')
  });
  
  
  isSubmitting = false;
  errorMessage: string | null = null;
  
  get titleControl(): AbstractControl | null {
    return this.taskForm.get('title');
  }
  
  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}
  
  onSubmit() {
    if (this.taskForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;
      
      const newTask: Task = {
        title: this.taskForm.value.title || '',
        description: this.taskForm.value.description || '',
        completed: false
      };
      
      console.log('Submitting task:', newTask);
      
      this.taskService.createTask(newTask).subscribe({
        next: (createdTask) => {
          console.log('Task created successfully:', createdTask);
          this.isSubmitting = false;
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.isSubmitting = false;
          this.errorMessage = 'Failed to create task. Please try again.';
        }
      });
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }
}