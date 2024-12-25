export interface EffortSplit {
  functional: {
    lead: number;  // 5% of functional
    consultant: number;  // 95% of functional
  };
  technical: {
    architect: number;  // 10% of technical
    consultant: number;  // 90% of technical
  };
}

export interface ConsultantLevel {
  junior: number;  // Low complexity
  mid: number;    // Medium complexity
  senior: number; // High complexity
}

export interface DetailedEffortSplit extends EffortSplit {
  functional: {
    lead: number;
    consultant: ConsultantLevel;
  };
  technical: {
    architect: number;
    consultant: ConsultantLevel;
  };
}