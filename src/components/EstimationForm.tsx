import React, { useState } from 'react';
import { FileSpreadsheet, Trash2, FileText } from 'lucide-react';
import { WorkPackageList } from './WorkPackageList';
import { DraftsList } from './DraftsList';
import { BulkImportSection } from './BulkImportSection';
import { ExportDialog } from './ExportDialog';
import { useWorkPackages } from '../hooks/useWorkPackages';
import { exportToExcel } from '../utils/excelExport';
import { exportToPDF } from '../utils/pdfExport';

export function EstimationForm() {
  const [exportType, setExportType] = useState<'excel' | 'pdf' | null>(null);
  const {
    workPackages,
    drafts,
    addWorkPackage,
    removeWorkPackage,
    updateWorkPackage,
    addComponent,
    removeComponent,
    updateEstimate,
    saveDraft,
    loadDraft,
    clearAllDrafts,
    importWorkPackages,
    bulkDistribute,
  } = useWorkPackages();

  const handleExportExcel = (reportName: string) => {
    exportToExcel({ workPackages }, reportName);
  };

  const handleExportPDF = (reportName: string) => {
    exportToPDF(workPackages, reportName);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#00338D]">KPMG SAP EMA Hub WRICEF Estimation</h1>
        <div className="flex items-center gap-4">
          {drafts.length > 0 && (
            <button
              onClick={clearAllDrafts}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Drafts
            </button>
          )}
          {workPackages.length > 0 && (
            <>
              <button
                onClick={() => setExportType('pdf')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#00338D] text-white rounded-md hover:bg-[#002266] transition-colors"
              >
                <FileText className="w-4 h-4" />
                Export PDF Report
              </button>
              <button
                onClick={() => setExportType('excel')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#005EB8] text-white rounded-md hover:bg-[#004c95] transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export to Excel
              </button>
            </>
          )}
        </div>
      </div>

      <BulkImportSection onImport={importWorkPackages} />

      <DraftsList
        drafts={drafts}
        onLoadDraft={loadDraft}
        onDeleteDraft={removeWorkPackage}
      />

      <WorkPackageList
        workPackages={workPackages}
        onAddWorkPackage={addWorkPackage}
        onRemoveWorkPackage={removeWorkPackage}
        onUpdateWorkPackage={updateWorkPackage}
        onAddComponent={addComponent}
        onRemoveComponent={removeComponent}
        onUpdateEstimate={updateEstimate}
        onSaveDraft={saveDraft}
        onBulkDistribute={bulkDistribute}
      />

      <ExportDialog
        isOpen={exportType !== null}
        onClose={() => setExportType(null)}
        onExport={exportType === 'excel' ? handleExportExcel : handleExportPDF}
        type={exportType || 'excel'}
      />
    </div>
  );
}