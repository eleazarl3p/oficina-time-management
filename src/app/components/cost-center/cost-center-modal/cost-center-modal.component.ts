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
import { CostOption } from '../../../enums/cost-option.enum';
import { ICost } from '../../../interfaces/cost.interface';
import { CostLocation } from '../../../models/cost-location.model';
import { Department } from '../../../models/department.model';
import { Company } from '../../../models/company.model';
import { Observable } from 'rxjs';

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

  cop = CostOption;
  item = input.required<ICost>();
  @Output() closeModatEmitter = new EventEmitter<ICost | null>();

  fb = inject(FormBuilder);

  itemForm = this.fb.group({
    _id: 0,

    name: ['', Validators.required],
    option: CostOption,
  });

  delete(id: number) {
    // this.ccService.delete(id).subscribe((res) => {
    //   this.closeModatEmitter.emit(this.item());
    // });

    switch (this.item().type) {
      case CostOption.CC:
        this.ccService.delete(id).subscribe({
          next: (res) => {
            this.closeModatEmitter.emit(this.item());
          },
          error: (err) => {
            console.log(err);
          },
        });
        break;
      case CostOption.LOCATION:
        this.locationService.delete(id).subscribe({
          next: (res) => {
            this.closeModatEmitter.emit(this.item());
          },
          error: (err) => {
            console.log(err);
          },
        });
        break;
      case CostOption.DEPARTMENT:
        this.departmentService.delete(id).subscribe({
          next: (res) => {
            this.closeModatEmitter.emit(this.item());
          },
          error: (err) => {
            console.log(err);
          },
        });

        break;
      case CostOption.COMPANY:
        this.companyService.delete(id).subscribe({
          next: (res) => {
            this.closeModatEmitter.emit(this.item());
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  cancel() {
    this.closeModatEmitter.emit(null);
  }

  onSubmit() {
    if (!this.itemForm.valid) {
      return;
    }
    if (this.item()._id == 0) {
      switch (this.item().type) {
        case CostOption.CC:
          const { _id, name } = this.itemForm.value;
          const cost = new CostCenter(_id ?? 0, name ?? undefined);
          this.ccService.create(cost).subscribe({
            next: (res) => {
              this.closeModatEmitter.emit(this.item());
            },
            error: (err) => {
              console.log(err);
            },
          });
          break;
        case CostOption.LOCATION:
          this.locationService
            .create(this.itemForm.value as CostLocation)
            .subscribe({
              next: (res) => {
                this.closeModatEmitter.emit(this.item());
              },
              error: (err) => {
                console.log(err);
              },
            });
          break;
        case CostOption.DEPARTMENT:
          this.departmentService
            .create(this.itemForm.value as Department)
            .subscribe({
              next: (res) => {
                this.closeModatEmitter.emit(this.item());
              },
              error: (err) => {
                console.log(err);
              },
            });

          break;
        case CostOption.COMPANY:
          this.companyService.create(this.itemForm.value as Company).subscribe({
            next: (res) => {
              this.closeModatEmitter.emit(this.item());
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    } else {
      switch (this.item().type) {
        case CostOption.CC:
          const { _id, name } = this.itemForm.value;
          const cost = new CostCenter(_id!, name!);
          this.ccService.update(cost).subscribe({
            next: (res) => {
              this.closeModatEmitter.emit(this.item());
            },
            error: (err) => {
              console.log(err);
            },
          });
          break;
        case CostOption.LOCATION:
          this.locationService
            .update(this.itemForm.value as CostLocation)
            .subscribe({
              next: (res) => {
                this.closeModatEmitter.emit(this.item());
              },
              error: (err) => {
                console.log(err);
              },
            });
          break;
        case CostOption.DEPARTMENT:
          this.departmentService
            .update(this.itemForm.value as Department)
            .subscribe({
              next: (res) => {
                this.closeModatEmitter.emit(this.item());
              },
              error: (err) => {
                console.log(err);
              },
            });

          break;
        case CostOption.COMPANY:
          this.companyService.update(this.itemForm.value as Company).subscribe({
            next: (res) => {
              this.closeModatEmitter.emit(this.item());
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    }
  }

  // onSubmit() {
  //   if (!this.itemForm.valid) return;

  //   const isNew = this.item()._id === 0;
  //   const { _id, name } = this.itemForm.value;
  //   const value = this.itemForm.value;

  //   let request$: Observable<any>;

  //   switch (this.item().type) {
  //     case CostOption.CC:
  //       const cost = new CostCenter(_id ?? 0, name ?? undefined);
  //       request$ = isNew
  //         ? this.ccService.create(cost)
  //         : this.ccService.update(cost);
  //       break;

  //     case CostOption.LOCATION:
  //       request$ = isNew
  //         ? this.locationService.create(value as CostLocation)
  //         : this.locationService.update(value as CostLocation);
  //       break;

  //     case CostOption.DEPARTMENT:
  //       request$ = isNew
  //         ? this.departmentService.create(value as Department)
  //         : this.departmentService.update(value as Department);
  //       break;

  //     case CostOption.COMPANY:
  //       request$ = isNew
  //         ? this.companyService.create(value as Company)
  //         : this.companyService.update(value as Company);
  //       break;

  //     default:
  //       console.error('Unsupported cost option:', this.item().type);
  //       return;
  //   }

  //   request$.subscribe({
  //     next: () => this.closeModatEmitter.emit(true),
  //     error: (err) => console.log(err),
  //   });
  // }

  ngOnInit(): void {
    this.itemForm.patchValue({
      _id: this.item()._id,

      name: this.item().name,
    });
  }
}
