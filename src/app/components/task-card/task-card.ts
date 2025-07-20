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

markComplete() {
  console.log('TaskCard - Complete clicked for task:', this.task.title);
  this.complete.emit(this.index);
}

onEdit() {
  console.log('TaskCard - Edit clicked for task:', this.task.title, 'at index:', this.index);
  this.edit.emit({ task: this.task, index: this.index });
}

onView() {
  console.log('TaskCard - View clicked for task:', this.task.title, 'at index:', this.index);
  this.view.emit({ task: this.task, index: this.index });
}}