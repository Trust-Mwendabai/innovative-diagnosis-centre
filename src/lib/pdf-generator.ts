import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PatientReportData {
    patientName: string;
    patientId: string;
    testName: string;
    date: string;
    status: string;
    results: { parameter: string; value: string; range: string; unit: string }[];
    technician: string;
}

export const generateBrandedPDF = (data: PatientReportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // -- Header Section --
    // Background accent
    doc.setFillColor(15, 23, 42); // slate-950
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo / Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('IDC', 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('INTEGRATED DIAGNOSTIC CONTROL', 20, 28);

    doc.setTextColor(212, 175, 55); // Gold color
    doc.text('PREMIUM HEALTH ARCHIVE', pageWidth - 70, 25);

    // -- Report Title --
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DIAGNOSTIC REPORT', 20, 55);

    // -- Patient Information Table --
    autoTable(doc, {
        startY: 65,
        theme: 'plain',
        body: [
            ['Patient Name:', data.patientName, 'Report ID:', data.patientId.padStart(6, '0')],
            ['Test Type:', data.testName, 'Date:', data.date],
            ['Status:', data.status, 'Technician:', data.technician || 'Verified System']
        ],
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 30 },
            2: { fontStyle: 'bold', cellWidth: 30 }
        }
    });

    // -- Results Table --
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Laboratory Findings', 20, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Parameter', 'Value', 'Reference Range', 'Unit']],
        body: data.results.map(r => [r.parameter, r.value, r.range, r.unit]),
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 20, right: 20 }
    });

    // -- Footer --
    const finalY = (doc as any).lastAutoTable.finalY;

    // Digital Seal
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.circle(pageWidth - 40, finalY + 25, 15, 'S');
    doc.setFontSize(6);
    doc.setTextColor(212, 175, 55);
    doc.text('IDC VERIFIED', pageWidth - 50, finalY + 25);
    doc.text('DIGITAL SEAL', pageWidth - 50, finalY + 28);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text('This is a digitally generated report and remains the property of IDC.', 20, 280);
    doc.text('Page 1 of 1', pageWidth - 30, 280);

    // Save PDF
    doc.save(`IDC_Report_${data.patientId}_${data.date.replace(/\//g, '-')}.pdf`);
};
