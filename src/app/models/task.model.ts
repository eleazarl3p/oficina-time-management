import { take } from 'rxjs';
import { Job } from './job.model';
import { User } from './user.model';
import { CostCenter } from './const-center.model';

export class Task {
  _id: number;
  pay_type: string;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string | null = null;
  status: string = 'pending';
  // code?: string | null = null;
  cost_center?: CostCenter | null = null;
  job?: Job | null = null;
  // item?: string | null = null;
  user: User;

  item?: string | null = null;

  constructor(
    id: number = 0,
    pay_type: string = '',
    date: string = '',
    start_time: string = '',
    end_time: string = '',
    notes: string | null = null,
    status: string = 'pending',
    cost_center: CostCenter | null = null,
    // code: string | null = null,
    job: Job | null = null,
    // item: string | null = null,
    user: User,
    // cost_center: CostCenter | null = null,
    item: string | null = null
  ) {
    this._id = id;
    this.pay_type = pay_type;
    this.date = date;
    this.start_time = start_time;
    this.end_time = end_time;
    this.notes = notes;
    this.status = status;
    // this.code = code;
    this.job = job;
    // this.item = item;
    this.user = user;
    this.cost_center = cost_center;
    this.item = item;
  }

  elapseTime() {
    const start = new Date(this.start_time);
    const end = new Date(this.end_time);

    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = Math.round((diffInMs / (1000 * 60 * 60)) * 100) / 100;

    return diffInHours;
  }

  get timeIn() {
    // const date = new Date(this.start_time);
    // const hours = String(date.getHours()).padStart(2, '0');
    // const minutes = String(date.getMinutes()).padStart(2, '0');
    // return `${hours}:${minutes}`;
    return this.getTime(this.start_time);
  }

  get timeOut() {
    return this.getTime(this.end_time);
  }

  private getTime(time: string) {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${String(hours).padStart(2, '0')}:${minutes}\u00A0${ampm}`;
  }

  get approved() {
    return this.status == 'approved';
  }

  get pending() {
    return this.status == 'pending';
  }

  get denied() {
    return this.status == 'denied';
  }
}
