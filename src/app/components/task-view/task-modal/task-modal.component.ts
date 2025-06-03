import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from '../../../models/task.model';
import { Job } from '../../../models/job.model';
import { User } from '../../../models/user.model';
import { LoginService } from '../../../services/login.service';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { JobService } from '../../../services/job.service';
import { CostCenter } from '../../../models/const-center.model';
import { CostCenterService } from '../../../services/cost-center.service';
import { CostLocation } from '../../../models/cost-location.model';
import { Department } from '../../../models/department.model';
import { Company } from '../../../models/company.model';
import { CostLocationService } from '../../../services/cost-location.service';
import { CostDepartmentService } from '../../../services/cost-department.service';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-task-modal',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent implements OnInit {
  loginService = inject(LoginService);
  taskService = inject(TaskService);
  userService = inject(UserService);
  jobService = inject(JobService);
  ccService = inject(CostCenterService);
  locationService = inject(CostLocationService);
  departmentService = inject(CostDepartmentService);
  companyService = inject(CompanyService);
  task = input.required<Task>();

  jobs = signal<Job[]>([]);
  users = signal<User[]>([]);
  items = signal<string[]>([]);
  costCenters = signal<CostCenter[]>([]);
  costLocations = signal<CostLocation[]>([]);
  costDepartments = signal<Department[]>([]);
  costCompanies = signal<Company[]>([]);

  @Output() close = new EventEmitter<boolean>();
  taskForm: FormGroup = new FormGroup({});

  fb = inject(FormBuilder);

  closeModal() {
    this.close.emit(false);
  }

  delete(id: number) {
    this.taskService.delete(id).subscribe((res) => {
      console.log(res);
      this.closeModal();
    });
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((res) => {
      const uu = res.map(
        (u) =>
          new User(
            u._id,
            u.first_name,
            u.last_name,
            u.username,
            u.password,
            u.role
          )
      );

      this.users.set(uu);
    });

    this.getJobs();
    this.getCCs();
    this.getCompanies();
    this.getLocations();
    this.getDepartments();

    const task = this.task();

    this.taskForm = this.fb.group({
      _id: [task._id],
      pay_type: [task.pay_type, Validators.required],
      // date: [formatDate(task.date) ?? this.getTodayDate(), Validators.required],
      // start_time: [startTime, Validators.required],
      // end_time: [endTime, Validators.required],
      date: [task.date, Validators.required],
      start_time: [task.start_time, Validators.required],
      end_time: [task.end_time, Validators.required],
      notes: [task.notes ?? ''],
      status: [task.status, Validators.required],
      cost_center: [task.cost_center?._id ?? null],
      job: [task.job?._id ?? null], // store job._id
      item: [task.item ?? null],
      user: [task.user?._id ?? null, Validators.required], // store user._id
      location: [task.location?._id ?? null, Validators.required],
      department: [task.department?._id ?? null, Validators.required],
      company: [task.company?._id ?? null, Validators.required],
    });

    this.taskForm.get('job')?.valueChanges.subscribe((jobId: string) => {
      const job = this.jobs().find((j) => j._id === Number(jobId));
      this.items.set(job?.items ?? []);
      this.taskForm.get('item')?.setValue(null);
    });
  }

  setTaskForEdit(task: Task): void {
    this.taskForm.patchValue(task);
  }

  submit(): void {
    const raw = this.taskForm.value;

    const payload = {
      pay_type: raw.pay_type,
      date: new Date(raw.date),
      start_hour: parseInt(raw.start_time.split(':')[0], 10),
      start_minute: parseInt(raw.start_time.split(':')[1], 10),
      end_hour: parseInt(raw.end_time.split(':')[0], 10),
      end_minute: parseInt(raw.end_time.split(':')[1], 10),
      job: raw.pay_type == 'WORK' ? raw.job : null,
      user: raw.user,
      item: raw.pay_type == 'WORK' ? raw.item : null,
      cost_center:
        raw.pay_type == 'WORK' ? parseInt(raw.cost_center, 10) : null,
      location: raw.pay_type == 'WORK' ? parseInt(raw.location, 10) : null,
      department: raw.pay_type == 'WORK' ? parseInt(raw.department, 10) : null,
      company: raw.pay_type == 'WORK' ? parseInt(raw.company, 10) : null,
      notes: raw.notes,
      status: raw.status,
    };

    if (raw._id > 0) {
      this.taskService.updateTask(raw._id, payload).subscribe((res) => {
        console.log(res);
        this.closeModal();
      });
    } else {
      this.taskService.createTasks(payload).subscribe((res) => {
        console.log(res);
        console.log('ok');
        this.closeModal();
      });
    }
  }

  cancel(): void {
    //this.taskForm.reset({ status: "pending" });
    this.closeModal();
  }

  getJobs() {
    this.jobService.getJobs().subscribe((res) => {
      const jj = res.map((j) => new Job(j._id, j.name, j.items));
      this.jobs.set(jj);

      if (this.task().job) {
        const jb = jj.filter((j) => j._id == this.task().job?._id).pop();

        if (jb) {
          this.items.set(jb.items);
        }
      }
    });
  }

  getCCs() {
    this.ccService.getCCs().subscribe((res) => {
      const ccs = res.map((cc) => Object.assign(new CostCenter(), cc));
      this.costCenters.set(ccs);
    });
  }

  getLocations() {
    this.locationService.get().subscribe((res) => {
      const lct = res.map((l) => Object.assign(new CostLocation(), l));

      this.costLocations.set(lct);
    });
  }

  getDepartments() {
    this.departmentService.get().subscribe((res) => {
      const dpts = res.map((d) => Object.assign(new Department(), d));

      this.costDepartments.set(dpts);
    });
  }

  getCompanies() {
    this.companyService.get().subscribe((res) => {
      const cmps = res.map((c) => Object.assign(new Company(), c));

      this.costCompanies.set(cmps);
    });
  }
}
