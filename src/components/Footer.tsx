import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto py-6 text-center bg-gray-50 border-t">
      <p className="flex items-center justify-center gap-2 text-gray-600">
        Crafted with <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> by AI and Human
      </p>
    </footer>
  );
}