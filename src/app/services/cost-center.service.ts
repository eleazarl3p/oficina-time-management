import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CostCenter } from '../models/const-center.model';

@Injectable({
  providedIn: 'root',
})
export class CostCenterService {
  http = inject(HttpClient);
  private base_url = environment.baseUrl + 'cost-center/';

  getCCs() {
    return this.http.get<CostCenter[]>(this.base_url);
  }

  create(cc: CostCenter) {
    return this.http.post(this.base_url, cc);
  }

  update(cc: CostCenter) {
    return this.http.patch(this.base_url + cc._id, cc);
  }

  delete(id: number) {
    return this.http.delete(this.base_url + id);
  }
}
