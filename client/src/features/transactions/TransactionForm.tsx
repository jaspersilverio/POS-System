import { useState } from "react";
import { api } from "../../services/api";

// Define item structure
type Item = {
  name: string;
  quantity: number;
  price: number;
};

// Define the allowed fields for editing items
type ItemField = "name" | "quantity" | "price";

function TransactionForm() {
  const [items, setItems] = useState<Item[]>([{ name: "", quantity: 1, price: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState("");

  // Handle item field changes
  const handleChangeItem = (index: number, field: ItemField, value: string) => {
    const newItems = [...items];
    if (field === "quantity" || field === "price") {
      newItems[index][field] = Number(value);
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  // Add new item input fields
  const addItem = () => setItems([...items, { name: "", quantity: 1, price: 0 }]);

  // Calculate subtotal and total
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const total = subtotal - discount;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/transactions", {
        customer_name: customerName,
        items,
        subtotal,
        discount,
        total,
      });
      alert("Transaction recorded!");
      // Optional: Reset form
      setCustomerName("");
      setItems([{ name: "", quantity: 1, price: 0 }]);
      setDiscount(0);
    } catch (error) {
      alert("Transaction failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">New Transaction</h2>

      <input
        className="border p-2 w-full"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />

      {items.map((item, i) => (
        <div key={i} className="flex space-x-2">
          <input
            className="border p-2 flex-1"
            placeholder="Product Name"
            value={item.name}
            onChange={(e) => handleChangeItem(i, "name", e.target.value)}
            required
          />
          <input
            className="border p-2 w-20"
            type="number"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) => handleChangeItem(i, "quantity", e.target.value)}
            min={1}
            required
          />
          <input
            className="border p-2 w-28"
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => handleChangeItem(i, "price", e.target.value)}
            min={0}
            step={0.01}
            required
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        + Add Item
      </button>

      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Discount"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
        min={0}
      />

      <div className="font-semibold">Subtotal: ₱{subtotal.toFixed(2)}</div>
      <div className="font-bold text-lg">Total: ₱{total.toFixed(2)}</div>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Submit Transaction
      </button>
    </form>
  );
}

export default TransactionForm;
