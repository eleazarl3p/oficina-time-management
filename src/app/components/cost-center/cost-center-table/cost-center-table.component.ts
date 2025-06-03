import { Component, EventEmitter, input, Output } from '@angular/core';
import { CostCenter } from '../../../models/const-center.model';

@Component({
  selector: 'app-cost-center-table',
  imports: [],
  templateUrl: './cost-center-table.component.html',
  styleUrl: './cost-center-table.component.css',
})
export class CostCenterTableComponent {
  list = input.required<any[]>();
  title = input.required<string>();
  @Output() editItemEvent = new EventEmitter<any>();
}

// (click)="editCCEvent.emit(cc)"
