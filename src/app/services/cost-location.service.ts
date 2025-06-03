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
}
