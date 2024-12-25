import React, { useState } from 'react';
import { Dialog } from './Dialog';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (reportName: string) => void;
  type: 'excel' | 'pdf';
}

export function ExportDialog({ isOpen, onClose, onExport, type }: ExportDialogProps) {
  const [reportName, setReportName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportName.trim()) {
      onExport(reportName.trim());
      setReportName('');
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Export ${type.toUpperCase()} Report`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reportName" className="block text-sm font-medium text-gray-700 mb-1">
            Report Name *
          </label>
          <input
            type="text"
            id="reportName"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3E0] focus:ring-[#00A3E0]"
            placeholder="Enter report name"
            required
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#00A3E0] text-white rounded-md hover:bg-[#0091c7] transition-colors"
          >
            Export
          </button>
        </div>
      </form>
    </Dialog>
  );
}