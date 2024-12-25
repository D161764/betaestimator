import type { WRICEFType, Complexity, WRICEFEstimate } from '../types/estimation';
import type { WorkPackage, WorkPackageEffort } from '../types/workPackage';
import { estimationMatrix } from '../data/estimationMatrix';
import { calculateEffortSplit } from './effortSplitUtils';
import { calculateFTE } from './fteUtils';

export const createNewEstimate = (type: WRICEFType): WRICEFEstimate => ({
  type,
  estimates: {
    Low: { quantity: 0, ...estimationMatrix[type].Low },
    Medium: { quantity: 0, ...estimationMatrix[type].Medium },
    High: { quantity: 0, ...estimationMatrix[type].High }
  }
});

export const calculateEstimateEffort = (estimate: WRICEFEstimate): number => {
  return Object.values(estimate.estimates).reduce(
    (total, complex) => total + (complex.quantity * complex.baseDays),
    0
  );
};

export const calculateWorkPackageEffort = (workPackage: WorkPackage): WorkPackageEffort => {
  const baseEffort = workPackage.estimates.reduce(
    (total, estimate) => total + calculateEstimateEffort(estimate),
    0
  );

  const totalEffort = baseEffort * (1 + workPackage.contingencyFactor / 100);

  // Calculate total effort split across all components
  const totalEffortSplit = workPackage.estimates.reduce((acc, est) => {
    const split = calculateEffortSplit(est);
    return {
      functional: {
        lead: acc.functional.lead + split.functional.lead,
        consultant: {
          senior: acc.functional.consultant.senior + split.functional.consultant.senior,
          mid: acc.functional.consultant.mid + split.functional.consultant.mid,
          junior: acc.functional.consultant.junior + split.functional.consultant.junior
        }
      },
      technical: {
        architect: acc.technical.architect + split.technical.architect,
        consultant: {
          senior: acc.technical.consultant.senior + split.technical.consultant.senior,
          mid: acc.technical.consultant.mid + split.technical.consultant.mid,
          junior: acc.technical.consultant.junior + split.technical.consultant.junior
        }
      }
    };
  }, {
    functional: { lead: 0, consultant: { senior: 0, mid: 0, junior: 0 } },
    technical: { architect: 0, consultant: { senior: 0, mid: 0, junior: 0 } }
  });

  // Calculate FTE based on total effort split
  const fte = calculateFTE(totalEffortSplit, workPackage.timeline || 60);

  return {
    baseEffort,
    totalEffort,
    contingencyFactor: workPackage.contingencyFactor,
    fte
  };
};