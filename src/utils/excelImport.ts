import { utils, read } from 'xlsx';
import type { WorkPackage } from '../types/workPackage';
import type { WRICEFType, Complexity } from '../types/estimation';
import { estimationMatrix } from '../data/estimationMatrix';
import { createNewEstimate } from './estimationUtils';

interface ExcelRow {
  'Work Package Name': string;
  'Description'?: string;
  'Contingency Factor (%)'?: string;
  'Component Type'?: WRICEFType;
  'Complexity'?: Complexity;
  'Quantity'?: string;
}

interface ValidationError {
  sheet: string;
  row: number;
  message: string;
}

function validateExcelData(
  detailsData: ExcelRow[], 
  componentsData: ExcelRow[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  const wpNames = new Set<string>();

  // Validate Work Package Details
  detailsData.forEach((row, index) => {
    if (!row['Work Package Name']) {
      errors.push({
        sheet: 'Work Package Details',
        row: index + 2, // Add 2 for header row and 1-based index
        message: 'Work Package Name is required'
      });
    } else {
      wpNames.add(row['Work Package Name']);
    }

    const contingency = parseInt(row['Contingency Factor (%)'] || '0');
    if (isNaN(contingency) || contingency < 0 || contingency > 50) {
      errors.push({
        sheet: 'Work Package Details',
        row: index + 2,
        message: 'Contingency Factor must be between 0 and 50'
      });
    }
  });

  // Validate WRICEF Components
  componentsData.forEach((row, index) => {
    if (!row['Work Package Name']) {
      errors.push({
        sheet: 'WRICEF Components',
        row: index + 2,
        message: 'Work Package Name is required'
      });
    } else if (!wpNames.has(row['Work Package Name'])) {
      errors.push({
        sheet: 'WRICEF Components',
        row: index + 2,
        message: `Work Package "${row['Work Package Name']}" not found in Work Package Details`
      });
    }

    if (!row['Component Type'] || !estimationMatrix[row['Component Type']]) {
      errors.push({
        sheet: 'WRICEF Components',
        row: index + 2,
        message: `Invalid Component Type: ${row['Component Type']}`
      });
    }

    if (!row['Complexity'] || !['High', 'Medium', 'Low'].includes(row['Complexity'])) {
      errors.push({
        sheet: 'WRICEF Components',
        row: index + 2,
        message: 'Complexity must be High, Medium, or Low'
      });
    }

    const quantity = parseInt(row['Quantity'] || '0');
    if (isNaN(quantity) || quantity <= 0) {
      errors.push({
        sheet: 'WRICEF Components',
        row: index + 2,
        message: 'Quantity must be a positive number'
      });
    }
  });

  return errors;
}

export async function importExcelFile(file: File): Promise<WorkPackage[]> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = read(buffer);

    // Get both sheets
    const detailsSheet = workbook.Sheets['Work Package Details'];
    const componentsSheet = workbook.Sheets['WRICEF Components'];

    if (!detailsSheet || !componentsSheet) {
      throw new Error('Required sheets "Work Package Details" and "WRICEF Components" not found');
    }

    // Convert sheets to JSON
    const detailsData = utils.sheet_to_json<ExcelRow>(detailsSheet);
    const componentsData = utils.sheet_to_json<ExcelRow>(componentsSheet);

    // Validate data
    const validationErrors = validateExcelData(detailsData, componentsData);
    if (validationErrors.length > 0) {
      throw new Error(
        'Validation errors found:\n' +
        validationErrors.map(err => 
          `${err.sheet} (Row ${err.row}): ${err.message}`
        ).join('\n')
      );
    }

    // Process work package details
    const workPackages = new Map<string, WorkPackage>();

    // Create work packages from the details sheet
    detailsData.forEach(row => {
      if (!row['Work Package Name']) return;

      workPackages.set(row['Work Package Name'], {
        id: crypto.randomUUID(),
        name: row['Work Package Name'],
        description: row['Description'] || '',
        contingencyFactor: Math.min(50, Math.max(0, parseInt(row['Contingency Factor (%)'] || '0'))),
        estimates: []
      });
    });

    // Add components from the components sheet
    componentsData.forEach(row => {
      const wpName = row['Work Package Name'];
      const componentType = row['Component Type'] as WRICEFType;
      const complexity = row['Complexity'] as Complexity;
      const quantity = parseInt(row['Quantity'] || '0');

      if (!wpName || !componentType || !complexity || !quantity) return;
      if (!estimationMatrix[componentType]) return;
      if (!['High', 'Medium', 'Low'].includes(complexity)) return;

      const workPackage = workPackages.get(wpName);
      if (!workPackage) return;

      let estimate = workPackage.estimates.find(e => e.type === componentType);
      if (!estimate) {
        estimate = createNewEstimate(componentType);
        workPackage.estimates.push(estimate);
      }

      estimate.estimates[complexity].quantity = quantity;
    });

    return Array.from(workPackages.values());
  } catch (error) {
    console.error('Error importing Excel file:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to import Excel file');
  }
}