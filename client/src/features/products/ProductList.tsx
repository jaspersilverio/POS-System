import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  variants: {
    sizes: string[];
    colors: string[];
  };
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  

  useEffect(() => {
    api.get('/products').then((res) => {
      // Parse JSON variants
      const productsWithVariants = res.data.map((product: any) => ({
        ...product,
        variants: JSON.parse(product.variants)
      }));
      setProducts(productsWithVariants);
    });
  }, []);

  return (
    <div>
      <h2>Clothing Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ₱{product.price.toFixed(2)}</p>
            <p>Sizes: {product.variants.sizes.join(', ')}</p>
            <p>Colors: {product.variants.colors.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}