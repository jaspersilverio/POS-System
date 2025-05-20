import React, { useState } from 'react';
import { api } from '../../services/api';


function ProductForm() {
    const [form, setForm] = useState({
        name: "",
        sku: "",
        price: "",
        stock: ""
    });

    const handleChange = (e: any) => {
        setForm({...form, [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        api.post("/products)", form).then(() => {
            alert("Product Added!");
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input name="name" onChange={handleChange} placeholder='Name' required/>
            <input name="sku" onChange={handleChange} placeholder='Sku' required/>
            <input name="price" onChange={handleChange} placeholder='Price' type='nummber' required/>
            <input name="stock" onChange={handleChange} placeholder='Stock' type='number' required/>
            <button type="submit"> Add Product</button>
        </form>
    );
}

export default ProductForm;