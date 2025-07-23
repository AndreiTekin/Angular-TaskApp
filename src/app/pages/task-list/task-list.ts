import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { ErrorMessage } from '../../components/error-message/error-message';
import { TaskCard } from '../../components/task-card/task-card';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [ErrorMessage, TaskCard],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskList implements OnInit {
  tasks: Task[] = [];
  errorMessage: string | null = null;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.errorMessage = 'Failed to load tasks';
      },
    });
  }

  onDeleteTask(task: Task) {
    if (task?.id) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.errorMessage = 'Failed to delete task';
        },
      });
    } else {
      console.error('Task or task ID not found');
    }
  }

  completeTask(task: Task) {
    if (task && task.id) {
      this.taskService.completeTask(task.id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error completing task:', error);
          this.errorMessage = 'Failed to complete task';
        },
      });
    } else {
      console.log('Task not found or missing ID');
    }
  }

  editTask(task: Task) {
    this.router.navigate(['/tasks', task.id, 'edit']);
  }
  newTask() {
    this.router.navigate(['/tasks/new']);
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }
  viewTask(task: Task) {
    this.router.navigate(['/tasks', task.id]);
  }
}
