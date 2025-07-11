import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.css']
})
export class TaskCard {
  @Input() task!: Task;
  @Input() index: number = -1;
  
  @Output() complete = new EventEmitter<number>();
  
  markComplete() {
    if (this.index >= 0) {
      this.complete.emit(this.index);
    } else {
      alert(`Task "${this.task.title}" completed!`);
    }
  }
}