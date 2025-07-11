import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [
    { title: 'Learn TypeScript', description: 'This project was difficult!' },
    { title: 'Review Resume', description: 'Make stylistic changes' },
		{ title: 'Utilize CSS & HTML', description: 'Make this page look presentable.' }
  ];
  
  
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();
  
  getTasks(): Task[] {
    return this.tasks;
  }
  
  getTask(index: number): Task | null {
    if (index < 0 || index >= this.tasks.length) {
      this.errorSubject.next(`Task with index ${index} not found`);
      return null;
    }
    return this.tasks[index];
  }
  
  addTask(task: Task): boolean {
    try {
      if (!task.title) {
        this.errorSubject.next('Task title is required');
        return false;
      }
      
      this.tasks.push(task);
      this.errorSubject.next(null); 
      return true;
    } catch (error) {
      this.errorSubject.next('Error adding task: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    }
  }
  
  updateTask(index: number, updatedTask: Task): boolean {
    try {
      if (index < 0 || index >= this.tasks.length) {
        this.errorSubject.next(`Cannot update: Task with index ${index} not found`);
        return false;
      }
      
      if (!updatedTask.title) {
        this.errorSubject.next('Task title is required');
        return false;
      }
      
      this.tasks[index] = { ...updatedTask };
      this.errorSubject.next(null); 
      return true;
    } catch (error) {
      this.errorSubject.next('Error updating task: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    }
  }
  
  deleteTask(index: number): boolean {
    try {
      if (index < 0 || index >= this.tasks.length) {
        this.errorSubject.next(`Cannot delete: Task with index ${index} not found`);
        return false;
      }
      
      this.tasks.splice(index, 1);
      this.errorSubject.next(null);
      return true;
    } catch (error) {
      this.errorSubject.next('Error deleting task: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    }
  }
  
  clearError() {
    this.errorSubject.next(null);
  }
}