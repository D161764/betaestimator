import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { Complexity, ComplexityEstimate } from '../types/estimation';

interface ComplexityInputProps {
  complexity: Complexity;
  estimate: ComplexityEstimate;
  onChange: (complexity: Complexity, quantity: number) => void;
  disabled?: boolean;
  tooltip: string;
}

export function ComplexityInput({ 
  complexity, 
  estimate, 
  onChange, 
  disabled = false,
  tooltip 
}: ComplexityInputProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-24">
        <span className="font-medium text-gray-700">{complexity}</span>
        <HelpCircle className="inline-block ml-1 w-4 h-4 text-gray-400" title={tooltip} />
      </div>
      <div className="w-32">
        <input
          type="number"
          min="0"
          value={estimate.quantity}
          onChange={(e) => onChange(complexity, parseInt(e.target.value) || 0)}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3E0] focus:ring-[#00A3E0] ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          placeholder="Quantity"
          disabled={disabled}
        />
      </div>
      <div className="text-sm text-gray-500">
        ({estimate.baseDays} days/unit)
      </div>
      {estimate.quantity > 0 && (
        <div className="text-sm font-medium">
          Total: {(estimate.quantity * estimate.baseDays).toFixed(1)} days
        </div>
      )}
    </div>
  );
}