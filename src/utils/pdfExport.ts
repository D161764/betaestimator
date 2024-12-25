import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { WorkPackage } from '../types/workPackage';
import { calculateWorkPackageEffort } from './estimationUtils';
import { calculateEffortSplit } from './effortSplitUtils';

function roundToOne(num: number): number {
  return Math.round(num * 10) / 10;
}

export function exportToPDF(workPackages: WorkPackage[], reportName: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 141); // #00338D
  doc.text('WRICEF Estimation Report', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(reportName, pageWidth / 2, 30, { align: 'center' });

  let yPos = 50;

  workPackages.forEach((wp, index) => {
    const { totalEffort, fte } = calculateWorkPackageEffort(wp);

    // Add page break if needed
    if (yPos > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yPos = 20;
    }

    // Work Package Header
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 141);
    doc.text(`Work Package: ${wp.name}`, 14, yPos);
    yPos += 10;

    if (wp.description) {
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Description: ${wp.description}`, 14, yPos);
      yPos += 10;
    }

    // Timeline and Contingency
    doc.setFontSize(11);
    doc.text(`Timeline: ${wp.timeline || 60} days`, 14, yPos);
    doc.text(`Contingency: ${wp.contingencyFactor}%`, 100, yPos);
    yPos += 15;

    // Component Details
    wp.estimates.forEach(est => {
      const effortSplit = calculateEffortSplit(est);
      const componentTotal = Object.values(est.estimates).reduce(
        (sum, e) => sum + e.quantity * e.baseDays, 0
      );

      // Basic component info
      doc.autoTable({
        startY: yPos,
        head: [[
          { content: est.type, colSpan: 5, styles: { fillColor: [0, 94, 184], textColor: 255 } }
        ]],
        body: [
          ['Complexity', 'Quantity', 'Base Days', 'Functional', 'Technical'],
          ...Object.entries(est.estimates).map(([complexity, data]) => [
            complexity,
            data.quantity,
            data.baseDays,
            `${data.functionalSplit}%`,
            `${data.technicalSplit}%`
          ]),
          ['Total', '', '', '', `${roundToOne(componentTotal)} days`]
        ],
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Detailed effort split
      doc.autoTable({
        startY: yPos,
        head: [[{ content: 'Effort Distribution', colSpan: 3, styles: { fillColor: [0, 163, 224] } }]],
        body: [
          ['Role Type', 'Functional (Days)', 'Technical (Days)'],
          ['Lead/Architect', 
            roundToOne(effortSplit.functional.lead),
            roundToOne(effortSplit.technical.architect)
          ],
          ['Senior Consultant (High)',
            roundToOne(effortSplit.functional.consultant.senior),
            roundToOne(effortSplit.technical.consultant.senior)
          ],
          ['Consultant (Medium)',
            roundToOne(effortSplit.functional.consultant.mid),
            roundToOne(effortSplit.technical.consultant.mid)
          ],
          ['Junior Consultant (Low)',
            roundToOne(effortSplit.functional.consultant.junior),
            roundToOne(effortSplit.technical.consultant.junior)
          ]
        ],
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    });

    // FTE Information
    if (fte) {
      doc.autoTable({
        startY: yPos,
        head: [[{ content: 'FTE Requirements', colSpan: 4, styles: { fillColor: [0, 51, 141] } }]],
        body: [
          ['Role', 'Functional', 'Technical'],
          ['Lead/Architect', fte.functional.lead.toFixed(2), fte.technical.architect.toFixed(2)],
          ['Senior Consultant', fte.functional.seniorConsultant.toFixed(2), fte.technical.seniorConsultant.toFixed(2)],
          ['Consultant', fte.functional.consultant.toFixed(2), fte.technical.consultant.toFixed(2)],
          ['Junior Consultant', fte.functional.juniorConsultant.toFixed(2), fte.technical.juniorConsultant.toFixed(2)]
        ],
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Add page break between work packages
    if (index < workPackages.length - 1) {
      doc.addPage();
      yPos = 20;
    }
  });

  doc.save(`${reportName}.pdf`);
}