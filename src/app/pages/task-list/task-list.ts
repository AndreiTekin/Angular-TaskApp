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
  templateUrl: './task-list.html' ,
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

onDeleteTask(index: number) {
  console.log('Parent - Deleting task at index:', index);
  
  // Get the task to delete
  const taskToDelete = this.tasks[index];
  
  // Check if task and id exist
  if (taskToDelete && taskToDelete.id !== undefined) {
    // Convert id to string to match service method signature
    this.taskService.deleteTask(taskToDelete.id.toString()).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        // Remove from local array
        this.tasks.splice(index, 1);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  } else {
    console.error('Task or task ID not found');
  }
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

newTask(){
  this.router.navigate(['/tasks/new'])
}

goBack() {
    this.router.navigate(['/dashboard']);
  }

viewTask(event: { task: Task, index: number }) {
  const { task, index } = event;
  this.router.navigate(['/tasks', index]);
}
}