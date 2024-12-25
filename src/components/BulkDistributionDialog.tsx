import React, { useState } from 'react';
import { Dialog } from './Dialog';
import type { Complexity } from '../types/estimation';

interface BulkDistributionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDistribute: (counts: Record<Complexity, number>) => void;
}

interface ComplexityCount {
  High: number;
  Medium: number;
  Low: number;
}

export function BulkDistributionDialog({ isOpen, onClose, onDistribute }: BulkDistributionDialogProps) {
  const [counts, setCounts] = useState<ComplexityCount>({
    High: 0,
    Medium: 0,
    Low: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDistribute(counts);
    setCounts({ High: 0, Medium: 0, Low: 0 });
  };

  const handleCountChange = (complexity: Complexity, value: string) => {
    const numValue = parseInt(value) || 0;
    setCounts(prev => ({
      ...prev,
      [complexity]: Math.max(0, numValue)
    }));
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Bulk WRICEF Distribution">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the total number of components for each complexity level. 
            The system will automatically distribute them across WRICEF categories.
          </p>
          
          {(['High', 'Medium', 'Low'] as const).map(complexity => (
            <div key={complexity}>
              <label htmlFor={complexity} className="block text-sm font-medium text-gray-700 mb-1">
                {complexity} Complexity Components
              </label>
              <input
                type="number"
                id={complexity}
                min="0"
                value={counts[complexity]}
                onChange={(e) => handleCountChange(complexity, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3E0] focus:ring-[#00A3E0]"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
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
            Distribute Components
          </button>
        </div>
      </form>
    </Dialog>
  );
}