import { Component, inject, OnInit, signal } from "@angular/core";

import { User } from "../../models/user.model";
import { LoginService } from "../../services/login.service";
import { SidePanelComponent } from "../dashboard/side-panel/side-panel.component";
import { JobTableComponent } from "./job-table/job-table.component";
import { Job } from "../../models/job.model";
import { JobService } from "../../services/job.service";
import { JobModalComponent } from "./job-modal/job-modal.component";

@Component({
  selector: "app-job",
  imports: [SidePanelComponent, JobTableComponent, JobModalComponent],
  templateUrl: "./job.component.html",
  styleUrl: "./job.component.css",
})
export class JobComponent implements OnInit {
  loginService = inject(LoginService);
  jobService = inject(JobService);

  jobs = signal<Job[]>([]);

  currentJob = signal<Job | null>(null);
  ngOnInit(): void {
    this.getJobs();
  }

  addJob() {
    this.currentJob.set(new Job());
  }

  editJob(job: Job) {
    this.currentJob.set(job);
  }

  close() {
    this.getJobs();
  }

  getJobs() {
    this.jobService.getJobs().subscribe((res) => {
      const jbs = res.map((jb) => {
        return Object.assign(new Job(), jb);
      });

      this.jobs.set(jbs);
      this.currentJob.set(null);
    });
  }
}
