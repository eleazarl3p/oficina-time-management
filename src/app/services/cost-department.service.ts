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
}
