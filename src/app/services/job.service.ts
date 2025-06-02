import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Job } from '../models/job.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  http = inject(HttpClient);
  url = `${environment.baseUrl}job`;
  getJobs() {
    return this.http.get<Job[]>(this.url);
  }

  create(job: Job) {
    return this.http.post(this.url, job);
  }

  update(job: Job) {
    return this.http.patch(`${this.url}/${job._id}`, job);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
