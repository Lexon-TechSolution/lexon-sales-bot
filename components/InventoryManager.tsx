
import React, { useState } from 'react';
import { Product } from '../types';

interface InventoryManagerProps {
  products: Product[];
  onUpdate: (products: Product[]) => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ products, onUpdate }) => {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    bidhaa: '',
    bei: '',
    maelezo: '',
    stock: 0
  });

  const handleAdd = () => {
    if (!newProduct.bidhaa || !newProduct.bei) return;
    const item: Product = { ...newProduct, id: Date.now().toString() };
    onUpdate([...products, item]);
    setNewProduct({ bidhaa: '', bei: '', maelezo: '', stock: 0 });
  };

  const handleRemove = (id: string) => {
    onUpdate(products.filter(p => p.id !== id));
  };

  const handleImportSheet = () => {
    const url = prompt("Ingiza Link ya Google Sheet (Published CSV):");
    if (!url) return;
    
    // Simplification for the demo: We warn that this is where the real Google Sheet fetch logic goes
    alert("Kwenye Production: Hapa tutatumia fetch() kusoma data moja kwa moja kutoka Google Sheets uliyochapisha kama CSV.");
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-bold text-gray-700">Orodha ya Bidhaa (Google Sheets Database)</h3>
        <button 
          onClick={handleImportSheet}
          className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Unganisha Sheet
        </button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <input 
            placeholder="Jina la Bidhaa"
            className="border p-2 text-sm rounded"
            value={newProduct.bidhaa}
            onChange={e => setNewProduct({...newProduct, bidhaa: e.target.value})}
          />
          <input 
            placeholder="Bei (mf. 50,000/=)"
            className="border p-2 text-sm rounded"
            value={newProduct.bei}
            onChange={e => setNewProduct({...newProduct, bei: e.target.value})}
          />
          <input 
            placeholder="Maelezo"
            className="border p-2 text-sm rounded"
            value={newProduct.maelezo}
            onChange={e => setNewProduct({...newProduct, maelezo: e.target.value})}
          />
          <button 
            onClick={handleAdd}
            className="bg-green-600 text-white rounded px-4 py-2 text-sm font-bold hover:bg-green-700"
          >
            Ongeza
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Bidhaa</th>
                <th className="p-2 border">Bei</th>
                <th className="p-2 border">Maelezo</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border w-10"></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-2 border font-medium">{p.bidhaa}</td>
                  <td className="p-2 border text-green-600 font-bold">{p.bei}</td>
                  <td className="p-2 border text-gray-500 italic">{p.maelezo}</td>
                  <td className="p-2 border">{p.stock}</td>
                  <td className="p-2 border">
                    <button 
                      onClick={() => handleRemove(p.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">Orodha ni tupu. Ongeza bidhaa kuanza.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
