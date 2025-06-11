import React from 'react';
import { Product } from '../../types/product';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  // Function to format price
  const formatPrice = (price: any): string => {
    // Ensure price is a number before calling toFixed
    const numPrice = Number(price);
    return isNaN(numPrice) ? `$${price}` : `$${numPrice.toFixed(2)}`;
  };

  // Handle product click with price validation
  const handleProductClick = (product: Product) => {
    // Create a safe copy of the product with numeric price
    const safeProduct = {
      ...product,
      price: Number(product.price) || 0 // Convert to number or default to 0 if NaN
    };
    onAddToCart(safeProduct);
  };

  return (
    <div>
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map(product => (
            <div 
              key={product.id}
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No image</span>
                  </div>
                )}
              </div>
              <h3 className="font-medium text-gray-900 truncate" title={product.name}>
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm truncate" title={product.sku}>
                {product.sku}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.inventory && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.inventory.quantity <= product.inventory.min_stock_level
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.inventory.quantity} in stock
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList; 