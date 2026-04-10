import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // الحالة الخاصة بطلب "الصرف"
    const [stockOutData, setStockOutData] = useState({ productId: null, productName: '', quantity: 0 });
    const [showStockOutModal, setShowStockOutModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        unit_price: '',
        stock_quantity: 0,
        supplier: ''
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
            alert("Product Added Successfully!");
            loadData();
            setFormData({ name: '', description: '', category: '', unit_price: '', stock_quantity: 0, supplier: '' });
            setShowForm(false);
        } catch (err) {
            alert("Error adding product. Check your data.");
        }
    };

    // دالة تنفيذ عملية الصرف من المخزن
    const handleStockOutSubmit = async (e) => {
        e.preventDefault();
        
        const currentProduct = products.find(p => p.id === stockOutData.productId);
        
        if (stockOutData.quantity > currentProduct.stock_quantity) {
            alert("Error: Quantity requested is more than available stock!");
            return;
        }

        try {
            // هنا بنبعت الحركة للسيرفر (تأكد من وجود الـ Endpoint ده في الباك إند)
            // لو بتعدل الاستوك مباشرة، ممكن تبعت طلب PATCH للمنتج
            await api.patch(`products/${stockOutData.productId}/`, {
                stock_quantity: currentProduct.stock_quantity - stockOutData.quantity
            });
            
            alert(`Stock updated! Remaining: ${currentProduct.stock_quantity - stockOutData.quantity}`);
            setShowStockOutModal(false);
            setStockOutData({ productId: null, productName: '', quantity: 0 });
            loadData(); // تحديث الجدول
        } catch (err) {
            alert("Error updating stock. Check server permissions.");
        }
    };

    if (loading) return <div className="page-content" style={{textAlign:'center', padding:'50px'}}>Updating Inventory...</div>;

    return (
        <div className="products-page">
            {/* 1. الهيدر الموحد */}
            <header className="page-content" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ color: 'var(--color-1)', margin: 0 }}>Product Catalog</h2>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage inventory and stock movements</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} style={{ background: showForm ? 'var(--text-muted)' : 'linear-gradient(90deg, var(--color-2), var(--color-3))' }}>
                    {showForm ? 'Close Form' : '+ Register Product'}
                </button>
            </header>

            {/* 2. فورم الإضافة المطور */}
            {showForm && (
                <div className="page-content" style={{ marginBottom: '30px', animation: 'slideUp 0.4s ease' }}>
                    <h3 style={{ color: 'var(--color-1)', marginTop: 0 }}>Register New Item</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div className="input-group">
                                <label>Product Name</label>
                                <input placeholder="e.g. Laptop" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <input placeholder="e.g. Electronics" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Supplier</label>
                                <select value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} required>
                                    <option value="">Choose Supplier</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Unit Price (EGP)</label>
                                <input type="number" step="0.01" placeholder="0.00" value={formData.unit_price} onChange={e => setFormData({...formData, unit_price: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Initial Stock</label>
                                <input type="number" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} required />
                            </div>
                            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Product Description</label>
                                <textarea rows="3" placeholder="Brief details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'12px', border:'1.5px solid #e2e8f0'}} />
                            </div>
                            <button type="submit" style={{ gridColumn: '1 / -1', padding: '15px' }}>Confirm & Save</button>
                        </div>
                    </form>
                </div>
            )}

            {/* 3. المودال الخاص بصرف المخزون (Stock Out Modal) */}
            {showStockOutModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div className="page-content" style={{ width: '400px', borderRadius: '24px', position: 'relative' }}>
                        <h3 style={{ color: 'var(--color-3)' }}>Stock Out: {stockOutData.productName}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter the quantity to remove from inventory.</p>
                        <form onSubmit={handleStockOutSubmit}>
                            <input 
                                type="number" 
                                min="1" 
                                placeholder="Quantity to remove" 
                                required 
                                style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}
                                onChange={(e) => setStockOutData({ ...stockOutData, quantity: parseInt(e.target.value) })}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 1, background: 'var(--color-3)' }}>Confirm Out</button>
                                <button type="button" onClick={() => setShowStockOutModal(false)} style={{ flex: 1, background: '#94a3b8' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 4. جدول المنتجات المطور */}
            <div className="dash-table-container">
                <table className="dash-table">
                    <thead>
                        <tr>
                            <th>Product Details</th>
                            <th>Category</th>
                            <th>Supplier</th>
                            <th>Price</th>
                            <th>Stock Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <div style={{fontWeight: '700', color: 'var(--color-1)'}}>{p.name}</div>
                                    <div style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>{p.description?.substring(0, 25)}...</div>
                                </td>
                                <td><span className="badge">{p.category}</span></td>
                                <td>{p.supplier_name || 'N/A'}</td>
                                <td style={{fontWeight: '600'}}>{parseFloat(p.unit_price).toLocaleString()} EGP</td>
                                <td>
                                    <span style={{ color: p.stock_quantity < 5 ? 'var(--color-3)' : 'inherit', fontWeight: '700' }}>
                                        {p.stock_quantity} units
                                    </span>
                                    {p.stock_quantity < 5 && <div style={{fontSize:'10px', color:'var(--color-3)'}}>Low Stock!</div>}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button 
                                        className="edit-btn" 
                                        style={{ borderColor: 'var(--color-3)', color: 'var(--color-3)', fontSize: '0.8rem', padding: '5px 12px' }}
                                        onClick={() => {
                                            setStockOutData({ productId: p.id, productName: p.name, quantity: 0 });
                                            setShowStockOutModal(true);
                                        }}
                                    >
                                        Stock Out 📤
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;