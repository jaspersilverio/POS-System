import { useEffect, useState } from 'react';
import { api } from '../../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((p: any) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
