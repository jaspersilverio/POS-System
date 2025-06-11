import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import inventoryService from '../services/inventoryService';
import { Inventory as InventoryType } from '../types/product';

const Inventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryType[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [restockingItem, setRestockingItem] = useState<{ id: number, quantity: number } | null>(null);
  
  useEffect(() => {
    fetchInventory();
    fetchLowStockItems();
  }, []);
  
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAllInventory();
      setInventoryItems(data);
    } catch (err) {
      setError('Error fetching inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchLowStockItems = async () => {
    try {
      const data = await inventoryService.getLowStockItems();
      setLowStockItems(data.items);
    } catch (err) {
      console.error('Error fetching low stock items:', err);
    }
  };
  
  const handleRestockChange = (id: number, quantity: string) => {
    setRestockingItem({
      id,
      quantity: parseInt(quantity) || 0
    });
  };
  
  const handleRestock = async (id: number) => {
    if (!restockingItem || restockingItem.id !== id || restockingItem.quantity <= 0) {
      return;
    }
    
    try {
      setError(null);
      await inventoryService.restockInventory(id, restockingItem.quantity);
      await fetchInventory();
      await fetchLowStockItems();
      setRestockingItem(null);
    } catch (err) {
      setError('Error restocking item');
      console.error(err);
    }
  };
  
  const displayItems = showLowStockOnly ? lowStockItems : inventoryItems;
  
  if (loading) return (
    <MainLayout>
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading inventory...</div>
      </div>
    </MainLayout>
  );
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Inventory Management</h1>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {lowStockItems.length} items low on stock
              </span>
            </div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Show low stock only</span>
            </label>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Restock Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                displayItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {item.product?.image_url ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={item.product.image_url}
                              alt={item.product?.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product?.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.product?.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        item.quantity <= item.min_stock_level 
                          ? 'text-red-600' 
                          : 'text-gray-900'
                      }`}>
                        {item.quantity}
                        {item.quantity <= item.min_stock_level && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.min_stock_level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.last_restock_date 
                        ? new Date(item.last_restock_date).toLocaleDateString() 
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          className="w-16 border border-gray-300 px-2 py-1 rounded mr-2"
                          value={restockingItem?.id === item.id ? restockingItem.quantity : ''}
                          onChange={(e) => handleRestockChange(item.id, e.target.value)}
                          placeholder="Qty"
                        />
                        <button
                          onClick={() => handleRestock(item.id)}
                          disabled={!restockingItem || restockingItem.id !== item.id || restockingItem.quantity <= 0}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs disabled:opacity-50"
                        >
                          Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Inventory; 