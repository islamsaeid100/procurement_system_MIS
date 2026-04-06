import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    // الحقول مطابقة لصورة الـ Model اللي بعتها يا إسلام
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        unit_price: '',
        stock_quantity: 0,
        supplier: '' // ده الـ ID بتاع المورد (ForeignKey)
    });

    const loadData = async () => {
        try {
            const [prodRes, supRes] = await Promise.all([
                api.get('products/'),
                api.get('suppliers/')
            ]);
            setProducts(prodRes.data);
            setSuppliers(supRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Data Load Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('products/', formData);
            alert("Product Registered Successfully!");
            loadData();
            // تصفير الفورم
            setFormData({ name: '', description: '', category: '', unit_price: '', stock_quantity: 0, supplier: '' });
        } catch (err) {
            console.error("Post Error:", err.response?.data);
            alert("Error adding product. Check terminal for details.");
        }
    };

    if (loading) return <div className="page-content">Loading Inventory...</div>;

    return (
        <div className="page-content">
            <header style={{ borderBottom: '2px solid #34495e', marginBottom: '20px' }}>
                <h2>Product Catalog Management</h2>
            </header>

            {/* فورم إضافة منتج جديد */}
            <form onSubmit={handleSubmit} style={{ background: '#fdfdfd', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
                <h4 style={{marginTop: 0, color: '#2c3e50'}}>Register New Product Item</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <input placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    
                    <input placeholder="Category (e.g. Electronics)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />

                    <select value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} required>
                        <option value="">Select Supplier (Required)</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    <input type="number" step="0.01" placeholder="Unit Price" value={formData.unit_price} onChange={e => setFormData({...formData, unit_price: e.target.value})} required />
                    
                    <input type="number" placeholder="Stock Quantity" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} required />
                    
                    <textarea placeholder="Product Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{gridColumn: 'span 3', padding: '10px'}} />
                    
                    <button type="submit" style={{ gridColumn: 'span 3', background: '#34495e', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Save to Database
                    </button>
                </div>
            </form>

            {/* جدول عرض المنتجات */}
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Supplier</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td><strong>{p.name}</strong></td>
                            <td>{p.category}</td>
                            <td>${p.unit_price}</td>
                            <td>{p.stock_quantity} units</td>
                            <td>{p.supplier_name || `Supplier ID: ${p.supplier}`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Products;