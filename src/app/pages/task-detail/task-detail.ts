import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [],
  templateUrl: './task-detail.html',
  styleUrls: ['./task-detail.css'],
})
export class TaskDetail implements OnInit {
  task: Task | undefined;
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
