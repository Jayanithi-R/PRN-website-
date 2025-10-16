import React, { useState, useEffect } from "react";
import CommonModal from "./CommonModal";

export default function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    invoice_no: "",
    product_id: "",
    quantity: "",
    cost_price: "",
    supplier_name: "",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadPurchases();
    loadProducts();
  }, []);

  // Mock data — replace with API calls
  function loadPurchases() {
    setPurchases([
      {
        invoice_no: "INV001",
        product_name: "Keyboard",
        quantity: 5,
        cost_price: 400,
        total_cost: 2000,
        supplier_name: "ABC Suppliers",
        purchase_date: "2025-10-10",
      },
    ]);
  }

  function loadProducts() {
    setProducts([
      { id: 1, product_name: "Keyboard", quantity: 50 },
      { id: 2, product_name: "Mouse", quantity: 100 },
    ]);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    if (!form.invoice_no || !form.product_id || !form.quantity || !form.cost_price) {
      alert("Please fill all fields");
      return;
    }

    const product = products.find((p) => p.id === parseInt(form.product_id));
    const totalCost = parseFloat(form.quantity) * parseFloat(form.cost_price);

    const newPurchase = {
      ...form,
      product_name: product?.product_name || "",
      total_cost: totalCost,
      purchase_date: new Date().toISOString().split("T")[0],
    };

    setPurchases((prev) => [...prev, newPurchase]);
    setForm({
      invoice_no: "",
      product_id: "",
      quantity: "",
      cost_price: "",
      supplier_name: "",
    });
    setOpen(false);
  }

  return (
    <div style={styles.purchaseContainer}>
      <div style={styles.topActions}>
        <button style={styles.btn} onClick={() => setOpen(true)}>
          + Add Purchase
        </button>
      </div>

      <div style={styles.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Cost</th>
                <th>Total</th>
                <th>Supplier</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.invoice_no}</td>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.cost_price}</td>
                    <td>{item.total_cost}</td>
                    <td>{item.supplier_name}</td>
                    <td>{item.purchase_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={styles.noData}>
                    No purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <CommonModal open={open} onClose={() => setOpen(false)} title="Add Purchase">
        <div style={styles.modalForm}>
          <div style={styles.formRow}>
            <input
              style={styles.input}
              name="invoice_no"
              placeholder="Invoice Number"
              value={form.invoice_no}
              onChange={handleChange}
            />
            <select
              style={styles.input}
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.product_name} (Stock: {p.quantity})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formRow}>
            <input
              style={styles.input}
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              name="cost_price"
              type="number"
              placeholder="Cost Price"
              value={form.cost_price}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              name="supplier_name"
              placeholder="Supplier Name"
              value={form.supplier_name}
              onChange={handleChange}
            />
          </div>

          <div style={styles.formFooter}>
            <button style={styles.btn} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}

/* ---------- Inline Styles ---------- */
const styles = {
  purchaseContainer: {
    padding: "1.5rem",
    maxWidth: "100%",
  },
  topActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "1rem",
  },
  card: {
    background: "#fff",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  btn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontWeight: "500",
    transition: "0.3s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95rem",
  },
  noData: {
    textAlign: "center",
    padding: "1rem",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
  },
  input: {
    flex: 1,
    minWidth: "150px",
    padding: "0.6rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.9rem",
  },
  formFooter: {
    display: "flex",
    justifyContent: "flex-end",
  },
};

/* ---------- Responsive Media Queries ---------- */
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@media (max-width: 768px) {
  table th, table td {
    font-size: 0.85rem !important;
    padding: 0.5rem !important;
  }
  button {
    width: 100% !important;
  }
  .modal-form .form-row {
    flex-direction: column !important;
  }
}
@media (max-width: 480px) {
  .purchase-container {
    padding: 0.75rem !important;
  }
  button {
    font-size: 0.9rem !important;
  }
}
`;
document.head.appendChild(styleSheet);
