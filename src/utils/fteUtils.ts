import type { DetailedEffortSplit } from '../types/effort';
import type { FTECalculation } from '../types/workPackage';

export function calculateFTE(
  effortSplit: DetailedEffortSplit,
  timeline: number
): FTECalculation {
  return {
    timeline,
    functional: {
      lead: effortSplit.functional.lead / timeline,
      seniorConsultant: effortSplit.functional.consultant.senior / timeline,
      consultant: effortSplit.functional.consultant.mid / timeline,
      juniorConsultant: effortSplit.functional.consultant.junior / timeline
    },
    technical: {
      architect: effortSplit.technical.architect / timeline,
      seniorConsultant: effortSplit.technical.consultant.senior / timeline,
      consultant: effortSplit.technical.consultant.mid / timeline,
      juniorConsultant: effortSplit.technical.consultant.junior / timeline
    }
  };
}