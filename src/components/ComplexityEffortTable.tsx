import React from 'react';

interface ComplexityEffortTableProps {
  high: number;
  medium: number;
  low: number;
  roles: {
    high: string;
    medium: string;
    low: string;
  };
}

function roundToOne(num: number): number {
  return Math.round(num * 10) / 10;
}

export function ComplexityEffortTable({ high, medium, low, roles }: ComplexityEffortTableProps) {
  const total = roundToOne(high + medium + low);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Complexity
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Effort
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-2 text-sm font-medium text-[#00338D]">High</td>
            <td className="px-4 py-2 text-sm text-gray-600">{roles.high}</td>
            <td className="px-4 py-2 text-sm font-medium text-right">{roundToOne(high)} days</td>
          </tr>
          <tr>
            <td className="px-4 py-2 text-sm font-medium text-[#00338D]">Medium</td>
            <td className="px-4 py-2 text-sm text-gray-600">{roles.medium}</td>
            <td className="px-4 py-2 text-sm font-medium text-right">{roundToOne(medium)} days</td>
          </tr>
          <tr>
            <td className="px-4 py-2 text-sm font-medium text-[#00338D]">Low</td>
            <td className="px-4 py-2 text-sm text-gray-600">{roles.low}</td>
            <td className="px-4 py-2 text-sm font-medium text-right">{roundToOne(low)} days</td>
          </tr>
          <tr className="bg-gray-50">
            <td colSpan={2} className="px-4 py-2 text-sm font-medium">Total</td>
            <td className="px-4 py-2 text-sm font-medium text-right">{total} days</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}