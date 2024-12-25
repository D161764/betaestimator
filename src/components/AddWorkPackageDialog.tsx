import React, { useState } from 'react';
import { Dialog } from './Dialog';

interface AddWorkPackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, description: string) => void;
}

export function AddWorkPackageDialog({ isOpen, onClose, onAdd }: AddWorkPackageDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), description.trim());
      setName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Work Package">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3E0] focus:ring-[#00A3E0]"
            placeholder="Enter work package name"
            required
            autoFocus
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3E0] focus:ring-[#00A3E0]"
            placeholder="Enter work package description"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#00A3E0] text-white rounded-md hover:bg-[#0091c7] transition-colors"
          >
            Add Work Package
          </button>
        </div>
      </form>
    </Dialog>
  );
}