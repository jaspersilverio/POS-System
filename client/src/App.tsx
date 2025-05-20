import React from 'react'
import ProductForm from './features/products/ProductForm'
import ProductList from './features/products/ProductList'

const App = () => {
  return (
    <div className="p-6">
      <ProductForm />
      <hr className="my-4"/>
       <ProductList />
    </div>
  );
}

export default App;