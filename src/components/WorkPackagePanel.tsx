import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Save, Edit, Layers } from 'lucide-react';
import { WRICEFSelector } from './WRICEFSelector';
import { WRICEFPanel } from './WRICEFPanel';
import { TimelineSlider } from './TimelineSlider';
import { FTEDisplay } from './FTEDisplay';
import { calculateWorkPackageEffort } from '../utils/estimationUtils';
import { calculateEffortSplit } from '../utils/effortSplitUtils';
import { complexityTooltips } from '../data/tooltips';
import type { WorkPackage } from '../types/workPackage';
import type { WRICEFType, Complexity } from '../types/estimation';

interface WorkPackagePanelProps {
  workPackage: WorkPackage;
  onRemove: () => void;
  onUpdate: (updates: Partial<WorkPackage>) => void;
  onAddComponent: (type: WRICEFType) => void;
  onRemoveComponent: (type: WRICEFType) => void;
  onUpdateEstimate: (type: WRICEFType, complexity: Complexity, quantity: number) => void;
  onSaveDraft: () => void;
  onSaveComponent: (type: WRICEFType) => void;
  onBulkDistribute: () => void;
}

export function WorkPackagePanel({
  workPackage,
  onRemove,
  onUpdate,
  onAddComponent,
  onRemoveComponent,
  onUpdateEstimate,
  onSaveDraft,
  onSaveComponent,
  onBulkDistribute
}: WorkPackagePanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { baseEffort, totalEffort, fte } = calculateWorkPackageEffort(workPackage);

  const handleSave = () => {
    setIsEditing(false);
    onSaveDraft();
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={workPackage.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3E0] focus:ring-[#00A3E0]"
                  placeholder="Work Package Name"
                />
                <textarea
                  value={workPackage.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3E0] focus:ring-[#00A3E0]"
                  placeholder="Description (optional)"
                  rows={2}
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-[#00338D]">{workPackage.name}</h3>
                {workPackage.description && (
                  <p className="text-sm text-gray-500">{workPackage.description}</p>
                )}
              </div>
            )}
          </div>
          {totalEffort > 0 && (
            <div className="text-sm font-medium bg-[#005EB8] text-white px-3 py-1 rounded">
              Total: {Math.round(totalEffort * 10) / 10} days
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="Save changes"
            >
              <Save className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit work package"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={onBulkDistribute}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                title="Bulk distribute components"
              >
                <Layers className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={onRemove}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Remove work package"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <TimelineSlider
            value={workPackage.timeline || 60}
            onChange={(value) => onUpdate({ timeline: value })}
          />

          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Contingency Factor (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={workPackage.contingencyFactor}
              onChange={(e) =>
                onUpdate({ contingencyFactor: Math.min(50, Math.max(0, parseInt(e.target.value) || 0)) })
              }
              className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-[#00A3E0] focus:ring-[#00A3E0]"
            />
          </div>

          <WRICEFSelector
            onSelect={onAddComponent}
            existingTypes={workPackage.estimates.map((est) => est.type)}
          />

          {workPackage.estimates.map((estimate) => (
            <WRICEFPanel
              key={estimate.type}
              estimate={estimate}
              onChange={(type, complexity, quantity) =>
                onUpdateEstimate(type, complexity, quantity)
              }
              onRemove={onRemoveComponent}
              onSave={onSaveComponent}
              tooltips={complexityTooltips[estimate.type]}
            />
          ))}

          {workPackage.estimates.length > 0 && (
            <>
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Base Effort</p>
                    <p className="text-lg font-semibold">{Math.round(baseEffort * 10) / 10} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      With Contingency ({workPackage.contingencyFactor}%)
                    </p>
                    <p className="text-lg font-semibold">{Math.round(totalEffort * 10) / 10} days</p>
                  </div>
                </div>
              </div>
              
              {fte && <FTEDisplay fte={fte} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}