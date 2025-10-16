import React, { useState, useEffect } from 'react';
import CommonModal from './CommonModal';
import { ComboAPI, ProductAPI } from '../api';

export default function Combos() {
  const [combos, setCombos] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ combo_name: '', combo_barcode: '', product_ids: [], selling_price: 0 });

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const c = await ComboAPI.list(); 
      setCombos(c || []);
      const p = await ProductAPI.list(); 
      setProducts(p || []);
    } catch (e) { console.error(e); }
  }

  function toggleProduct(id) {
    setForm(prev => {
      const found = prev.product_ids.includes(id);
      return { ...prev, product_ids: found ? prev.product_ids.filter(x => x !== id) : [...prev.product_ids, id] };
    });
  }

  function change(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function save() {
    try {
      await ComboAPI.create(form);
      setOpen(false);
      setForm({ combo_name: '', combo_barcode: '', product_ids: [], selling_price: 0 });
      load();
      alert('Combo created');
    } catch (e) { alert(e.message); }
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        className="card top-actions"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <button className="btn" style={{ flexShrink: 0 }} onClick={() => setOpen(true)}>
          + Add Combo
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Combo</th>
              <th>Barcode</th>
              <th>Products</th>
              <th>Sell</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((c, idx) => (
              <tr key={c.combo_id}>
                <td>{idx + 1}</td>
                <td>{c.combo_name}</td>
                <td>{c.combo_barcode}</td>
                <td>{(c.items || []).map(i => i.product_name).join(', ')}</td>
                <td>{c.selling_price}</td>
                <td>{c.profit}</td>
              </tr>
            ))}
            {combos.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 16 }}>No combos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CommonModal open={open} onClose={() => setOpen(false)} title="Create Combo">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            className="form-row"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
          >
            <input
              className="input"
              name="combo_name"
              placeholder="Combo name"
              value={form.combo_name}
              onChange={change}
              style={{ flex: 1, minWidth: 150 }}
            />
            <input
              className="input"
              name="combo_barcode"
              placeholder="Combo barcode"
              value={form.combo_barcode}
              onChange={change}
              style={{ flex: 1, minWidth: 150 }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Select products:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {products.map(p => (
                <label
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#f8fafc',
                    padding: '6px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.product_ids.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                  />
                  <span style={{ fontSize: 13 }}>{p.product_name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <input
              className="input"
              name="selling_price"
              type="number"
              placeholder="Selling price"
              value={form.selling_price}
              onChange={change}
              style={{ flex: 1, minWidth: 150 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn" onClick={save}>Create Combo</button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
