import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Purchases from './components/Purchases';
import Sales from './components/Sales';
import Combos from './components/Combos';
import Reports from './components/Reports';
// import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';


export default function App() {
return (
<div className="app-root">
<Sidebar />
<div className="main-area">
<Header />
<div className="page-content">
<Routes>
<Route path="/" element={<Navigate to="/products" replace />} />
<Route path="/products" element={<ProductList />} />
<Route path="/purchases" element={<Purchases />} />
<Route path="/sales" element={<Sales />} />
<Route path="/combos" element={<Combos />} />
<Route path="/reports" element={<Reports />} />
</Routes>
</div>
</div>
</div>
);
}