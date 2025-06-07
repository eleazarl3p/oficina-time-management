import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  model,
  output,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { groupBy } from 'rxjs';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-date-filter',
  imports: [FormsModule, CommonModule],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.css',
})
export class DateFilterComponent {
  loginService = inject(LoginService);
  @Output() exportAsPdf = new EventEmitter<void>();
  @Output() exportAsCsv = new EventEmitter<void>();

  fromDateO = model<string>();
  toDateO = model<string>();

  tasksLength = input.required<number>();

  private fromDate_ = signal<string>('');
  private toDate_ = signal<string>('');

  maxStartDate = computed(() => {
    if (this.toDateO() && this.toDateO()!.length > 2) {
      return new Date(this.toDateO()!).toISOString().split('T')[0];
    }

    const day = new Date();
    const d = day.getDate();
    day.setDate(d - 1);
    return day.toLocaleDateString('sv-SE');
  });

  minToDate = computed(() => {
    if (this.fromDateO() && this.fromDateO()!.length > 2) {
      const from = new Date(`${this.fromDateO()}T00:00:00`);

      return from.toISOString().split('T')[0];
    }
    const day = new Date();
    const d = day.getDate();
    day.setDate(d - 1);
    return day.toLocaleDateString('sv-SE');
  });

  ngOnInit(): void {
    const today = new Date(this.toDateO()!);
    const monday = new Date(this.fromDateO()!);
    this.toDate_.set(this.toDateO()!);
    this.fromDate_.set(this.fromDateO()!);
  }
}
