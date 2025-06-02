import { Component, EventEmitter, input, Output } from "@angular/core";
import { CostCenter } from "../../../models/const-center.model";

@Component({
  selector: "app-cost-center-table",
  imports: [],
  templateUrl: "./cost-center-table.component.html",
  styleUrl: "./cost-center-table.component.css",
})
export class CostCenterTableComponent {
  costCenters = input.required<CostCenter[]>();
  @Output() editCCEvent = new EventEmitter<CostCenter>();
}
