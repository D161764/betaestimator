import { utils, writeFile } from 'xlsx';
import type { WorkPackage } from '../types/workPackage';
import { calculateWorkPackageEffort } from './estimationUtils';
import { calculateEffortSplit } from './effortSplitUtils';

interface ExportData {
  workPackages: WorkPackage[];
}

export function exportToExcel({ workPackages }: ExportData, reportName: string) {
  // Create summary data
  const summaryData = workPackages.flatMap(wp => {
    const { totalEffort, fte } = calculateWorkPackageEffort(wp);
    
    const estimates = wp.estimates.map(est => {
      const effortSplit = calculateEffortSplit(est);
      return {
        'Work Package': wp.name,
        'Timeline (Days)': wp.timeline || 60,
        'WRICEF Type': est.type,
        'High': est.estimates.High.quantity,
        'Medium': est.estimates.Medium.quantity,
        'Low': est.estimates.Low.quantity,
        'Functional Split': `${Math.round(
          (effortSplit.functional.lead + 
          effortSplit.functional.consultant.senior + 
          effortSplit.functional.consultant.mid + 
          effortSplit.functional.consultant.junior) * 10
        ) / 10} days`,
        'Technical Split': `${Math.round(
          (effortSplit.technical.architect + 
          effortSplit.technical.consultant.senior + 
          effortSplit.technical.consultant.mid + 
          effortSplit.technical.consultant.junior) * 10
        ) / 10} days`,
        'Total Effort (Days)': Math.round(totalEffort * 10) / 10
      };
    });

    return [
      ...estimates,
      {
        'Work Package': `${wp.name} Total`,
        'Timeline (Days)': wp.timeline || 60,
        'WRICEF Type': '',
        'High': '',
        'Medium': '',
        'Low': '',
        'Functional Split': '',
        'Technical Split': '',
        'Total Effort (Days)': Math.round(totalEffort * 10) / 10
      }
    ];
  });

  // Create detailed view
  const detailedData = workPackages.flatMap(wp =>
    wp.estimates.flatMap(est => {
      const effortSplit = calculateEffortSplit(est);
      return Object.entries(est.estimates).map(([complexity, details]) => ({
        'Work Package': wp.name,
        'Component Type': est.type,
        'Complexity': complexity,
        'Quantity': details.quantity,
        'Base Days': details.baseDays,
        'Functional Split (%)': details.functionalSplit,
        'Technical Split (%)': details.technicalSplit,
        'Functional Lead': Math.round(effortSplit.functional.lead * 10) / 10,
        'Functional Senior': Math.round(effortSplit.functional.consultant.senior * 10) / 10,
        'Functional Mid': Math.round(effortSplit.functional.consultant.mid * 10) / 10,
        'Functional Junior': Math.round(effortSplit.functional.consultant.junior * 10) / 10,
        'Technical Architect': Math.round(effortSplit.technical.architect * 10) / 10,
        'Technical Senior': Math.round(effortSplit.technical.consultant.senior * 10) / 10,
        'Technical Mid': Math.round(effortSplit.technical.consultant.mid * 10) / 10,
        'Technical Junior': Math.round(effortSplit.technical.consultant.junior * 10) / 10,
        'Total Days': Math.round(details.quantity * details.baseDays * 10) / 10
      }));
    }).filter(row => row.Quantity > 0)
  );

  // Create FTE data
  const fteData = workPackages.flatMap(wp => {
    const { fte } = calculateWorkPackageEffort(wp);
    if (!fte) return [];

    return [{
      'Work Package': wp.name,
      'Timeline (Days)': wp.timeline || 60,
      'Role Type': 'Functional',
      'Lead/Architect': fte.functional.lead.toFixed(2),
      'Senior Consultant': fte.functional.seniorConsultant.toFixed(2),
      'Consultant': fte.functional.consultant.toFixed(2),
      'Junior Consultant': fte.functional.juniorConsultant.toFixed(2)
    }, {
      'Work Package': wp.name,
      'Timeline (Days)': wp.timeline || 60,
      'Role Type': 'Technical',
      'Lead/Architect': fte.technical.architect.toFixed(2),
      'Senior Consultant': fte.technical.seniorConsultant.toFixed(2),
      'Consultant': fte.technical.consultant.toFixed(2),
      'Junior Consultant': fte.technical.juniorConsultant.toFixed(2)
    }];
  });

  // Create workbook
  const wb = utils.book_new();

  // Add worksheets
  utils.book_append_sheet(wb, utils.json_to_sheet(summaryData), 'Summary');
  utils.book_append_sheet(wb, utils.json_to_sheet(detailedData), 'Detailed View');
  utils.book_append_sheet(wb, utils.json_to_sheet(fteData), 'FTE Analysis');

  // Auto-size columns
  ['Summary', 'Detailed View', 'FTE Analysis'].forEach(sheet => {
    const ws = wb.Sheets[sheet];
    const range = utils.decode_range(ws['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let max = 0;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[utils.encode_cell({ r: R, c: C })];
        if (cell && cell.v) {
          const length = cell.v.toString().length;
          if (length > max) max = length;
        }
      }
      ws['!cols'] = ws['!cols'] || [];
      ws['!cols'][C] = { wch: max + 2 };
    }
  });

  // Save file
  writeFile(wb, `${reportName}.xlsx`);
}