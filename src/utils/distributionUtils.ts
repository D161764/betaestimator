import type { WRICEFType, Complexity } from '../types/estimation';
import { estimationMatrix } from '../data/estimationMatrix';

type Distribution = Record<WRICEFType, Record<Complexity, number>>;

function initializeDistribution(): Distribution {
  return Object.keys(estimationMatrix).reduce((acc, type) => {
    acc[type as WRICEFType] = {
      High: 0,
      Medium: 0,
      Low: 0
    };
    return acc;
  }, {} as Distribution);
}

function distributeEvenly(total: number, parts: number): number[] {
  const base = Math.floor(total / parts);
  const remainder = total % parts;
  return Array(parts).fill(base).map((val, idx) => 
    idx < remainder ? val + 1 : val
  );
}

function getPreferredTypes(): WRICEFType[] {
  // Order types by priority for remainder distribution
  return [
    'Enhancement',
    'Report',
    'Form',
    'Workflow',
    'Interface',
    'Conversion',
    'Fiori',
    'Innovation and Automation'
  ];
}

export function distributeBulkEstimates(counts: Record<Complexity, number>): Distribution {
  const distribution = initializeDistribution();
  const types = Object.keys(estimationMatrix) as WRICEFType[];
  const preferredTypes = getPreferredTypes();

  // Handle each complexity level
  (['High', 'Medium', 'Low'] as const).forEach(complexity => {
    const total = counts[complexity];
    if (total === 0) return;

    // Get base distribution
    const baseDistribution = distributeEvenly(total, types.length);

    // Assign base values
    types.forEach((type, index) => {
      distribution[type][complexity] = baseDistribution[index];
    });

    // Handle remainders by priority
    const remainder = total % types.length;
    if (remainder > 0) {
      // Redistribute any remainders to preferred types
      preferredTypes.slice(0, remainder).forEach(type => {
        distribution[type][complexity] += 1;
      });
    }
  });

  return distribution;
}

export function validateDistribution(distribution: Distribution): boolean {
  const totals = {
    High: 0,
    Medium: 0,
    Low: 0
  };

  Object.values(distribution).forEach(typeDistribution => {
    Object.entries(typeDistribution).forEach(([complexity, count]) => {
      totals[complexity as Complexity] += count;
    });
  });

  return Object.values(totals).every(total => total >= 0);
}