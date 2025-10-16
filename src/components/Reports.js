import React, { useState, useEffect } from "react";
import { ProductAPI, SalesAPI, PurchaseAPI } from "../api";

export default function Reports() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const p = await ProductAPI.list();
      const s = await SalesAPI.list();
      const pu = await PurchaseAPI.list();
      setProducts(p || []);
      setSales(s || []);
      setPurchases(pu || []);
    } catch (e) {
      console.error(e);
    }
  }

  const lowStock = products.filter((p) => p.quantity <= 10).slice(0, 10);
  const totalSales = sales.reduce((a, b) => a + (Number(b.total_amount) || 0), 0);
  const totalProfit = sales.reduce((a, b) => a + (Number(b.profit) || 0), 0);

  return (
    <div style={styles.container}>
      {/* Totals and Low Stock Section */}
      <div style={styles.summarySection}>
        <div style={styles.summaryCard}>
          <h4 style={styles.cardTitle}>Totals</h4>
          <div style={styles.stat}>💰 Total Sales: ₹{totalSales.toFixed(2)}</div>
          <div style={styles.stat}>📈 Total Profit: ₹{totalProfit.toFixed(2)}</div>
          <div style={styles.stat}>📦 Products: {products.length}</div>
          <div style={styles.stat}>🧾 Purchases: {purchases.length}</div>
        </div>

        <div style={styles.lowStockCard}>
          <h4 style={styles.cardTitle}>Low Stock</h4>
          {lowStock.length === 0 ? (
            <div style={styles.noData}>✅ No low stock products</div>
          ) : (
            <ul style={styles.lowStockList}>
              {lowStock.map((p) => (
                <li key={p.id} style={styles.lowStockItem}>
                  {p.product_name} — <b>{p.quantity}</b> left
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Sales Table */}
      <div style={styles.card}>
        <h4 style={styles.cardTitle}>Recent Sales</h4>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Invoice</th>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Profit</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 10).map((s, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={styles.td}>{s.invoice_no}</td>
                  <td style={styles.td}>{s.product_name || s.barcode}</td>
                  <td style={styles.td}>₹{s.total_amount}</td>
                  <td style={styles.td}>₹{s.profit}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={5} style={styles.noData}>
                    No sales data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Inline responsive styles
const styles = {
  container: {
    padding: "1rem",
    maxWidth: "100%",
  },
  summarySection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  summaryCard: {
    flex: "1 1 300px",
    background: "#ffffff",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    minWidth: "280px",
  },
  lowStockCard: {
    flex: "1 1 300px",
    background: "#ffffff",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    minWidth: "280px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "1.1rem",
    marginBottom: "0.75rem",
    color: "#22c55e",
  },
  stat: {
    fontSize: "0.95rem",
    marginBottom: "6px",
  },
  lowStockList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  lowStockItem: {
    fontSize: "0.9rem",
    padding: "6px 0",
    borderBottom: "1px solid #eee",
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
    color: "#fff",
    padding: "10px",
    border: "1px solid #ddd",
    whiteSpace: "nowrap",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    color: "#777",
    padding: "10px",
  },
};
