import React, { useState } from 'react';
import { FileDown, Upload, AlertCircle } from 'lucide-react';
import { downloadTemplate } from '../utils/excelTemplates';
import { importExcelFile } from '../utils/excelImport';
import type { WorkPackage } from '../types/workPackage';

interface BulkImportSectionProps {
  onImport: (workPackages: WorkPackage[]) => void;
}

export function BulkImportSection({ onImport }: BulkImportSectionProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const workPackages = await importExcelFile(file);
      if (workPackages.length === 0) {
        throw new Error('No valid work packages found in the file');
      }
      onImport(workPackages);
      event.target.value = ''; // Reset input
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold text-[#00338D] mb-4">Bulk Import</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A3E0] text-white rounded-md hover:bg-[#0091c7] transition-colors"
            disabled={isLoading}
          >
            <FileDown className="w-4 h-4" />
            Download Template
          </button>
          <div>
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#005EB8] hover:bg-[#004c95] cursor-pointer'
              } text-white rounded-md transition-colors`}
            >
              <Upload className="w-4 h-4" />
              {isLoading ? 'Importing...' : 'Import Excel'}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}