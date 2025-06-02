import {
  Component,
  EventEmitter,
  inject,
  input,
  linkedSignal,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { Job } from "../../../models/job.model";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule, NgFor } from "@angular/common";
import { JobService } from "../../../services/job.service";

@Component({
  selector: "app-job-modal",
  imports: [FormsModule, ReactiveFormsModule, NgFor, CommonModule],
  templateUrl: "./job-modal.component.html",
  styleUrl: "./job-modal.component.css",
})
export class JobModalComponent implements OnInit {
  jobService = inject(JobService);
  job = input.required<Job>();
  items = signal<string[]>([]);

  @Output() closeModatEmitter = new EventEmitter<void>();

  newItem = signal<string>("");
  fb = new FormBuilder();

  jobForm = this.fb.group({
    _id: [0, Validators.required],
    name: ["", Validators.required],
    items: this.fb.control(null as string[] | null, Validators.required),
  });

  ngOnInit(): void {
    const jobValue = this.job();
    this.jobForm.patchValue({
      _id: this.job()._id,
      name: this.job().name,
      items: this.job()?.items,
    });

    this.items.set([...jobValue.items]);
  }

  addItem() {
    const trimmed = this.newItem().trim();
    if (trimmed.length > 0) {
      const updated = new Set([...this.items(), trimmed]);
      this.items.set([...updated]);

      // optional: reset the input field
      this.newItem.set("");
      this.jobForm.patchValue({ items: this.items() });
    }
  }

  cancel() {
    this.closeModatEmitter.emit();
  }
  delete(id: number) {
    this.jobService.delete(id).subscribe((res) => {
      this.closeModatEmitter.emit();
    });
  }

  onSubmit() {
    if (this.job()._id == 0) {
      this.jobService.create(this.jobForm.value as Job).subscribe((res) => {
        this.closeModatEmitter.emit();
      });
    } else {
      this.jobService.update(this.jobForm.value as Job).subscribe((res) => {
        this.closeModatEmitter.emit();
      });
    }
  }

  removeItem(item: string) {
    const currentItems = this.jobForm.value.items || [];
    const updatedItems = currentItems.filter((itm: string) => itm !== item);
    this.jobForm.patchValue({ items: updatedItems });
    this.items.set([...updatedItems]);
  }
}
