import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
} from "@angular/core";
import { CostCenter } from "../../../models/const-center.model";
import { NgIf } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CostCenterService } from "../../../services/cost-center.service";

@Component({
  selector: "app-cost-center-modal",
  imports: [NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: "./cost-center-modal.component.html",
  styleUrl: "./cost-center-modal.component.css",
})
export class CostCenterModalComponent implements OnInit {
  ccService = inject(CostCenterService);
  cc = input.required<CostCenter>();
  @Output() closeModatEmitter = new EventEmitter<boolean>();

  fb = inject(FormBuilder);

  ccForm = this.fb.group({
    _id: 0,
    code: ["", Validators.required],
    location: ["", Validators.required],
    department: ["", Validators.required],
    company_code: ["", Validators.required],
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
    if (this.cc()._id == 0) {
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
      _id: this.cc()._id,
      code: this.cc().code,
      location: this.cc().location,
      department: this.cc().department,
      company_code: this.cc().company_code,
    });
  }
}
