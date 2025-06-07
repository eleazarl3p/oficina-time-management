import { Component, computed, input } from '@angular/core';
import { ISummarizedTask } from '../../../interfaces/summarized-task.interface';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PdfExportService } from '../../../services/pdf-export.service';

@Component({
  selector: 'app-summarized-table',
  imports: [DatePipe],
  templateUrl: './summarized-table.component.html',
  styleUrl: './summarized-table.component.css',
})
export class SummarizedTableComponent {
  fromDate = input.required<string>();
  toDate = input.required<string>();
  tasks = input.required<ISummarizedTask[]>();

  total = computed(() =>
    this.tasks()
      .reduce((acc, task) => acc + task.hours, 0)
      .toFixed(2)
  );

  exportPdf() {
    const head = [['Project', 'Hours']];
    const body = this.tasks().map((task) => [
      PdfExportService.toTitleCase(task.job),
      task.hours,
    ]);
    body.push(['Total', this.total()]);

    PdfExportService.exportTable({
      title: 'SUMMARY',
      dateRange: `${this.fromDate()} - ${this.toDate()}`,
      head,
      body,
      filename: 'summary.pdf',
      totalWork: '--',
      totalLunch: '--',
    });
  }
}
