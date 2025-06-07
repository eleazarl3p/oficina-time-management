import { Component, EventEmitter, input, Output } from '@angular/core';
import { Task } from '../../../models/task.model';
import { DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PdfExportService } from '../../../services/pdf-export.service';

@Component({
  selector: 'app-all-task-table',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './all-task-table.component.html',
  styleUrl: './all-task-table.component.css',
})
export class AllTaskTableComponent {
  fromDate = input.required<string>();
  toDate = input.required<string>();
  tasks = input.required<Task[]>();

  totalWork = input<string>('--');
  totalLunch = input<string>('--');

  @Output() editTask = new EventEmitter<Task>();
  @Output() newTask = new EventEmitter<void>();

  @Output() reviewTask = new EventEmitter<{
    id: number;
    approve: boolean;
  }>();

  exportPdf() {
    const head = [
      [
        'User',
        'Date',
        'Pay Type',
        'Time In',
        'Time Out',
        'Total Hours',
        'Location',
        'Company',
        'Project',
        'Item #',
        'Cost Code',
      ],
    ];

    const body = this.tasks().map((task) => {
      return [
        PdfExportService.toTitleCase(task.user.fullName),
        PdfExportService.formatDate(task.date),
        task.pay_type,
        task.timeIn,
        task.timeOut,
        task.elapseTime(),
        task.location?.name ?? '',
        task.company?.name ?? '',
        task.job?.name ?? '',
        task.item ?? '',
        task.cost_center?.code ?? '',
        PdfExportService.toTitleCase(task.job?.name || ''),
      ];
    });

    PdfExportService.exportTable({
      title: 'TIMESHEET',
      dateRange: `${this.fromDate()} - ${this.toDate()}`,
      head,
      body,
      filename: 'timesheet.pdf',
      totalWork: this.totalWork(),
      totalLunch: this.totalLunch(),
    });
  }
}
