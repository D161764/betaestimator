import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { WorkPackagePanel } from './WorkPackagePanel';
import { AddWorkPackageDialog } from './AddWorkPackageDialog';
import { BulkDistributionDialog } from './BulkDistributionDialog';
import type { WorkPackage } from '../types/workPackage';
import type { WRICEFType, Complexity } from '../types/estimation';

interface WorkPackageListProps {
  workPackages: WorkPackage[];
  onAddWorkPackage: (name: string, description: string) => void;
  onRemoveWorkPackage: (id: string) => void;
  onUpdateWorkPackage: (id: string, updates: Partial<WorkPackage>) => void;
  onAddComponent: (workPackageId: string, type: WRICEFType) => void;
  onRemoveComponent: (workPackageId: string, type: WRICEFType) => void;
  onUpdateEstimate: (workPackageId: string, type: WRICEFType, complexity: Complexity, quantity: number) => void;
  onSaveDraft: (workPackage: WorkPackage) => void;
  onBulkDistribute: (workPackageId: string, counts: Record<Complexity, number>) => void;
}

export function WorkPackageList({
  workPackages,
  onAddWorkPackage,
  onRemoveWorkPackage,
  onUpdateWorkPackage,
  onAddComponent,
  onRemoveComponent,
  onUpdateEstimate,
  onSaveDraft,
  onBulkDistribute,
}: WorkPackageListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDistributionDialogOpen, setIsDistributionDialogOpen] = useState(false);
  const [selectedWorkPackageId, setSelectedWorkPackageId] = useState<string | null>(null);

  const handleDistribution = (counts: Record<Complexity, number>) => {
    if (!selectedWorkPackageId) return;
    onBulkDistribute(selectedWorkPackageId, counts);
    setIsDistributionDialogOpen(false);
    setSelectedWorkPackageId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#00338D]">Work Packages</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A3E0] text-white rounded-md hover:bg-[#0091c7] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Work Package
          </button>
        </div>
      </div>

      <AddWorkPackageDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={onAddWorkPackage}
      />

      <BulkDistributionDialog
        isOpen={isDistributionDialogOpen}
        onClose={() => {
          setIsDistributionDialogOpen(false);
          setSelectedWorkPackageId(null);
        }}
        onDistribute={handleDistribution}
      />

      {workPackages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No work packages added yet. Click the button above to add one.
        </div>
      ) : (
        workPackages.map((wp) => (
          <WorkPackagePanel
            key={wp.id}
            workPackage={wp}
            onRemove={() => onRemoveWorkPackage(wp.id)}
            onUpdate={(updates) => onUpdateWorkPackage(wp.id, updates)}
            onAddComponent={(type) => onAddComponent(wp.id, type)}
            onRemoveComponent={(type) => onRemoveComponent(wp.id, type)}
            onUpdateEstimate={(type, complexity, quantity) =>
              onUpdateEstimate(wp.id, type, complexity, quantity)
            }
            onSaveDraft={() => onSaveDraft(wp)}
            onSaveComponent={(type) => {
              onSaveDraft(wp);
            }}
            onBulkDistribute={() => {
              setSelectedWorkPackageId(wp.id);
              setIsDistributionDialogOpen(true);
            }}
          />
        ))
      )}
    </div>
  );
}