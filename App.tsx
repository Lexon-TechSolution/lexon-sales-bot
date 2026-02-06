
import React, { useState } from 'react';
import { Product } from './types';
import ChatInterface from './components/ChatInterface';
import InventoryManager from './components/InventoryManager';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', bidhaa: 'iPhone 15 Pro', bei: '3,500,000/=', maelezo: '256GB, Natural Titanium, New Sealed', stock: 5 },
  { id: '2', bidhaa: 'Samsung S24 Ultra', bei: '3,200,000/=', maelezo: '512GB, Titanium Grey, Warranty 1 Year', stock: 3 },
  { id: '3', bidhaa: 'MacBook Air M2', bei: '2,800,000/=', maelezo: '8GB RAM, 256GB SSD, Silver', stock: 2 }
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Navbar */}
      <nav className="bg-[#075e54] text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.83.5 3.53 1.36 5L2 22l5.11-1.34c1.45.82 3.12 1.34 4.89 1.34 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.54 0-2.98-.44-4.2-1.2l-.3-.18-3.11.82.83-3.03-.2-.31C4.24 14.88 3.75 13.5 3.75 12c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z"/>
            </svg>
            <h1 className="text-xl font-bold tracking-tight">Lexon AI Sales Hub</h1>
          </div>
          <div className="hidden md:flex gap-4 text-sm font-medium">
            <span className="bg-white/10 px-3 py-1 rounded-full">Status: Connected</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Bot: Active</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Maelezo ya Bot</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Huu ni mfumo wa kielektroniki wa kusimamia WhatsApp AI Sales Bot. 
              Bot yako inatumia orodha iliyopo hapa chini (ambayo inaweza kuunganishwa na Google Sheets) 
              na Teknolojia ya Gemini AI kujibu wateja wako kwa Kiswahili fasaha.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded uppercase tracking-wider">Node.js Engine</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded uppercase tracking-wider">Gemini AI Integrated</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded uppercase tracking-wider">Swahili Optimized</span>
            </div>
          </div>

          <InventoryManager 
            products={products} 
            onUpdate={setProducts} 
          />
        </div>

        {/* Right Column: Simulator */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="mb-4 text-center">
              <h2 className="text-lg font-bold text-gray-700">Simulizi ya WhatsApp</h2>
              <p className="text-xs text-gray-500">Jaribu jinsi bot inavyofanya kazi na wateja halisi</p>
            </div>
            <ChatInterface inventory={products} />
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t pt-8 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Lexon AI Solutions. Kila kitu kimeandaliwa kwa matumizi ya uzalishaji (Production Ready).
      </footer>
    </div>
  );
};

export default App;
