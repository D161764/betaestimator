import React from 'react';
import { Calendar } from 'lucide-react';

interface TimelineSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function TimelineSlider({ value, onChange }: TimelineSliderProps) {
  return (
    <div className="flex items-center gap-4">
      <Calendar className="w-5 h-5 text-gray-500" />
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Timeline (Days)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="30"
            max="365"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00A3E0]"
          />
          <input
            type="number"
            min="30"
            max="365"
            value={value}
            onChange={(e) => onChange(Math.min(365, Math.max(30, parseInt(e.target.value) || 30)))}
            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-[#00A3E0] focus:ring-[#00A3E0]"
          />
        </div>
      </div>
    </div>
  );
}