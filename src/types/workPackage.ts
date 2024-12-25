import type { WRICEFEstimate } from './estimation';

export interface WorkPackage {
  id: string;
  name: string;
  description: string;
  contingencyFactor: number;
  timeline: number; // Timeline in days
  estimates: WRICEFEstimate[];
}

export interface WorkPackageEffort {
  baseEffort: number;
  totalEffort: number;
  contingencyFactor: number;
  fte?: FTECalculation;
}

export interface FTECalculation {
  timeline: number;
  functional: {
    lead: number;
    seniorConsultant: number;
    consultant: number;
    juniorConsultant: number;
  };
  technical: {
    architect: number;
    seniorConsultant: number;
    consultant: number;
    juniorConsultant: number;
  };
}