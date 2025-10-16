import React, { useState, useEffect } from "react";
import CommonModal from "./CommonModal";

export default function ProductModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    product_name: "",
    category: "",
    cost_price: "",
    selling_price: "",
    barcode: "",
    quantity: "",
    supplier_name: "",
  });

  useEffect(() => {
    if (initial) setForm(initial);
    else
      setForm({
        product_name: "",
        category: "",
        cost_price: "",
        selling_price: "",
        barcode: "",
        quantity: "",
        supplier_name: "",
      });
  }, [initial]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name.includes("price") || name === "quantity" ? Number(value) : value,
    }));
  }

  function handleSave() {
    onSave(form);
  }

  const styles = {
    modalForm: {
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem",
      width: "100%",
      maxWidth: "100%",
    },
    formRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
    },
    input: {
      flex: 1,
      minWidth: "180px",
      padding: "0.65rem 0.75rem",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "0.95rem",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    inputFocus: {
      borderColor: "#22c55e",
    },
    formFooter: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "0.5rem",
    },
    btn: {
      background: "#22c55e",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "0.6rem 1.2rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "0.3s",
    },
    btnHover: {
      background: "#16a34a",
    },
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={initial ? "Edit Product" : "Add Product"}
    >
      <div style={styles.modalForm}>
        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Product Name"
            name="product_name"
            value={form.product_name}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            placeholder="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Cost Price"
            type="number"
            name="cost_price"
            value={form.cost_price}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            placeholder="Selling Price"
            type="number"
            name="selling_price"
            value={form.selling_price}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Barcode"
            name="barcode"
            value={form.barcode}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            placeholder="Quantity"
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Supplier Name"
            name="supplier_name"
            value={form.supplier_name}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formFooter}>
          <button
            style={styles.btn}
            onClick={handleSave}
            onMouseOver={(e) => (e.currentTarget.style.background = "#16a34a")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#22c55e")}
          >
            {initial ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </CommonModal>
  );
}
