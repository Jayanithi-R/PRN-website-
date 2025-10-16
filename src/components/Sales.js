import React, { useState, useEffect } from "react";
import CommonModal from "./CommonModal";
import { ProductAPI, SalesAPI, ComboAPI } from "../api";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    invoice_no: "",
    product_id: "",
    barcode: "",
    quantity: 1,
    selling_price: 0,
    customer_name: "",
    sale_type: "single",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const p = await ProductAPI.list();
      setProducts(p || []);
      const c = await ComboAPI.list();
      setCombos(c || []);
      const s = await SalesAPI.list();
      setList(s || []);
    } catch (e) {
      console.error(e);
    }
  }

  function pickProduct(e) {
    const id = Number(e.target.value);
    const p = products.find((x) => x.id === id);
    setForm((prev) => ({
      ...prev,
      product_id: id,
      selling_price: p ? p.selling_price : prev.selling_price,
      sale_type: "single",
    }));
  }

  function pickCombo(e) {
    const id = Number(e.target.value);
    const c = combos.find((x) => x.combo_id === id);
    setForm((prev) => ({
      ...prev,
      product_id: id,
      selling_price: c ? c.selling_price : prev.selling_price,
      sale_type: "bundle",
    }));
  }

  function change(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "selling_price" ? Number(value) : value,
    }));
  }

  async function save() {
    try {
      await SalesAPI.create(form);
      setOpen(false);
      setForm({
        invoice_no: "",
        product_id: "",
        barcode: "",
        quantity: 1,
        selling_price: 0,
        customer_name: "",
        sale_type: "single",
      });
      load();
      alert("Sale recorded");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div style={styles.container}>
      {/* Top Actions */}
      <div style={styles.topActions}>
        <button style={styles.addButton} onClick={() => setOpen(true)}>
          + Add Sale
        </button>
      </div>

      {/* Table Section */}
      <div style={styles.card}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Invoice</th>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Profit</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {list.map((it, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={styles.td}>{it.invoice_no}</td>
                  <td style={styles.td}>{it.product_name || it.barcode}</td>
                  <td style={styles.td}>{it.quantity}</td>
                  <td style={styles.td}>{it.total_amount}</td>
                  <td style={styles.td}>{it.profit}</td>
                  <td style={styles.td}>{it.sale_type}</td>
                  <td style={styles.td}>{it.sale_date}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={8} style={styles.noData}>
                    No sales
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add Sale */}
      <CommonModal open={open} onClose={() => setOpen(false)} title="Add Sale">
        <div style={styles.modalContent}>
          <div style={styles.formRow}>
            <input
              className="input"
              name="invoice_no"
              placeholder="Invoice no"
              value={form.invoice_no}
              onChange={change}
              style={styles.input}
            />

            <select onChange={pickProduct} style={styles.input}>
              <option value="">-- Select product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.product_name} — stock {p.quantity}
                </option>
              ))}
            </select>

            <select onChange={pickCombo} style={styles.input}>
              <option value="">-- or choose combo --</option>
              {combos.map((c) => (
                <option key={c.combo_id} value={c.combo_id}>
                  {c.combo_name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formRow}>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={change}
              style={styles.input}
            />
            <input
              name="selling_price"
              type="number"
              value={form.selling_price}
              onChange={change}
              style={styles.input}
            />
            <input
              name="customer_name"
              placeholder="Customer"
              value={form.customer_name}
              onChange={change}
              style={styles.input}
            />
          </div>

          <div style={styles.saveButtonWrapper}>
            <button style={styles.saveButton} onClick={save}>
              Save Sale
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}

const styles = {
  container: {
    padding: "1rem",
    maxWidth: "100%",
  },
  topActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "1rem",
  },
  addButton: {
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
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    background: "#22c55e",
    color: "white",
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "8px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    padding: "12px",
    color: "#777",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  input: {
    flex: "1 1 150px",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  saveButtonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },
  saveButton: {
    backgroundColor: "#22c55e",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
