import React, { useState } from 'react';
import { EstimationForm } from './components/EstimationForm';
import { Documentation } from './components/Documentation';
import { Footer } from './components/Footer';
import { HelpCircle } from 'lucide-react';

function App() {
  const [showDocs, setShowDocs] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-[#00338D] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">KPMG SAP EMA Hub WRICEF Estimation Tool Beta</h1>
            <p className="text-sm opacity-80">Enterprise Project Estimation</p>
          </div>
          <button
            onClick={() => setShowDocs(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Documentation
          </button>
        </div>
      </header>
      <main className="flex-1 py-8">
        <EstimationForm />
      </main>
      <Footer />
      <Documentation isOpen={showDocs} onClose={() => setShowDocs(false)} />
    </div>
  );
}

export default App;