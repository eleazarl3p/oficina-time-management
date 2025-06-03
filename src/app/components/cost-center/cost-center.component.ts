import { Component, inject, OnInit, signal } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { SidePanelComponent } from '../dashboard/side-panel/side-panel.component';
import { CostCenterTableComponent } from './cost-center-table/cost-center-table.component';
import { CostCenter } from '../../models/const-center.model';
import { CostCenterModalComponent } from './cost-center-modal/cost-center-modal.component';
import { CostCenterService } from '../../services/cost-center.service';
import { Company } from '../../models/company.model';
import { CostLocation } from '../../models/cost-location.model';
import { Department } from '../../models/department.model';
import { CompanyService } from '../../services/company.service';
import { CostDepartmentService } from '../../services/cost-department.service';
import { CostLocationService } from '../../services/cost-location.service';

@Component({
  selector: 'app-cost-center',
  imports: [
    SidePanelComponent,
    CostCenterTableComponent,
    CostCenterModalComponent,
  ],
  templateUrl: './cost-center.component.html',
  styleUrl: './cost-center.component.css',
})
export class CostCenterComponent implements OnInit {
  loginService = inject(LoginService);
  ccService = inject(CostCenterService);
  locationService = inject(CostLocationService);
  departmentService = inject(CostDepartmentService);
  companyService = inject(CompanyService);

  costCenters = signal<any[]>([]);
  costLocations = signal<CostLocation[]>([]);
  costDepartments = signal<Department[]>([]);
  costCompanies = signal<Company[]>([]);

  currentItem = signal<any | null>(null);

  ngOnInit(): void {
    this.getCCs();
    this.getLocations();
    this.getDepartments();
    this.getCompanies();
  }

  addCC() {
    this.currentItem.set(new CostCenter());
  }

  close() {
    this.getCCs();
  }

  editItem(event: { title: string; item: any }) {
    this.currentItem.set(event.item);

    console.log(event);
  }

  // getCCs() {
  //   this.ccService.getCCs().subscribe({
  //     next: (res) => {
  //       const ccs = res.map((cc) => Object.assign(new CostCenter(), cc));

  //       this.costCenters.set(ccs);

  //       this.currentCC.set(null);
  //     },
  //   });
  // }

  getCCs() {
    this.ccService.getCCs().subscribe((res) => {
      const ccs = res.map((cc) => Object.assign(new CostCenter(), cc));
      this.costCenters.set(ccs);
    });
  }

  getLocations() {
    this.locationService.get().subscribe((res) => {
      const lct = res.map((l) => Object.assign(new CostLocation(), l));

      this.costLocations.set(lct);
    });
  }

  getDepartments() {
    this.departmentService.get().subscribe((res) => {
      const dpts = res.map((d) => Object.assign(new Department(), d));

      this.costDepartments.set(dpts);
    });
  }

  getCompanies() {
    this.companyService.get().subscribe((res) => {
      const cmps = res.map((c) => Object.assign(new Company(), c));

      this.costCompanies.set(cmps);
    });
  }
}
