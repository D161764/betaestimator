import React from 'react';
import { Plus } from 'lucide-react';
import type { WRICEFType } from '../types/estimation';
import { estimationMatrix } from '../data/estimationMatrix';

interface WRICEFSelectorProps {
  onSelect: (type: WRICEFType) => void;
  existingTypes: WRICEFType[];
}

export function WRICEFSelector({ onSelect, existingTypes }: WRICEFSelectorProps) {
  const availableTypes = Object.keys(estimationMatrix).filter(
    type => !existingTypes.includes(type as WRICEFType)
  );

  if (availableTypes.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <select
          onChange={(e) => onSelect(e.target.value as WRICEFType)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-[#00A3E0] focus:ring-[#00A3E0]"
          defaultValue=""
        >
          <option value="" disabled>Select Component Type</option>
          {availableTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button
          onClick={() => {
            const select = document.querySelector('select') as HTMLSelectElement;
            if (select.value) onSelect(select.value as WRICEFType);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A3E0] text-white rounded-md hover:bg-[#0091c7] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Component
        </button>
      </div>
    </div>
  );
}