import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  computed,
  EventEmitter,
  input,
  output,
  Output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-date-filter",
  imports: [FormsModule, CommonModule],
  templateUrl: "./date-filter.component.html",
  styleUrl: "./date-filter.component.css",
})
export class DateFilterComponent {
  @Output() exportAsPdf = new EventEmitter<void>();
  @Output() exportAsCsv = new EventEmitter<void>();

  @Output() dateRangeChanged = new EventEmitter<{
    fromDate: string;
    toDate: string;
  }>();

  tasksLength = input.required<number>();

  fromDate = signal<string>("");
  toDate = signal<string>("");

  maxStartDate = computed(() => {
    const to = new Date(this.toDate());
    to.setDate(to.getDate());
    return to.toLocaleDateString("sv-SE");
  });

  minToDate = computed(() => {
    const from = new Date(this.fromDate());
    from.setDate(from.getDate() + 1);
    return from.toLocaleDateString("sv-SE");
  });

  ngOnInit(): void {
    const today = new Date();

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(today.getDate() - 7);

    this.toDate.set(today.toLocaleDateString("sv-SE")); // Format YYYY-MM-DD
    this.fromDate.set(sevenDaysAgo.toLocaleDateString("sv-SE"));
  }

  dateFilter() {
    this.dateRangeChanged.emit({
      fromDate: this.fromDate(),
      toDate: this.toDate(),
    });
  }
}
