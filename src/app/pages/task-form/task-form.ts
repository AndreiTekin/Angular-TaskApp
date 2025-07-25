import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { NewTask } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrls: ['./task-form.css'],
  templateUrl: './task-form.html',
})
export class TaskForm {
  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  isSubmitting = false;
  errorMessage: string | null = null;

  get titleControl(): AbstractControl | null {
    return this.taskForm.get('title');
  }

  constructor(private taskService: TaskService, private router: Router) {}

  onSubmit() {
    if (this.taskForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const newTask: NewTask = {
        title: this.taskForm.value.title!,
        description: this.taskForm.value.description!,
        completed: false,
      };

      this.taskService.createTask(newTask).subscribe({
        next: (createdTask) => {
          this.isSubmitting = false;
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = 'Failed to create task. Please try again.';
        },
      });
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }
}
