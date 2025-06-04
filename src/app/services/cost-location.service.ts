import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CostLocation } from '../models/cost-location.model';

@Injectable({
  providedIn: 'root',
})
export class CostLocationService {
  http = inject(HttpClient);
  base_url = environment.baseUrl + 'cost-location/';

  get() {
    return this.http.get<CostLocation[]>(this.base_url);
  }

  create(loc: CostLocation) {
    return this.http.post(this.base_url, loc);
  }

  update(loc: CostLocation) {
    return this.http.patch(this.base_url + loc._id, loc);
  }

  delete(id: number) {
    return this.http.delete(this.base_url + id);
  }
}
