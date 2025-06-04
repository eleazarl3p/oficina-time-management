import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class CostDepartmentService {
  http = inject(HttpClient);
  base_url = environment.baseUrl + 'cost-department/';

  get() {
    return this.http.get<Department[]>(this.base_url);
  }

  create(dep: Department) {
    return this.http.post(this.base_url, dep);
  }

  update(dep: Department) {
    return this.http.patch(this.base_url + dep._id, dep);
  }

  delete(id: number) {
    return this.http.delete(this.base_url + id);
  }
}
