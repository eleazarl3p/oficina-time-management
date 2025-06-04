import { Component, EventEmitter, input, Output } from '@angular/core';
import { CostCenter } from '../../../models/const-center.model';
import { ICost } from '../../../interfaces/cost.interface';
import { JsonPipe } from '@angular/common';
import { CostOption } from '../../../enums/cost-option.enum';

@Component({
  selector: 'app-cost-center-table',
  imports: [],
  templateUrl: './cost-center-table.component.html',
  styleUrl: './cost-center-table.component.css',
})
export class CostCenterTableComponent {
  list = input.required<ICost[]>();
  costType = input.required<CostOption>();

  @Output() editItemEvent = new EventEmitter<ICost>();

  add() {
    const cost = { _id: 0, name: '', type: this.costType() } as ICost;
    this.editItemEvent.emit(cost);
  }
}

// (click)="editCCEvent.emit(cc)"
