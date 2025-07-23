import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Task, NewTask } from '../models/task.model';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API_URL = `${environment.apiUrl}/tasks`;
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Helper method to get headers with token
  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found in localStorage');
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }

  // Get all tasks from API
  getAllTasks(): Observable<Task[]> {
    console.log('Getting all tasks...');
    return this.http.get<Task[]>(this.API_URL, this.getHeaders()).pipe(
      tap((tasks) => {
        console.log('Tasks loaded successfully:', tasks);
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error loading tasks:', error);
        const errorMessage = this.getErrorMessage(error);
        this.errorSubject.next(errorMessage);
        return throwError(() => error);
      })
    );
  }

  // Create a new task
  createTask(task: NewTask): Observable<Task> {
    console.log('Creating task:', task);

    return this.http.post<Task>(this.API_URL, task, this.getHeaders()).pipe(
      tap((newTask) => {
        console.log('Task created successfully:', newTask);
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating task:', error);
        const errorMessage = this.getErrorMessage(error);
        this.errorSubject.next(errorMessage);
        return throwError(() => error);
      })
    );
  }

  // Update a task
  updateTask(id: number, task: Task): Observable<Task> {
    console.log('Updating task:', id, task);

    return this.http
      .put<Task>(`${this.API_URL}/${id}`, task, this.getHeaders())
      .pipe(
        tap((updatedTask) => {
          console.log('Task updated successfully:', updatedTask);
          this.errorSubject.next(null);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error updating task:', error);
          const errorMessage = this.getErrorMessage(error);
          this.errorSubject.next(errorMessage);
          return throwError(() => error);
        })
      );
  }

  // Complete a task
  completeTask(id: number): Observable<Task> {
    console.log('Completing task:', id);
    return this.http
      .patch<Task>(`${this.API_URL}/${id}/complete`, {}, this.getHeaders())
      .pipe(
        tap((completedTask) => {
          console.log('Task completed successfully:', completedTask);
          this.errorSubject.next(null);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error completing task:', error);
          const errorMessage = this.getErrorMessage(error);
          this.errorSubject.next(errorMessage);
          return throwError(() => error);
        })
      );
  }

  // Delete a task
  deleteTask(id: number): Observable<void> {
    console.log('TaskService - Deleting task:', id);
    return this.http
      .delete<void>(`${this.API_URL}/${id}`, this.getHeaders())
      .pipe(
        tap(() => {
          console.log('Task deleted successfully');
          this.errorSubject.next(null);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error deleting task:', error);
          const errorMessage = this.getErrorMessage(error);
          this.errorSubject.next(errorMessage);
          return throwError(() => error);
        })
      );
  }

  // Get task by ID
  getTaskById(id: number): Observable<Task> {
    console.log('Getting task by ID:', id);

    return this.http.get<Task>(`${this.API_URL}/${id}`, this.getHeaders()).pipe(
      tap((task) => {
        console.log('Task retrieved successfully:', task);
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error getting task:', error);
        const errorMessage = this.getErrorMessage(error);
        this.errorSubject.next(errorMessage);
        return throwError(() => error);
      })
    );
  }

  // Helper method to format error messages
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Unable to connect to server. Please check if the server is running.';
    }
    if (error.status === 401) {
      return 'Authentication failed. Please login again.';
    }
    if (error.status === 403) {
      return 'Access denied. You do not have permission to perform this action.';
    }
    if (error.status === 404) {
      return 'Resource not found.';
    }
    if (error.status === 500) {
      return 'Server error. Please try again later or contact support.';
    }
    return error.error?.message || `An error occurred (${error.status})`;
  }

  // Clear error state
  clearError(): void {
    this.errorSubject.next(null);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Test server connection
  testConnection(): Observable<any> {
    console.log('Testing server connection...');

    return this.http.get(`${environment.apiUrl}/test`).pipe(
      tap((response) => {
        console.log('Server connection successful:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Server connection failed:', error);
        return throwError(() => error);
      })
    );
  }
}
