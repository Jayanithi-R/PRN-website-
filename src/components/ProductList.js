import React, { useState, useEffect } from 'react';
import ProductModal from './ProductModal';
import ProductAPI from '../api';

export default function ProductList() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await ProductAPI.list();
      setItems(data || []);
    } catch (e) {
      alert('Load error: ' + e.message);
    }
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setOpen(true);
  }

  function edit(it) {
    setEditing(it);
    setOpen(true);
  }

  async function save(product) {
    try {
      if (product.id) await ProductAPI.update(product.id, product);
      else await ProductAPI.create(product);
      setOpen(false);
      load();
    } catch (e) {
      alert('Save error: ' + e.message);
    }
  }

  async function del(id) {
    if (!window.confirm('Delete product?')) return;
    try {
      await ProductAPI.delete(id);
      load();
    } catch (e) {
      alert('Delete error: ' + e.message);
    }
  }

  const filtered = items.filter(
    (it) =>
      (it.product_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (it.barcode || '').includes(search)
  );

  return (
    <div style={{ padding: 16 }}>
      <div className="card" style={{ padding: 16, overflowX: 'auto' }}>
        <div
          className="top-actions"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
            alignItems: 'center',
          }}
        >
          <button
            className="btn"
            onClick={openNew}
            style={{ flexShrink: 0 }}
          >
            + Add Product
          </button>
          <input
            className="input"
            placeholder="Search product or barcode"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flexGrow: 1,
              minWidth: 150,
              padding: 8,
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
          <div style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            {loading ? 'Loading...' : `${items.length} products`}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Sell</th>
                <th>Stock</th>
                <th>Barcode</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it, idx) => (
                <tr key={it.id}>
                  <td>{idx + 1}</td>
                  <td>{it.product_name}</td>
                  <td>{it.category}</td>
                  <td>{it.cost_price}</td>
                  <td>{it.selling_price}</td>
                  <td>{it.quantity}</td>
                  <td>{it.barcode}</td>
                  <td>{it.supplier_name || '-'}</td>
                  <td style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <button
                      className="btn secondary"
                      onClick={() => edit(it)}
                      style={{ flex: '1 1 auto', minWidth: 60 }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn"
                      style={{ background: '#ef4444', flex: '1 1 auto', minWidth: 60 }}
                      onClick={() => del(it.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: 16 }}>
                    No products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={save}
        initial={editing}
      />
    </div>
  );
}
