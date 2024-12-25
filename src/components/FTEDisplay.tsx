import React from 'react';
import type { FTECalculation } from '../types/workPackage';

interface FTEDisplayProps {
  fte: FTECalculation;
}

function formatFTE(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}

export function FTEDisplay({ fte }: FTEDisplayProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-lg font-semibold text-[#00338D] mb-4">FTE Requirements ({fte.timeline} days)</h4>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Functional Team */}
        <div>
          <h5 className="font-medium mb-3">Functional Team</h5>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lead/Architect</span>
              <span className="font-medium">{formatFTE(fte.functional.lead)} FTE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Senior Consultant</span>
              <span className="font-medium">{formatFTE(fte.functional.seniorConsultant)} FTE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Consultant</span>
              <span className="font-medium">{formatFTE(fte.functional.consultant)} FTE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Junior Consultant</span>
              <span className="font-medium">{formatFTE(fte.functional.juniorConsultant)} FTE</span>
            </div>
          </div>
        </div>

        {/* Technical Team */}
        <div>
          <h5 className="font-medium mb-3">Technical Team</h5>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Architect</span>
              <span className="font-medium">{formatFTE(fte.technical.architect)} FTE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Senior Consultant</span>
              <span className="font-medium">{formatFTE(fte.technical.seniorConsultant)} FTE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Consultant</span>
              <span className="font-medium">{formatFTE(fte.technical.consultant)} FTE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Junior Consultant</span>
              <span className="font-medium">{formatFTE(fte.technical.juniorConsultant)} FTE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}