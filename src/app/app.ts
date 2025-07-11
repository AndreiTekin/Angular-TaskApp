import { Task } from './models/task.model';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TaskCard } from "./components/task-card/task-card";
import { TaskService } from './services/task.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true, 
    imports: [RouterOutlet, RouterLink, RouterLinkActive, TaskCard],
    templateUrl: './app.html',
    styleUrls: ['./app.css']
})
export class App {
    protected title = 'MyTaskManager';
    tasks: Task[] = [];

    constructor(
        private taskService: TaskService,
        private router: Router
    ) {
        this.tasks = this.taskService.getTasks();
    }
    
    
    navigateToTasks() {
        this.router.navigate(['/tasks']);
    }
}