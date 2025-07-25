import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-edit.html',
  styleUrls: ['./task-edit.css'],
})
export class TaskEdit implements OnInit {
  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  isSubmitting = false;
  errorMessage: string | null = null;
  private currentTask: Task | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    if (id) {
      this.taskService.getTaskById(id).subscribe({
        next: (task) => {
          this.currentTask = task;
          this.populateForm(task);
        },
        error: () => {
          this.errorMessage = 'Task not found';
        },
      });
    } else {
      this.errorMessage = 'No task ID provided';
    }
  }

  private populateForm(task: Task) {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || '',
    });
  }

  onSubmit() {
    if (this.taskForm.valid && this.currentTask) {
      this.isSubmitting = true;
      this.errorMessage = null;
      const updatedTask: Task = {
        id: this.currentTask!.id,
        title: this.taskForm.value.title!,
        description: this.taskForm.value.description || '',
        completed: this.currentTask!.completed,
      };
      const taskId = this.currentTask!.id;

      if (taskId) {
        this.taskService.updateTask(taskId, updatedTask).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: () => {
            this.errorMessage = 'Failed to update task. Please try again.';
            this.isSubmitting = false;
          },
        });
      } else {
        this.errorMessage = 'Task ID not found';
        this.isSubmitting = false;
      }
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }
}
