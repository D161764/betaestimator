import React from 'react';
import { Trash2, Edit, Save } from 'lucide-react';
import type { DraftWorkPackage } from '../types/draft';

interface DraftsListProps {
  drafts: DraftWorkPackage[];
  onLoadDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string) => void;
}

export function DraftsList({ drafts, onLoadDraft, onDeleteDraft }: DraftsListProps) {
  if (drafts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-[#00338D] mb-3">Saved Drafts</h2>
      <div className="space-y-2">
        {drafts.map((draft) => {
          const workPackage = JSON.parse(draft.data);
          return (
            <div
              key={draft.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div>
                <h3 className="font-medium">{workPackage.name}</h3>
                <p className="text-sm text-gray-500">
                  Last modified: {new Date(draft.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLoadDraft(draft.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Load draft"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteDraft(draft.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}