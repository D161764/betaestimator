import { useState, useEffect } from 'react';
import type { WorkPackage } from '../types/workPackage';
import type { WRICEFType, Complexity } from '../types/estimation';
import { createNewEstimate } from '../utils/estimationUtils';
import { DraftStorage } from '../utils/draftStorage';
import type { DraftWorkPackage } from '../types/draft';
import { distributeBulkEstimates } from '../utils/distributionUtils';

const draftStorage = new DraftStorage();

export function useWorkPackages() {
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>([]);
  const [drafts, setDrafts] = useState<DraftWorkPackage[]>([]);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const loadedDrafts = await draftStorage.getAllDrafts();
      setDrafts(loadedDrafts);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  };

  const addWorkPackage = (name: string, description: string = '') => {
    const newWorkPackage: WorkPackage = {
      id: crypto.randomUUID(),
      name,
      description,
      contingencyFactor: 0,
      estimates: [],
    };
    setWorkPackages([...workPackages, newWorkPackage]);
  };

  const removeWorkPackage = async (id: string) => {
    try {
      await draftStorage.deleteDraft(id);
      setWorkPackages(workPackages.filter(wp => wp.id !== id));
      await loadDrafts();
    } catch (error) {
      console.error('Failed to remove work package:', error);
    }
  };

  const updateWorkPackage = (id: string, updates: Partial<WorkPackage>) => {
    setWorkPackages(workPackages.map(wp =>
      wp.id === id ? { ...wp, ...updates } : wp
    ));
  };

  const addComponent = (workPackageId: string, type: WRICEFType) => {
    setWorkPackages(workPackages.map(wp =>
      wp.id === workPackageId
        ? { ...wp, estimates: [...wp.estimates, createNewEstimate(type)] }
        : wp
    ));
  };

  const removeComponent = (workPackageId: string, type: WRICEFType) => {
    setWorkPackages(workPackages.map(wp =>
      wp.id === workPackageId
        ? { ...wp, estimates: wp.estimates.filter(est => est.type !== type) }
        : wp
    ));
  };

  const updateEstimate = (
    workPackageId: string,
    type: WRICEFType,
    complexity: Complexity,
    quantity: number
  ) => {
    setWorkPackages(workPackages.map(wp =>
      wp.id === workPackageId
        ? {
            ...wp,
            estimates: wp.estimates.map(est =>
              est.type === type
                ? {
                    ...est,
                    estimates: {
                      ...est.estimates,
                      [complexity]: { ...est.estimates[complexity], quantity }
                    }
                  }
                : est
            )
          }
        : wp
    ));
  };

  const bulkDistribute = async (
    workPackageId: string,
    counts: Record<Complexity, number>
  ) => {
    const distribution = distributeBulkEstimates(counts);
    const workPackage = workPackages.find(wp => wp.id === workPackageId);
    
    if (!workPackage) return;

    // Clear existing estimates
    workPackage.estimates = [];

    // Add all components with their distributed quantities
    Object.entries(distribution).forEach(([type, complexities]) => {
      const wricefType = type as WRICEFType;
      const estimate = createNewEstimate(wricefType);
      
      Object.entries(complexities).forEach(([complexity, quantity]) => {
        estimate.estimates[complexity as Complexity].quantity = quantity;
      });

      workPackage.estimates.push(estimate);
    });

    // Update work package
    setWorkPackages(workPackages.map(wp =>
      wp.id === workPackageId ? workPackage : wp
    ));

    // Save as draft
    await saveDraft(workPackage);
  };

  const saveDraft = async (workPackage: WorkPackage) => {
    try {
      await draftStorage.saveDraft(workPackage);
      await loadDrafts();
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const loadDraft = async (draftId: string) => {
    try {
      const draft = await draftStorage.getDraft(draftId);
      if (draft) {
        const existingIndex = workPackages.findIndex(wp => wp.id === draft.id);
        if (existingIndex >= 0) {
          setWorkPackages(workPackages.map(wp =>
            wp.id === draft.id ? draft : wp
          ));
        } else {
          setWorkPackages([...workPackages, draft]);
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  const clearAllDrafts = async () => {
    try {
      await draftStorage.clearAllDrafts();
      setDrafts([]);
      setWorkPackages([]);
    } catch (error) {
      console.error('Failed to clear drafts:', error);
    }
  };

  const importWorkPackages = (importedPackages: WorkPackage[]) => {
    setWorkPackages([...workPackages, ...importedPackages]);
  };

  return {
    workPackages,
    drafts,
    addWorkPackage,
    removeWorkPackage,
    updateWorkPackage,
    addComponent,
    removeComponent,
    updateEstimate,
    bulkDistribute,
    saveDraft,
    loadDraft,
    clearAllDrafts,
    importWorkPackages,
  };
}