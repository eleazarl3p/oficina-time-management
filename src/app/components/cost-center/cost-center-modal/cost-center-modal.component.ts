import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { CostCenter } from '../../../models/const-center.model';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CostCenterService } from '../../../services/cost-center.service';
import { CompanyService } from '../../../services/company.service';
import { CostDepartmentService } from '../../../services/cost-department.service';
import { CostLocationService } from '../../../services/cost-location.service';

@Component({
  selector: 'app-cost-center-modal',
  imports: [NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './cost-center-modal.component.html',
  styleUrl: './cost-center-modal.component.css',
})
export class CostCenterModalComponent implements OnInit {
  ccService = inject(CostCenterService);
  locationService = inject(CostLocationService);
  departmentService = inject(CostDepartmentService);
  companyService = inject(CompanyService);

  item = input.required<any>();
  @Output() closeModatEmitter = new EventEmitter<boolean>();

  fb = inject(FormBuilder);

  ccForm = this.fb.group({
    _id: 0,
    code: ['', Validators.required],
    name: ['', Validators.required],
  });

  delete(id: number) {
    this.ccService.delete(id).subscribe((res) => {
      this.closeModatEmitter.emit(true);
    });
  }

  cancel() {
    this.closeModatEmitter.emit(false);
  }

  onSubmit() {
    if (this.item()._id == 0) {
      this.ccService.create(this.ccForm.value as CostCenter).subscribe({
        next: (res) => {
          this.closeModatEmitter.emit(true);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.ccService.update(this.ccForm.value as CostCenter).subscribe({
        next: (res) => {
          this.closeModatEmitter.emit(true);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  ngOnInit(): void {
    this.ccForm.patchValue({
      _id: this.item()._id,
      code: this.item().code,
      name: this.item().name,
    });
  }
}
