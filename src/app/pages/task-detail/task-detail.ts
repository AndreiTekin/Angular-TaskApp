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
          this.task = task;
        },
        error: () => {
          this.task = undefined;
        },
      });
    }
  }
  
  goBack() {
    this.router.navigate(['/tasks']);
  }

  editTask() {
    if (this.task && this.task.id) {
      this.router.navigate(['/tasks', this.task.id, 'edit']);
    }
  }
}
