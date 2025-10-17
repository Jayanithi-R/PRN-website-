import React, { useState, useEffect } from "react";
import CommonModal from "./CommonModal";
import { ProductAPI, SalesAPI } from "../api";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [salesList, setSalesList] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    invoice_no: "",
    customer_name: "",
  });

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProducts();
    loadSales();
  }, []);

  async function loadProducts() {
    try {
      const p = await ProductAPI.list();
      setProducts(p || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadSales() {
    try {
      const s = await SalesAPI.list();
      setSalesList(s || []);
    } catch (e) {
      console.error(e);
    }
  }

  function addToCart() {
    if (!selectedProduct) return alert("Select a product!");
    const product = products.find((p) => p.id === Number(selectedProduct));
    if (!product) return;

    const existing = cart.find((c) => c.id === product.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === product.id
            ? { ...c, quantity: c.quantity + quantity }
            : c
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.product_name,
          price: product.selling_price,
          quantity,
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity(1);
  }

  function removeItem(id) {
    setCart(cart.filter((c) => c.id !== id));
  }

  function getTotal() {
    return cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }

  async function saveBill() {
    if (!form.invoice_no || !form.customer_name)
      return alert("Please fill all billing details!");

    if (cart.length === 0) return alert("Cart is empty!");

    try {
      for (const item of cart) {
        await SalesAPI.create({
          invoice_no: form.invoice_no,
          product_id: item.id,
          quantity: item.quantity,
          selling_price: item.price,
          customer_name: form.customer_name,
          sale_type: "single",
        });
      }

      alert("Billing completed successfully!");
      setCart([]);
      setForm({ invoice_no: "", customer_name: "" });
      setOpen(false);
      loadSales();
    } catch (e) {
      alert("Error saving bill: " + e.message);
    }
  }

  return (
    <div style={styles.container}>
      {/* Add Sale Button */}
      <div style={styles.header}>
        <button style={styles.addBtn} onClick={() => setOpen(true)}>
          + New Billing
        </button>
      </div>

      {/* Sales History */}
      <div style={styles.card}>
        <h3 style={{ textAlign: "center", color: "#22c55e" }}>Sales History</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {salesList.length > 0 ? (
              salesList.map((s, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{s.invoice_no}</td>
                  <td>{s.customer_name}</td>
                  <td>{s.product_name || s.barcode}</td>
                  <td>{s.quantity}</td>
                  <td>{s.total_amount}</td>
                  <td>{s.sale_date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={styles.noData}>
                  No sales yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Billing Modal */}
      <CommonModal open={open} onClose={() => setOpen(false)} title="Retail Billing">
        <div style={styles.modal}>
          {/* Billing Info */}
          <div style={styles.row}>
            <input
              placeholder="Invoice No"
              value={form.invoice_no}
              onChange={(e) =>
                setForm({ ...form, invoice_no: e.target.value })
              }
              style={styles.input}
            />
            <input
              placeholder="Customer Name"
              value={form.customer_name}
              onChange={(e) =>
                setForm({ ...form, customer_name: e.target.value })
              }
              style={styles.input}
            />
          </div>

          {/* Product Selection */}
          <div style={styles.row}>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={styles.input}
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.product_name} - ₹{p.selling_price}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={styles.input}
            />
            <button onClick={addToCart} style={styles.addBtn}>
              Add to Cart
            </button>
          </div>

          {/* Cart Table */}
          <div style={styles.cartSection}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.quantity}</td>
                    <td>₹{c.price}</td>
                    <td>₹{c.price * c.quantity}</td>
                    <td>
                      <button
                        style={styles.delBtn}
                        onClick={() => removeItem(c.id)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan="5" style={styles.noData}>
                      Cart empty
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div style={styles.totalRow}>
            <strong>Grand Total: ₹{getTotal()}</strong>
          </div>

          {/* Save Bill */}
          <div style={styles.footer}>
            <button style={styles.saveBtn} onClick={saveBill}>
              Save Bill
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}

const styles = {
  container: { padding: "1rem" },
  header: { display: "flex", justifyContent: "flex-end", marginBottom: "1rem" },
  addBtn: {
    backgroundColor: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  card: {
    background: "#fff",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
  },
  noData: { color: "#777", padding: "10px" },
  modal: { display: "flex", flexDirection: "column", gap: "1rem" },
  row: { display: "flex", flexWrap: "wrap", gap: "10px" },
  input: {
    flex: "1 1 150px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  cartSection: { maxHeight: "200px", overflowY: "auto" },
  totalRow: {
    display: "flex",
    justifyContent: "flex-end",
    fontSize: "16px",
    color: "#22c55e",
  },
  footer: { display: "flex", justifyContent: "flex-end" },
  saveBtn: {
    backgroundColor: "#22c55e",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  delBtn: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
  },
};
