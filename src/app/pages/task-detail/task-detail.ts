import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [],
  template: `
    <div class="container">
      @if (task) {
        <div class="card">
          <h1>{{ task.title }}</h1>
          <p>{{ task.description }}</p>
          <div class="status">
            Status: <span [class]="task.completed ? 'completed' : 'pending'">
              {{ task.completed ? 'Completed' : 'Pending' }}
            </span>
          </div>
          
          <div class="buttons">
            <button class="edit-btn" (click)="editTask()">Edit</button>
            <button class="back-btn" (click)="goBack()">Back</button>
          </div>
        </div>
      } @else {
        <div class="card">
          <p>Task not found</p>
          <button class="back-btn" (click)="goBack()">Back</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
    }
    
    .card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #333;
      margin-bottom: 1rem;
    }
    
    p {
      color: #666;
      line-height: 1.5;
      margin-bottom: 1rem;
    }
    
    .status {
      margin: 1rem 0;
      font-weight: bold;
    }
    
    .completed {
      color: #28a745;
    }
    
    .pending {
      color: #ffc107;
    }
    
    .buttons {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
    }
    
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .edit-btn {
      background: #007bff;
      color: white;
    }
    
    .edit-btn:hover {
      background: #0056b3;
    }
    
    .back-btn {
      background: #6c757d;
      color: white;
    }
    
    .back-btn:hover {
      background: #545b62;
    }
  `]
})
export class TaskDetail implements OnInit {
  task: any;
  private taskIndex: number | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskIndex = parseInt(id, 10);
      const tasks = this.taskService.getTasks();
      this.task = tasks[this.taskIndex];
    }
  }
  
  goBack() {
    this.router.navigate(['/tasks']);
  }
  
  editTask() {
    if (this.taskIndex !== null) {
      this.router.navigate(['/tasks', this.taskIndex, 'edit']);
    }
  }
}