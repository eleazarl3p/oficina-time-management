import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  http = inject(HttpClient);
  base_url = environment.baseUrl + 'company/';

  get() {
    return this.http.get<Company[]>(this.base_url);
  }
  create(comp: Company) {
    return this.http.post(this.base_url, comp);
  }

  update(comp: Company) {
    return this.http.patch(this.base_url + comp._id, comp);
  }

  delete(id: number) {
    return this.http.delete(this.base_url + id);
  }
}
