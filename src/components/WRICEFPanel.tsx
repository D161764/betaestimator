import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Save, Edit } from 'lucide-react';
import { ComplexityInput } from './ComplexityInput';
import { EffortSplitPanel } from './EffortSplitPanel';
import { calculateEffortSplit } from '../utils/effortSplitUtils';
import type { WRICEFEstimate, Complexity } from '../types/estimation';

interface WRICEFPanelProps {
  estimate: WRICEFEstimate;
  onChange: (type: WRICEFEstimate['type'], complexity: Complexity, quantity: number) => void;
  onRemove: (type: WRICEFEstimate['type']) => void;
  onSave: (type: WRICEFEstimate['type']) => void;
  tooltips: Record<Complexity, string>;
}

export function WRICEFPanel({ estimate, onChange, onRemove, onSave, tooltips }: WRICEFPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showEffortSplit, setShowEffortSplit] = useState(false);
  
  const totalEffort = Object.entries(estimate.estimates).reduce(
    (sum, [_, est]) => sum + (est.quantity * est.baseDays),
    0
  );

  const effortSplit = calculateEffortSplit(estimate);
  const functionalTotal = Math.round((
    effortSplit.functional.lead + 
    effortSplit.functional.consultant.junior + 
    effortSplit.functional.consultant.mid + 
    effortSplit.functional.consultant.senior
  ) * 10) / 10;

  const technicalTotal = Math.round((
    effortSplit.technical.architect + 
    effortSplit.technical.consultant.junior + 
    effortSplit.technical.consultant.mid + 
    effortSplit.technical.consultant.senior
  ) * 10) / 10;

  const handleSave = () => {
    setIsEditing(false);
    onSave(estimate.type);
  };

  return (
    <div className="mb-6 p-4 border rounded-md bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-[#00338D]">{estimate.type}</h3>
          {totalEffort > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium bg-[#005EB8] text-white px-3 py-1 rounded">
                Total: {Math.round(totalEffort * 10) / 10} days
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Functional:</span>
                  <span className="font-medium">{functionalTotal} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Technical:</span>
                  <span className="font-medium">{technicalTotal} days</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {totalEffort > 0 && (
            <button
              onClick={() => setShowEffortSplit(!showEffortSplit)}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              title={showEffortSplit ? "Hide effort split" : "Show effort split"}
            >
              {showEffortSplit ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          )}
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="Save changes"
            >
              <Save className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit estimates"
            >
              <Edit className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => onRemove(estimate.type)}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Remove component"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {(['High', 'Medium', 'Low'] as const).map((complexity) => (
          <ComplexityInput
            key={complexity}
            complexity={complexity}
            estimate={estimate.estimates[complexity]}
            onChange={(c, q) => {
              if (isEditing) {
                onChange(estimate.type, c, q);
              }
            }}
            disabled={!isEditing}
            tooltip={tooltips[complexity]}
          />
        ))}
      </div>

      {showEffortSplit && totalEffort > 0 && (
        <EffortSplitPanel split={effortSplit} />
      )}
    </div>
  );
}