import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API_URL = 'http://localhost:3000/api/tasks';
  private tasks: Task[] = [];
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API_URL).pipe(
      tap(tasks => {
        console.log('Tasks loaded from API:', tasks);
        this.tasks = tasks;
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error loading tasks:', error);
        this.errorSubject.next('Failed to load tasks from server');
        return throwError(() => error);
      })
    );
  }
  completeTask(id: string): Observable<Task> {
  return this.http.patch<Task>(`${this.API_URL}/${id}/complete`, {}).pipe(
    tap(completedTask => {
      const index = this.tasks.findIndex(t => (t as any).id === id);
      if (index !== -1) {
        this.tasks[index] = completedTask;
      }
      this.errorSubject.next(null);
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error completing task:', error);
      this.errorSubject.next('Failed to complete task');
      return throwError(() => error);
    })
  );
}

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.API_URL, task).pipe(
      tap(newTask => {
        this.tasks.push(newTask);
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating task:', error);
        this.errorSubject.next('Failed to create task');
        return throwError(() => error);
      })
    );
  }

  updateTaskAPI(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, task).pipe(
      tap(updatedTask => {
        const index = this.tasks.findIndex(t => (t as any).id === id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating task:', error);
        this.errorSubject.next('Failed to update task');
        return throwError(() => error);
      })
    );
  }

  deleteTaskAPI(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.tasks = this.tasks.filter(t => (t as any).id !== id);
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting task:', error);
        this.errorSubject.next('Failed to delete task');
        return throwError(() => error);
      })
    );
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  getTask(index: number): Task | null {
    if (index < 0 || index >= this.tasks.length) {
      return null;
    }
    return { ...this.tasks[index] };
  }

  updateTask(index: number, updatedTask: Task): boolean {
    if (index < 0 || index >= this.tasks.length || !updatedTask.title) {
      return false;
    }
    this.tasks[index] = { ...updatedTask };
    return true;
  }

  deleteTask(index: number): boolean {
    if (index < 0 || index >= this.tasks.length) {
      return false;
    }
    this.tasks.splice(index, 1);
    return true;
  }

  clearError() {
    this.errorSubject.next(null);
  }
}