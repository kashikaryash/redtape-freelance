import React, { useState } from 'react';
import { createOrder } from "../baseUrl/OrderAPI";

const OrdersPage = () => {
  const [userId, setUserId] = useState(1);
  const [items, setItems] = useState([
    { productModelNo: '', quantity: 1, price: 0 }
  ]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { productModelNo: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = {
      user: { id: userId },
      items: items.map(item => ({
        product: { modelNo: item.productModelNo },
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    };

    try {
      const res = await createOrder(order);
      console.log("Order created:", res.data);
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Create Order</h2>
      <input
        type="number"
        value={userId}
        onChange={e => setUserId(+e.target.value)}
        placeholder="User ID"
        required
        className="border p-2"
      />

      <h3 className="text-lg">Items</h3>
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Product Model No"
            value={item.productModelNo}
            onChange={e => handleItemChange(idx, 'productModelNo', e.target.value)}
            className="border p-2"
            required
          />
          <input
            type="number"
            placeholder="Qty"
            value={item.quantity}
            onChange={e => handleItemChange(idx, 'quantity', +e.target.value)}
            className="border p-2"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={e => handleItemChange(idx, 'price', +e.target.value)}
            className="border p-2"
            required
          />
          <button type="button" onClick={() => removeItem(idx)} className="text-red-500">Remove</button>
        </div>
      ))}

      <button type="button" onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded">Add Item</button>
      <div>Total: ₹{items.reduce((sum, item) => sum + item.quantity * item.price, 0)}</div>
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Place Order</button>
    </form>
  );
};

export default OrdersPage;
