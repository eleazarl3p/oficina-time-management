import { Component, EventEmitter, input, Output } from "@angular/core";
import { Task } from "../../../models/task.model";
import { DatePipe, JsonPipe, TitleCasePipe } from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PdfExportService } from "../../../services/pdf-export.service";

@Component({
  selector: "app-all-task-table",
  imports: [DatePipe, TitleCasePipe],
  templateUrl: "./all-task-table.component.html",
  styleUrl: "./all-task-table.component.css",
})
export class AllTaskTableComponent {
  fromDate = input.required<string>();
  toDate = input.required<string>();
  tasks = input.required<Task[]>();

  @Output() editTask = new EventEmitter<Task>();
  @Output() newTask = new EventEmitter<void>();

  @Output() reviewTask = new EventEmitter<{
    id: number;
    approve: boolean;
  }>();

  exportPdf() {
    const head = [["User", "Date", "Project", "Hours"]];
    const body = this.tasks().map((task) => [
      PdfExportService.toTitleCase(task.user.fullName),
      PdfExportService.formatDate(task.date),

      PdfExportService.toTitleCase(task.job?.name || ""),
      task.elapseTime(),
    ]);

    PdfExportService.exportTable({
      title: "TIMESHEET",
      dateRange: `${this.fromDate()} - ${this.toDate()}`,
      head,
      body,
      filename: "timesheet.pdf",
    });
  }
}
