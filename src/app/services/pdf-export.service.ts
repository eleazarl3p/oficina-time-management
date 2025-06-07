import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

export class PdfExportService {
  static exportTable({
    title,
    dateRange,
    head,
    body,
    filename = 'report.pdf',
    totalWork,
    totalLunch,
  }: {
    title: string;
    dateRange: string;
    head: string[][];
    body: RowInput[];
    filename?: string;
    totalWork: string;
    totalLunch: string;
  }) {
    const doc = new jsPDF({ orientation: 'landscape' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`(${dateRange})`, pageWidth / 2, 22, { align: 'center' });
    let finalY = 28;
    autoTable(doc, {
      startY: 28,
      head,
      body,
      styles: {
        fontSize: 9,
        textColor: [33, 37, 41],
        cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
        halign: 'center',
      },
      headStyles: {
        fillColor: [209, 213, 219],
        textColor: 0,
        fontStyle: 'bold',
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246],
      },
      tableLineColor: [209, 213, 219],
      tableLineWidth: 0.2,
      didDrawPage: (data) => {
        if (data.cursor) {
          finalY = data.cursor.y;
        }
        const pageNumber = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(`Page ${pageNumber}`, pageWidth - 15, pageHeight - 10);
      },
    });

    doc.setFontSize(10);
    doc.text(`Total Work Hours: ${totalWork}`, 14, finalY + 10);
    if (Number(totalLunch) > 0) {
      doc.text(`Total Lunch Hours: ${totalLunch}`, 70, finalY + 10);
    }
    doc.save(filename);
  }

  static toTitleCase(str: string = ''): string {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
  }

  static formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  static formatTime(time: string | Date): string {
    return new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
