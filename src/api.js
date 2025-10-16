const baseURL = process.env.REACT_APP_API_URL || '';


async function api(path, method = 'GET', body) {
const headers = { 'Content-Type': 'application/json' };
const res = await fetch(baseURL + path, {
method,
headers,
body: body ? JSON.stringify(body) : undefined,
});
if (!res.ok) {
const text = await res.text();
throw new Error(text || res.statusText);
}
return res.status === 204 ? null : res.json();
}


export const ProductAPI = {
list: () => api('/api/billing_products', 'GET'),
create: (p) => api('/api/billing_products', 'POST', p),
update: (id, p) => api(`/api/billing_products/${id}`, 'PUT', p),
delete: (id) => api(`/api/billing_products/${id}`, 'DELETE'),
};


export const PurchaseAPI = {
create: (p) => api('/api/purchases', 'POST', p),
list: () => api('/api/purchases', 'GET'),
};


export const SalesAPI = {
create: (s) => api('/api/sales', 'POST', s),
list: () => api('/api/sales', 'GET'),
};


export const ComboAPI = {
list: () => api('/api/combo_products', 'GET'),
create: (c) => api('/api/combo_products', 'POST', c),
};


export default api;