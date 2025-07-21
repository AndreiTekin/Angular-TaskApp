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

  onDeleteTask(index: number) {
    const taskToDelete = this.tasks[index];
    if (taskToDelete?.id) {
      this.taskService.deleteTask(taskToDelete.id.toString()).subscribe({
        next: () => {
          this.tasks.splice(index, 1);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        },
      });
    } else {
      console.error('Task or task ID not found');
    }
  }

  completeTask(index: number) {
    const task = this.tasks[index];
    if (task && task.id) {
      this.taskService.completeTask(task.id.toString()).subscribe({
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

  editTask(event: { index: number }) {
    this.router.navigate(['/tasks', event.index, 'edit']);
  }
  newTask() {
    this.router.navigate(['/tasks/new']);
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }
  viewTask(event: { index: number }) {
    this.router.navigate(['/tasks', event.index]);
  }
}
