import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API_URL = 'http://localhost:3000/api/tasks';
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  
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
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // Get all tasks from API
  getAllTasks(): Observable<Task[]> {
    console.log('🔄 TaskService - Getting all tasks...');
    
    return this.http.get<Task[]>(this.API_URL, this.getHeaders()).pipe(
      tap(tasks => {
        console.log('✅ TaskService - Tasks loaded successfully:', tasks);
        this.tasks = tasks || [];
        this.tasksSubject.next([...this.tasks]);
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ TaskService - Error loading tasks:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        
        const errorMessage = this.getErrorMessage(error);
        this.errorSubject.next(errorMessage);
        return throwError(() => error);
      })
    );
  }

  // Create a new task
  createTask(task: Task): Observable<Task> {
    console.log('🔄 TaskService - Creating task:', task);
    
    return this.http.post<Task>(this.API_URL, task, this.getHeaders()).pipe(
      tap(newTask => {
        console.log('✅ TaskService - Task created successfully:', newTask);
        this.tasks.push(newTask);
        this.tasksSubject.next([...this.tasks]);
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ TaskService - Error creating task:', error);
        const errorMessage = this.getErrorMessage(error);
        this.errorSubject.next(errorMessage);
        return throwError(() => error);
      })
    );
  }

  // Update a task
  updateTask(id: string, task: Task): Observable<Task> {
    console.log('🔄 TaskService - Updating task:', id, task);
    
    return this.http.put<Task>(`${this.API_URL}/${id}`, task, this.getHeaders()).pipe(
      tap(updatedTask => {
        console.log('✅ TaskService - Task updated successfully:', updatedTask);
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.tasksSubject.next([...this.tasks]);
        }
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ TaskService - Error updating task:', error);
        const errorMessage = this.getErrorMessage(error);
        this.errorSubject.next(errorMessage);
        return throwError(() => error);
      })
    );
  }

  // Complete a task
  completeTask(id: string): Observable<Task> {
    console.log('🔄 TaskService - Completing task:', id);
    
    return this.http.patch<Task>(`${this.API_URL}/${id}/complete`, {}, this.getHeaders()).pipe(
      tap(completedTask => {
        console.log('✅ TaskService - Task completed successfully:', completedTask);
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = completedTask;
          this.tasksSubject.next([...this.tasks]);
        }
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ TaskService - Error completing task:', error);
        const errorMessage = this.getErrorMessage(error);
        this.errorSubject.next(errorMessage);
        return throwError(() => error);
      })
    );
  }

  // Delete a task
  deleteTask(id: string): Observable<void> {
    console.log('🔄 TaskService - Deleting task:', id);
    
    return this.http.delete<void>(`${this.API_URL}/${id}`, this.getHeaders()).pipe(
      tap(() => {
        console.log('✅ TaskService - Task deleted successfully');
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.tasksSubject.next([...this.tasks]);
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ TaskService - Error deleting task:', error);
        const errorMessage = this.getErrorMessage(error);
        this.errorSubject.next(errorMessage);
        return throwError(() => error);
      })
    );
  }

  // Get task by ID
  getTaskById(id: string): Observable<Task> {
    console.log('🔄 TaskService - Getting task by ID:', id);
    
    return this.http.get<Task>(`${this.API_URL}/${id}`, this.getHeaders()).pipe(
      tap(task => {
        console.log('✅ TaskService - Task retrieved successfully:', task);
        this.errorSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ TaskService - Error getting task:', error);
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

  // Local state management methods (for backwards compatibility)
  getTasks(): Task[] {
    return [...this.tasks];
  }

  getTask(index: number): Task | null {
    if (index < 0 || index >= this.tasks.length) {
      return null;
    }
    return { ...this.tasks[index] };
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
    console.log('🔄 TaskService - Testing server connection...');
    
    return this.http.get('http://localhost:3000/api/test').pipe(
      tap(response => {
        console.log('✅ TaskService - Server connection successful:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ TaskService - Server connection failed:', error);
        return throwError(() => error);
      })
    );
  }
}