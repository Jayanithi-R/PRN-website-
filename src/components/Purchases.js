import React, { useState, useEffect } from "react";
import CommonModal from "./CommonModal";

export default function PurchaseList() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [cart, setCart] = useState([]); // multiple products in one purchase
  const [productForm, setProductForm] = useState({
    product_id: "",
    quantity: "",
    cost_price: "",
  });

  useEffect(() => {
    loadPurchases();
    loadProducts();
  }, []);

  // Mock data - replace with API later
  async function loadPurchases() {
    const data = [
      {
        invoice_no: "INV001",
        supplier_name: "ABC Suppliers",
        purchase_date: "2025-10-10",
        products: [
          { product_name: "Keyboard", quantity: 10, cost_price: 400, total_cost: 4000 },
          { product_name: "Mouse", quantity: 20, cost_price: 200, total_cost: 4000 },
        ],
      },
    ];
    setList(data);
  }

  async function loadProducts() {
    const data = [
      { id: 1, product_name: "Keyboard", quantity: 50 },
      { id: 2, product_name: "Mouse", quantity: 100 },
      { id: 3, product_name: "Monitor", quantity: 20 },
    ];
    setProducts(data);
  }

  function changeProductForm(e) {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  }

  function addProductToCart() {
    if (!productForm.product_id || !productForm.quantity || !productForm.cost_price) {
      alert("Please fill all product fields");
      return;
    }

    const selectedProduct = products.find(
      (p) => p.id === parseInt(productForm.product_id)
    );

    const totalCost =
      parseFloat(productForm.quantity) * parseFloat(productForm.cost_price);

    const newItem = {
      product_id: productForm.product_id,
      product_name: selectedProduct?.product_name || "Unknown",
      quantity: parseInt(productForm.quantity),
      cost_price: parseFloat(productForm.cost_price),
      total_cost: totalCost,
    };

    setCart((prev) => [...prev, newItem]);
    setProductForm({ product_id: "", quantity: "", cost_price: "" });
  }

  function removeFromCart(index) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function savePurchase() {
    if (!invoiceNo || !supplierName || cart.length === 0) {
      alert("Please fill invoice details and add at least one product");
      return;
    }

    const newPurchase = {
      invoice_no: invoiceNo,
      supplier_name: supplierName,
      purchase_date: new Date().toISOString().split("T")[0],
      products: cart,
    };

    setList((prev) => [...prev, newPurchase]);
    setInvoiceNo("");
    setSupplierName("");
    setCart([]);
    setOpen(false);
  }

  const invoiceTotal = cart.reduce((sum, item) => sum + item.total_cost, 0);

  return (
    <div>
      <div className="card top-actions">
        <button className="btn" onClick={() => setOpen(true)}>
          + Add Wholesale Purchase
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice No</th>
              <th>Supplier</th>
              <th>Products</th>
              <th>Total Cost</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {list.map((purchase, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{purchase.invoice_no}</td>
                <td>{purchase.supplier_name}</td>
                <td>
                  {purchase.products.map((p, i) => (
                    <div key={i}>
                      {p.product_name} — {p.quantity} pcs × ₹{p.cost_price} = ₹
                      {p.total_cost}
                    </div>
                  ))}
                </td>
                <td>
                  ₹
                  {purchase.products
                    .reduce((sum, p) => sum + p.total_cost, 0)
                    .toFixed(2)}
                </td>
                <td>{purchase.purchase_date}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6}>No purchases yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CommonModal open={open} onClose={() => setOpen(false)} title="Wholesale Purchase">
        <div>
          <div className="form-row">
            <input
              className="input"
              placeholder="Invoice No"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
            <input
              className="input"
              placeholder="Supplier Name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>

          <h4>Add Products to this Invoice</h4>
          <div className="form-row">
            <select
              className="input"
              name="product_id"
              value={productForm.product_id}
              onChange={changeProductForm}
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.product_name} (Stock: {p.quantity})
                </option>
              ))}
            </select>
            <input
              className="input"
              type="number"
              name="quantity"
              placeholder="Qty"
              value={productForm.quantity}
              onChange={changeProductForm}
            />
            <input
              className="input"
              type="number"
              name="cost_price"
              placeholder="Cost Price"
              value={productForm.cost_price}
              onChange={changeProductForm}
            />
            <button className="btn" onClick={addProductToCart}>
              + Add
            </button>
          </div>

          {cart.length > 0 && (
            <table className="table" style={{ marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Cost</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((p, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{p.product_name}</td>
                    <td>{p.quantity}</td>
                    <td>₹{p.cost_price}</td>
                    <td>₹{p.total_cost}</td>
                    <td>
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() => removeFromCart(idx)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>
                    Grand Total:
                  </td>
                  <td colSpan="2" style={{ fontWeight: "bold" }}>
                    ₹{invoiceTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button className="btn" onClick={savePurchase}>
              Save Purchase
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
