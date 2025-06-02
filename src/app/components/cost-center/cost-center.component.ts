import { Component, inject, OnInit, signal } from "@angular/core";
import { LoginService } from "../../services/login.service";
import { SidePanelComponent } from "../dashboard/side-panel/side-panel.component";
import { CostCenterTableComponent } from "./cost-center-table/cost-center-table.component";
import { CostCenter } from "../../models/const-center.model";
import { CostCenterModalComponent } from "./cost-center-modal/cost-center-modal.component";
import { CostCenterService } from "../../services/cost-center.service";

@Component({
  selector: "app-cost-center",
  imports: [
    SidePanelComponent,
    CostCenterTableComponent,
    CostCenterModalComponent,
  ],
  templateUrl: "./cost-center.component.html",
  styleUrl: "./cost-center.component.css",
})
export class CostCenterComponent implements OnInit {
  loginService = inject(LoginService);
  ccService = inject(CostCenterService);
  costCenters = signal<any[]>([]);

  currentCC = signal<CostCenter | null>(null);

  ngOnInit(): void {
    this.getCCs();
  }

  addCC() {
    this.currentCC.set(new CostCenter());
  }

  close() {
    this.getCCs();
  }

  editCC(cc: CostCenter) {
    this.currentCC.set(cc);
  }

  getCCs() {
    this.ccService.getCCs().subscribe({
      next: (res) => {
        const ccs = res.map((cc) => Object.assign(new CostCenter(), cc));

        this.costCenters.set(ccs);

        this.currentCC.set(null);
      },
    });
  }
}
