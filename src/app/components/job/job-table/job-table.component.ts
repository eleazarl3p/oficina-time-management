import { Component, EventEmitter, input, Output } from "@angular/core";
import { Job } from "../../../models/job.model";

@Component({
  selector: "app-job-table",
  imports: [],
  templateUrl: "./job-table.component.html",
  styleUrl: "./job-table.component.css",
})
export class JobTableComponent {
  jobs = input.required<Job[]>();
  @Output() editJobEvent = new EventEmitter<Job>();
}
