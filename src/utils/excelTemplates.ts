import { utils, writeFile } from 'xlsx';
import { estimationMatrix } from '../data/estimationMatrix';
import { complexityTooltips } from '../data/tooltips';

const templateStructure = {
  'Instructions': [
    ['WRICEF Estimation Template Instructions'],
    [''],
    ['1. Work Package Details Sheet:'],
    ['   - Fill in the work package name, description, and contingency factor'],
    ['   - Contingency factor should be between 0 and 50%'],
    ['   - Each work package should have a unique name'],
    [''],
    ['2. WRICEF Components Sheet:'],
    ['   - Each row represents a component estimation'],
    ['   - Work Package Name must match exactly with the name in Work Package Details'],
    ['   - Component Types:'],
    ...Object.keys(estimationMatrix).map(type => [`     • ${type}`]),
    [''],
    ['3. Complexity Levels:'],
    ['   - High, Medium, Low'],
    ['   - Effort Guidelines:'],
    ...Object.entries(estimationMatrix).flatMap(([type, data]) => [
      [`   ${type}:`],
      [`     • High: ${data.High.baseDays} days - ${complexityTooltips[type].High}`],
      [`     • Medium: ${data.Medium.baseDays} days - ${complexityTooltips[type].Medium}`],
      [`     • Low: ${data.Low.baseDays} days - ${complexityTooltips[type].Low}`],
      ['']
    ]),
    ['4. Important Notes:'],
    ['   - All fields in Work Package Details are required'],
    ['   - Quantity must be a positive number'],
    ['   - Do not modify sheet names or column headers'],
    ['   - Ensure data consistency between sheets']
  ],
  'Work Package Details': [
    ['Work Package Name', 'Description', 'Contingency Factor (%)'],
    ['Sample Work Package', 'Description of the work package', '10'],
    ['Innovation Project', 'AI-driven process automation initiative', '15']
  ],
  'WRICEF Components': [
    ['Work Package Name', 'Component Type', 'Complexity', 'Quantity'],
    ['Sample Work Package', 'Workflow', 'High', '2'],
    ['Sample Work Package', 'Report', 'Medium', '3'],
    ['Innovation Project', 'Innovation and Automation', 'High', '1'],
    ['Innovation Project', 'Innovation and Automation', 'Medium', '2'],
    ['Innovation Project', 'Interface', 'Low', '1']
  ]
};

function formatInstructionsSheet(ws: any) {
  // Add some basic styling to make instructions more readable
  const range = utils.decode_range(ws['!ref'] || 'A1');
  
  // Format headers
  for (let R = range.s.r; R <= range.e.r; ++R) {
    const cell = ws[utils.encode_cell({ r: R, c: 0 })];
    if (cell?.v && typeof cell.v === 'string' && cell.v.includes(':')) {
      cell.s = { font: { bold: true }, fill: { fgColor: { rgb: "E8E8E8" } } };
    }
  }

  // Auto-size columns
  const maxWidth = Math.max(...templateStructure.Instructions.map(row => 
    row[0] ? row[0].toString().length : 0
  ));
  
  ws['!cols'] = [{ wch: maxWidth + 2 }];
}

export function downloadTemplate() {
  const wb = utils.book_new();

  // Create sheets
  Object.entries(templateStructure).forEach(([sheetName, data]) => {
    const ws = utils.aoa_to_sheet(data);

    // Apply special formatting for Instructions sheet
    if (sheetName === 'Instructions') {
      formatInstructionsSheet(ws);
    } else {
      // Auto-size columns for other sheets
      const range = utils.decode_range(ws['!ref'] || 'A1');
      const maxColWidths = new Array(range.e.c + 1).fill(0);

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = ws[utils.encode_cell({ r: R, c: C })];
          if (cell?.v) {
            const length = cell.v.toString().length;
            maxColWidths[C] = Math.max(maxColWidths[C], length);
          }
        }
      }

      ws['!cols'] = maxColWidths.map(width => ({ wch: width + 2 }));
    }

    utils.book_append_sheet(wb, ws, sheetName);
  });

  // Save file
  writeFile(wb, 'WRICEF_Estimation_Template.xlsx');
}