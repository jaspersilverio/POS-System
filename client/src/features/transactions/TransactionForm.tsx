import { useState } from "react";
import { api } from "../../services/api";

function TransactionForm() {
    const [items, setItems] = useState([{ name: "", quantity: 1, price: 0}]);
    const [discount, setDiscount] = useState(0);
    const [customerName, serCustomerName] useState(""):

    const handleChangeItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index][field] = field === "quantity" || field === "price" ? Number(value) : value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { name: "", quantity: 1, price: 0}]);

    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    const total = subtotal - discount;

    const handleSubmit = (e.any) => {
        e.preventDefault();
        api.post("/transaction", {
            customer_name: customerName,
            items,
            subtotal,
            discount,
            total,
        }).then(() => alert("Transaction Recorded!"));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-x1 font-semibold">New Transaction</h2>
            <input placeholder="Customer Name" onChange={(e) => setCustomerName(e.target.value)}/>

            {items.map((items, i) => (
                <div key={i} className="flex space-x-2">
                    <input placeholder="Product Name"
                    value={item.name}
                    onChange={(e) => handleChangeItem(i, "item", e.target.value)}
                    />
                    <input type="number"
                    
                    />

                </div>
            )
        )};
        </form>
    )
}