import React from 'react';
import type { DetailedEffortSplit } from '../types/effort';
import { ComplexityEffortTable } from './ComplexityEffortTable';

interface EffortSplitPanelProps {
  split: DetailedEffortSplit;
}

function roundToOne(num: number): number {
  return Math.round(num * 10) / 10;
}

export function EffortSplitPanel({ split }: EffortSplitPanelProps) {
  const functionalTotal = roundToOne(
    split.functional.lead +
    split.functional.consultant.junior +
    split.functional.consultant.mid +
    split.functional.consultant.senior
  );

  const technicalTotal = roundToOne(
    split.technical.architect +
    split.technical.consultant.junior +
    split.technical.consultant.mid +
    split.technical.consultant.senior
  );

  return (
    <div className="mt-4 space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="text-sm font-medium text-gray-600">Total Functional</h4>
          <p className="text-2xl font-semibold text-[#00338D]">{functionalTotal} days</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-600">Total Technical</h4>
          <p className="text-2xl font-semibold text-[#00338D]">{technicalTotal} days</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-2 gap-8">
        {/* Functional Split */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-lg text-[#00338D] mb-4">Functional Effort</h4>
            <div className="bg-white rounded-lg border p-4 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="font-medium">Functional Lead/Architect (5%)</span>
                <span className="text-lg font-semibold">{roundToOne(split.functional.lead)} days</span>
              </div>
              
              <div>
                <h5 className="font-medium mb-3">Functional Consultants (95%)</h5>
                <ComplexityEffortTable
                  high={split.functional.consultant.senior}
                  medium={split.functional.consultant.mid}
                  low={split.functional.consultant.junior}
                  roles={{
                    high: 'Senior Consultant',
                    medium: 'Consultant',
                    low: 'Junior Consultant'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Split */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-lg text-[#00338D] mb-4">Technical Effort</h4>
            <div className="bg-white rounded-lg border p-4 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="font-medium">Technical Architect (10%)</span>
                <span className="text-lg font-semibold">{roundToOne(split.technical.architect)} days</span>
              </div>
              
              <div>
                <h5 className="font-medium mb-3">Technical Consultants (90%)</h5>
                <ComplexityEffortTable
                  high={split.technical.consultant.senior}
                  medium={split.technical.consultant.mid}
                  low={split.technical.consultant.junior}
                  roles={{
                    high: 'Senior Consultant',
                    medium: 'Consultant',
                    low: 'Junior Consultant'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}