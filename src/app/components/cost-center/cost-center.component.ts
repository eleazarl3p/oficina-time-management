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
import { CostOption } from '../../enums/cost-option.enum';
import { JsonPipe } from '@angular/common';
import { ICost } from '../../interfaces/cost.interface';

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

  costCenters = signal<ICost[]>([]);
  costLocations = signal<ICost[]>([]);
  costDepartments = signal<ICost[]>([]);
  costCompanies = signal<ICost[]>([]);

  currentItem = signal<any | null>(null);
  cop = CostOption;

  ngOnInit(): void {
    this.getCCs();
    this.getLocations();
    this.getDepartments();
    this.getCompanies();
  }

  addCC() {
    this.currentItem.set(new CostCenter());
  }

  close(event: ICost | null) {
    if (event == null) {
      this.currentItem.set(null);
      return;
    }

    switch (event.type) {
      case CostOption.CC:
        this.getCCs();
        break;

      case CostOption.LOCATION:
        this.getLocations();
        break;

      case CostOption.DEPARTMENT:
        this.getDepartments();
        break;

      case CostOption.COMPANY:
        this.getCompanies();
        break;
    }

    this.currentItem.set(null);
  }

  editItem(event: ICost) {
    this.currentItem.set(event);
    //console.log(event);
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
      const ccs = res.map((cc) => {
        return { _id: cc._id, name: cc.code, type: CostOption.CC };
      });
      this.costCenters.set(ccs);
    });
  }

  getLocations() {
    this.locationService.get().subscribe((res) => {
      const lct = res.map((l) => {
        return { _id: l._id, name: l.name, type: CostOption.LOCATION };
      });

      this.costLocations.set(lct);
    });
  }

  getDepartments() {
    this.departmentService.get().subscribe((res) => {
      const dpts = res.map((d) => {
        return { _id: d._id, name: d.name, type: CostOption.DEPARTMENT };
      });

      this.costDepartments.set(dpts);
    });
  }

  getCompanies() {
    this.companyService.get().subscribe((res) => {
      const cmps = res.map((c) => {
        return { _id: c._id, name: c.name, type: CostOption.COMPANY };
      });

      this.costCompanies.set(cmps);
    });
  }
}
