import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.css']
})
export class TaskCard {
  @Input() task!: Task;
  @Input() index!: number;
  
  @Output() complete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<{ task: any, index: number }>();
  @Output() view = new EventEmitter<{ task: any, index: number }>();
  @Output() delete = new EventEmitter<number>(); 

  markComplete() {
    this.complete.emit(this.index);
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.delete.emit(this.index); 
    }
  }

  onEdit() {
    this.edit.emit({ task: this.task, index: this.index });
  }

  onView() {
    this.view.emit({ task: this.task, index: this.index });
  }
}