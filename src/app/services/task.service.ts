import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  // getAllTasks() {
  //   return this.http.get(`${this.baseUrl}task`).pipe((res: any) => {
  //     console.log('res => : ', res);
  //     return res;
  //   });
  // }
  getAllTasks() {
    return this.http.get(`${this.baseUrl}task`, { observe: 'response' }).pipe(
      tap((response) => {
        console.log('Status code in service:', response.status);
        // You can add custom logic here
      }),
      map((response) => response.body) // Return just the body if needed
    );
  }

  createTasks(task: any) {
    return this.http.post(`${this.baseUrl}task`, task);
  }

  updateTask(id: number, task: any) {
    return this.http.patch(`${this.baseUrl}task/${id}`, task);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}task/${id}`);
  }

  review(id: number, approve: boolean) {
    return this.http.post(
      `${this.baseUrl}task/review/${id}?approve=${approve}`,
      {}
    );
  }
}

// checkOverlap(newTask: Task, existingTasks: Task[]): boolean {
//   const newStart = new Date(newTask.start_time).getTime();
//   const newEnd = new Date(newTask.end_time).getTime();

//   return existingTasks.some(task => {
//     if (task._id === newTask._id || task.date !== newTask.date) return false;
//     const start = new Date(task.start_time).getTime();
//     const end = new Date(task.end_time).getTime();
//     return newStart < end && newEnd > start;
//   });
// }
