export type Complexity = 'Low' | 'Medium' | 'High';
export type WRICEFType = 
  | 'Workflow' 
  | 'Report' 
  | 'Interface' 
  | 'Conversion' 
  | 'Enhancement' 
  | 'Form' 
  | 'Fiori'
  | 'Innovation and Automation';

export interface ComplexityEstimate {
  quantity: number;
  functionalSplit: number;
  technicalSplit: number;
  baseDays: number;
}

export interface WRICEFEstimate {
  type: WRICEFType;
  estimates: {
    Low: ComplexityEstimate;
    Medium: ComplexityEstimate;
    High: ComplexityEstimate;
  };
}