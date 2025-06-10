import {
  Component,
  computed,
  OnInit,
  Signal,
  WritableSignal,
  signal,
  inject,
  effect,
} from '@angular/core';
import { SidePanelComponent } from '../dashboard/side-panel/side-panel.component';
import { UserTaskTableComponent } from './user-task-table/user-task-table.component';
import { Job } from '../../models/job.model';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { AllTaskTableComponent } from './all-task-table/all-task-table.component';
import { DateFilterComponent } from './date-filter/date-filter.component';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { SummarizedTableComponent } from './summarized-table/summarized-table.component';
import { ISummarizedTask } from '../../interfaces/summarized-task.interface';

// import { saveAs } from 'file-saver';
import { saveAs } from 'file-saver-es';

import { ViewChild } from '@angular/core';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { LoginService } from '../../services/login.service';
import { TaskService } from '../../services/task.service';
import { map, Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CostCenter } from '../../models/const-center.model';
import { Department } from '../../models/department.model';
import { Company } from '../../models/company.model';
import { CostLocation } from '../../models/cost-location.model';

@Component({
  selector: 'app-task-view',
  imports: [
    SidePanelComponent,
    DateFilterComponent,
    UserTaskTableComponent,
    AllTaskTableComponent,
    CommonModule,
    SummarizedTableComponent,
    TitleCasePipe,
    TaskModalComponent,
  ],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.css',
})
export class TaskViewComponent implements OnInit {
  taskService = inject(TaskService);
  router = inject(Router);
  subscriptions: Subscription | null = null;

  @ViewChild('userTaskTable') userTaskTable!: UserTaskTableComponent;
  @ViewChild('allTaskTable') allTaskTable!: AllTaskTableComponent;
  @ViewChild('summarizedTaskTable')
  summarizedTaskTable!: SummarizedTableComponent;
  private tasksList: Task[] = [];

  readonly selectedPayTypes: WritableSignal<string[]> = signal<string[]>([]);
  selectedJobs: WritableSignal<Job[]> = signal<Job[]>([]);
  selectedUsers: WritableSignal<User[]> = signal<User[]>([]);
  selectedStatus: WritableSignal<string[]> = signal<string[]>([]);

  mode = signal<'itemized' | 'summarize'>('itemized');

  loginService = inject(LoginService);

  allTasks = signal<Task[]>([]);
  userTasks = signal<Task[]>([]);
  jobs = signal<Job[]>([]);
  users = signal<User[]>([]);

  fromDateO = signal<string>('');
  toDateO = signal<string>('');

  hideFilters = signal<boolean>(true);
  isModalOpen = false;

  selectedTask = signal<Task | null>(null);

  totalWorkHours = computed(() => {
    if (this.loginService.user()?.isAdmin) {
      const wt = this.allTasks().filter((t) => t.pay_type == 'WORK');

      const tot = wt.reduce((acc, tsk) => acc + tsk.elapseTime(), 0).toFixed(2);
      if (Number(tot) == 0) {
        return '--';
      } else {
        return tot;
      }
    } else {
      const wt = this.userTasks().filter((t) => t.pay_type == 'WORK');

      const tot = wt.reduce((acc, tsk) => acc + tsk.elapseTime(), 0).toFixed(2);

      if (Number(tot) == 0) {
        return '--';
      } else {
        return tot;
      }
    }
  });

  totalLunchHours = computed(() => {
    if (this.loginService.user()?.isAdmin) {
      const wt = this.allTasks().filter((t) => t.pay_type == 'LUNCH');

      const tot = wt.reduce((acc, tsk) => acc + tsk.elapseTime(), 0).toFixed(2);
      if (Number(tot) == 0) {
        return '--';
      } else {
        return tot;
      }
    } else {
      const wt = this.userTasks().filter((t) => t.pay_type == 'LUNCH');

      const tot = wt.reduce((acc, tsk) => acc + tsk.elapseTime(), 0).toFixed(2);
      if (Number(tot) == 0) {
        return '--';
      } else {
        return tot;
      }
    }
  });

  totalVacationHours = computed(() => {
    if (this.loginService.user()?.isAdmin) {
      const wt = this.allTasks().filter((t) => t.pay_type == 'VACATION');

      const tot = wt.reduce((acc, tsk) => acc + tsk.elapseTime(), 0).toFixed(2);

      if (Number(tot) == 0) {
        return '--';
      } else {
        return tot;
      }
    } else {
      const wt = this.userTasks().filter((t) => t.pay_type == 'VACATION');

      const tot = wt.reduce((acc, tsk) => acc + tsk.elapseTime(), 0).toFixed(2);

      if (Number(tot) == 0) {
        return '--';
      } else {
        return tot;
      }
    }
  });
  summarizedTasks = computed(() => {
    if (this.loginService.user()!.isAdmin) {
      let tasks: ISummarizedTask[] = [];
      for (const job of this.jobs()) {
        const tsk = this.allTasks().filter(
          (task) => task.job?._id === job._id && task.approved
        );
        const tp = {
          _id: job._id,
          job: job.name,
          hours: Number(
            tsk.reduce((acc, tsk) => acc + tsk.elapseTime(), 0).toFixed(2)
          ),
        };

        tasks.push(tp as ISummarizedTask);
      }

      return tasks.filter((t) => t.hours > 0);
    } else {
      let tasks: ISummarizedTask[] = [];
      for (const job of this.jobs()) {
        const tsk = this.userTasks().filter(
          (task) => task.job?._id === job._id && task.approved
        );
        tasks.push({
          _id: job._id,
          job: job.name,
          hours: Number(
            tsk.reduce((acc, tsk) => acc + tsk.elapseTime(), 0).toFixed(2)
          ),
        } as ISummarizedTask);
      }
      return tasks.filter((t) => t.hours > 0);
    }
  });

  tasksLength = computed(() => {
    if (this.mode() == 'itemized') {
      if (this.loginService.user()?.isAdmin) {
        return this.allTasks().length;
      } else {
        return this.userTasks().length;
      }
    }
    return this.summarizedTasks().length;
  });

  constructor() {
    let hasFromChangedAfterInit = false;

    effect(() => {
      const from = this.fromDateO();
      if (hasFromChangedAfterInit) {
        this.toDateO.set('');
      } else {
        hasFromChangedAfterInit = true;
      }
    });

    effect(() => {
      const to = this.toDateO();
      if (to !== '') {
        const from = this.fromDateO();
        this.filterTasks(from, to);
      }
    });
  }
  ngOnInit(): void {
    const today = new Date();

    const dayOfWeek = today.getDay();

    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    this.toDateO.set(today.toISOString().split('T')[0]);
    // this.toDateO.set(today.toLocaleDateString('sv-SE'));
    this.fromDateO.set(monday.toISOString().split('T')[0]);

    this.getTasks();
  }

  closeTask() {
    this.getTasks();
    this.selectedTask.set(null);
  }
  filterTasks(fromDate?: string, toDate?: string) {
    const tasks = this.tasksList;

    // const from = fromDate ? new Date(fromDate) : null;
    // const to = toDate ? new Date(toDate) : null;

    const from = fromDate
      ? DateTime.fromISO(fromDate, {
          zone: 'local',
        }).startOf('day')
      : null;

    const to = toDate
      ? DateTime.fromISO(toDate, {
          zone: 'local',
        }).endOf('day')
      : null;

    const payTypes = this.selectedPayTypes();
    const jobs = this.selectedJobs();
    const users = this.selectedUsers();
    const status = this.selectedStatus();

    const filtered = tasks.filter((task) => {
      const date = new Date(task.date);
      const isInDateRange =
        (!from || date.getTime() >= from.toJSDate().getTime()) &&
        (!to || date.getTime() <= to.toJSDate().getTime());
      const matchesPayType =
        payTypes.length === 0 || payTypes.includes(task.pay_type);

      const matchesJob =
        jobs.length === 0 ||
        (task.job && jobs.some((j) => j._id === task.job?._id));

      let matchesUser = false;
      if (this.loginService.user()!.isAdmin) {
        matchesUser =
          !this.loginService.user()!.isAdmin ||
          users.length === 0 ||
          users.some((u) => u._id === task.user._id);
      } else {
        matchesUser = this.loginService.user()?._id === task.user._id;
      }

      const matchStatus = status.length === 0 || status.includes(task.status);

      return (
        isInDateRange &&
        matchesPayType &&
        matchesJob &&
        matchStatus &&
        matchesUser
      );
    });

    if (this.loginService.user()!.isAdmin) {
      this.allTasks.set(filtered);
    } else {
      this.userTasks.set(filtered);
    }
  }

  // filterRangeDate(event: { fromDate: string; toDate: string }) {
  //   this.fromDate.set(event.fromDate);
  //   this.toDate.set(event.toDate);
  //   this.filterTasks(event.fromDate, event.toDate);
  // }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getCurrentTime(offset: number = 0): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() + offset); // Apply minute offset

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`; // Format: HH:mm
  }

  getTime(date: string) {
    const now = new Date(date);
    now.setMinutes(now.getMinutes()); // Apply minute offset

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`; // Format: HH:mm
  }

  getTasks() {
    this.subscriptions = this.taskService
      .getAllTasks()
      .pipe(map((res: any) => res as any[]))
      .subscribe({
        next: (res) => {
          this.tasksList = res.map(
            (t) =>
              new Task(
                t._id,
                t.pay_type,
                t.date,
                t.start_time,
                t.end_time,
                t.notes ?? null,
                t.status ?? 'pending',
                t.cost_center
                  ? Object.assign(new CostCenter(), t.cost_center)
                  : null,

                t.job ? new Job(t.job._id, t.job.name, t.job.items) : null,
                new User(
                  t.user._id,
                  t.user.first_name,
                  t.user.last_name,
                  t.user.username,
                  t.user.password,
                  t.user.role
                ), // properly instantiate User with all required arguments
                t.item ?? null,
                t.location
                  ? new CostLocation(t.location._id, t.location.name)
                  : null,
                t.department
                  ? new Department(t.department._id, t.department.name)
                  : null,
                t.company ? new Company(t.company._id, t.company.name) : null
              )
          );

          const prevSelectedUsers = this.selectedUsers();
          const prevSelectedJobs = this.selectedJobs();

          const uniqueUsers = Array.from(
            new Map(this.tasksList.map((t) => [t.user._id, t.user])).values()
          );

          this.users.set(
            uniqueUsers.map(
              (u: any) =>
                new User(
                  u._id,
                  u.first_name,
                  u.last_name,
                  u.username,
                  u.password,
                  u.role
                )
            )
          );

          const uniqueJobs = Array.from(
            new Map(
              this.tasksList
                .filter((t) => t.job !== null)
                .map((t) => [t.job!._id, t.job!])
            ).values()
          );

          this.jobs.set(uniqueJobs);

          const updatedUserSelections = this.users().filter((u) =>
            prevSelectedUsers.some((sel) => sel._id === u._id)
          );
          this.selectedUsers.set(updatedUserSelections);

          const updatedJobSelections = this.jobs().filter((j) =>
            prevSelectedJobs.some((sel) => sel._id === j._id)
          );
          this.selectedJobs.set(updatedJobSelections);

          this.filterTasks(this.fromDateO(), this.toDateO());
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 401) {
            this.router.navigate(['/login']);
          }
        },
      });
  }

  handleCsvExport() {
    let csvContent = '';

    if (this.mode() == 'itemized') {
      csvContent =
        'User, Date, Pay Type,Time In, Time Out, Total Hours, Location,Company,  Project, Item #, Cost Code, Status\n';
      let tasks = [];
      if (this.loginService.user()!.isAdmin) {
        tasks = this.allTasks();
      } else {
        tasks = this.userTasks();
      }
      tasks.forEach((task) => {
        const row = [
          task.user.fullName,
          `"${this.formatDate(task.date)}"`,
          task.pay_type,

          task.timeIn,
          task.timeOut,
          task.elapseTime(),
          `"${task.location?.name ?? ''}"`,
          `"${task.company?.name ?? ''}"`,
          `"${task.job?.name ?? ''}"`,
          `"${task.item ?? ''}"`,
          `"${task.cost_center?.code ?? ''}"`,

          task.status,
        ].join(',');
        csvContent += row + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv' });
      saveAs(blob, 'timesheet-report.csv');
    } else {
      csvContent = 'Project, Hours\n';

      this.summarizedTasks().forEach((task) => {
        const row = [task.job, task.hours].join(',');
        csvContent += row + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv' });
      saveAs(blob, 'summary-report.csv');
    }
  }

  handlePdfExport() {
    if (this.mode() == 'itemized') {
      if (this.loginService.user()!.isAdmin) {
        this.allTaskTable.exportPdf();
      } else {
        this.userTaskTable.exportPdf();
      }
    } else {
      this.summarizedTaskTable.exportPdf();
    }
  }

  editTask(task: Task) {
    const formatDate = (value: string | Date | null): string | null => {
      if (!value) return null;
      const d = new Date(value);
      return d.toLocaleDateString('sv-SE');
      return d.toISOString().split('T')[0]; // => "YYYY-MM-DD"
    };

    // const formatTime = (value: string | Date | null): string | null => {
    //   if (!value) return null;
    //   const d = new Date(`1970-01-01T${value}`);
    //   const hh = String(d.getHours()).padStart(2, "0");
    //   const mm = String(d.getMinutes()).padStart(2, "0");
    //   return `${hh}:${mm}`;
    // };

    task.date = formatDate(task.date) ?? this.getTodayDate();
    task.start_time = this.getTime(task.start_time);
    task.end_time = this.getTime(task.end_time);
    this.selectedTask.set(task);
    this.isModalOpen = true;
  }

  createTask() {
    let lastTask: Task | undefined = undefined;

    if (this.loginService.user()?.isAdmin) {
      lastTask = this.getTodayTasksSortedByEndTime(this.allTasks()).pop();
    } else {
      lastTask = this.getTodayTasksSortedByEndTime(this.userTasks()).pop();
    }

    const currentDate = new Date();
    let start = '08:00';
    let end = `${currentDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${currentDate.getMinutes()}`;

    if (lastTask) {
      const lastEnd = new Date(lastTask.end_time);
      const nextStart = new Date(lastEnd);
      const nextEnd = new Date(lastEnd);
      nextEnd.setHours(nextEnd.getHours() + 4);
      nextEnd.setMinutes(0);

      start = nextStart.toTimeString().slice(0, 5);
      // end = nextEnd.toTimeString().slice(0, 5);
    }

    const task = new Task(
      0, // _id
      'WORK', // pay_type
      this.getTodayDate(), // date
      start, // start_time
      end, // end_time
      null, // notes
      'pending', // status
      null, // code
      null, // job
      this.loginService.user()! // user (assuming current user)
    );

    this.selectedTask.set(task);
    this.isModalOpen = true;
  }

  setMode(value: 'itemized' | 'summarize') {
    this.mode.set(value);
    // You can also re-filter if mode affects output
    this.filterTasks(this.fromDateO(), this.toDateO());
  }

  toggleSelection<T>(signalArray: WritableSignal<T[]>, value: T) {
    const current = signalArray();
    if (current.includes(value)) {
      signalArray.set(current.filter((v) => v !== value));
    } else {
      signalArray.set([...current, value]);
    }

    this.filterTasks(this.fromDateO(), this.toDateO());
  }

  getTodayDate(): string {
    const today = new Date();
    //return today.toLocaleDateString('sv-SE');
    return today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  }

  reviewTask(event: { id: number; approve: boolean }) {
    this.taskService.review(event.id, event.approve).subscribe((res) => {
      this.getTasks();
    });
  }

  getTodayTasksSortedByEndTime(tasks: Task[]): Task[] {
    const todayStr = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    return tasks
      .filter(
        (task) =>
          task.date.slice(0, 10) === todayStr &&
          task.user._id == this.loginService.user()?._id
      )
      .sort(
        (a, b) =>
          new Date(a.end_time).getTime() - new Date(b.end_time).getTime()
      );
  }
}
