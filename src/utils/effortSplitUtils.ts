import type { ComplexityEstimate, WRICEFEstimate } from '../types/estimation';
import type { EffortSplit, DetailedEffortSplit } from '../types/effort';

export function calculateEffortSplit(estimate: WRICEFEstimate): DetailedEffortSplit {
  const totalEffort = Object.values(estimate.estimates).reduce(
    (sum, est) => sum + (est.quantity * est.baseDays),
    0
  );

  const functionalEffort = Object.entries(estimate.estimates).reduce(
    (sum, [complexity, est]) => {
      const effort = est.quantity * est.baseDays;
      return sum + (effort * est.functionalSplit / 100);
    },
    0
  );

  const technicalEffort = totalEffort - functionalEffort;

  // Calculate consultant levels based on complexity
  const functionalConsultant = calculateConsultantLevels(estimate.estimates, true);
  const technicalConsultant = calculateConsultantLevels(estimate.estimates, false);

  return {
    functional: {
      lead: functionalEffort * 0.05, // 5% for functional lead
      consultant: functionalConsultant
    },
    technical: {
      architect: technicalEffort * 0.1, // 10% for technical architect
      consultant: technicalConsultant
    }
  };
}

function calculateConsultantLevels(
  estimates: Record<string, ComplexityEstimate>,
  isFunctional: boolean
): { junior: number; mid: number; senior: number } {
  const result = { junior: 0, mid: 0, senior: 0 };
  
  Object.entries(estimates).forEach(([complexity, est]) => {
    const effort = est.quantity * est.baseDays;
    const splitPercentage = isFunctional ? est.functionalSplit : est.technicalSplit;
    const splitEffort = effort * (splitPercentage / 100);
    
    // Remove architect/lead portion
    const consultantEffort = splitEffort * (isFunctional ? 0.95 : 0.9);
    
    switch(complexity) {
      case 'Low':
        result.junior += consultantEffort;
        break;
      case 'Medium':
        result.mid += consultantEffort;
        break;
      case 'High':
        result.senior += consultantEffort;
        break;
    }
  });

  return result;
}