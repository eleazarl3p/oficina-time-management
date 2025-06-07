import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { Task } from '../../../models/task.model';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { DateFilterComponent } from '../date-filter/date-filter.component';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PdfExportService } from '../../../services/pdf-export.service';

@Component({
  selector: 'app-user-task-table',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './user-task-table.component.html',
  styleUrl: './user-task-table.component.css',
})
export class UserTaskTableComponent {
  fromDate = input.required<string>();
  toDate = input.required<string>();
  tasks = input.required<Task[]>();

  @Output() editTask = new EventEmitter<Task>();
  @Output() newTask = new EventEmitter<void>();

  exportPdf() {
    const head = [
      [
        'Date',
        'Pay Type',
        'Start Time',
        'End Time',
        'Hours',
        'Cost Center',
        'Project',
        'Approved',
      ],
    ];
    const body = this.tasks().map((task) => [
      PdfExportService.formatDate(task.date),
      PdfExportService.toTitleCase(task.pay_type),
      PdfExportService.formatTime(task.start_time),
      PdfExportService.formatTime(task.end_time),
      task.elapseTime(),
      PdfExportService.toTitleCase(task.cost_center?.code || ''),
      PdfExportService.toTitleCase(task.job?.name || ''),
      PdfExportService.toTitleCase(task.status),
    ]);

    PdfExportService.exportTable({
      title: 'TIMESHEET',
      dateRange: `${this.fromDate()} - ${this.toDate()}`,
      head,
      body,
      filename: 'timesheet.pdf',
      totalWork: '--',
      totalLunch: '--',
    });
  }
}
