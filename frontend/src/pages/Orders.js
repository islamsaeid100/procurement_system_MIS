import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        supplier: '',
        items: [{ product: '', quantity: 1 }]
    });

    useEffect(() => {
        fetchOrders();
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [supRes, prodRes] = await Promise.all([
                api.get('suppliers/'),
                api.get('products/')
            ]);
            setSuppliers(supRes.data);
            setProducts(prodRes.data);
        } catch (err) { console.error("Error loading data", err); }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('orders/');
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Orders Load Error:", err);
            setLoading(false);
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        const orderData = {
            supplier: parseInt(formData.supplier),
            items: formData.items.map(item => ({
                product: parseInt(item.product),
                quantity: parseInt(item.quantity)
            }))
        };
        try {
            const res = await api.post('orders/', orderData);
            alert("Order Created Successfully! PO: " + res.data.order_number);
            setShowAddForm(false);
            setFormData({ supplier: '', items: [{ product: '', quantity: 1 }] });
            fetchOrders();
        } catch (err) {
            alert("Error: " + JSON.stringify(err.response?.data));
        }
    };

    const addItemField = () => {
        setFormData({ ...formData, items: [...formData.items, { product: '', quantity: 1 }] });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const handleApprove = async (orderId) => {
        if (window.confirm("Approve this order? An invoice will be generated.")) {
            try {
                await api.post(`orders/${orderId}/approve/`);
                alert("Order Approved!");
                fetchOrders();
            } catch (err) {
                alert("Action failed: " + (err.response?.data?.detail || "Permission denied"));
            }
        }
    };

    if (loading) return <div className="page-content" style={{textAlign:'center', padding:'50px'}}>Processing Orders...</div>;

    return (
        <div className="orders-container">
            {/* 1. Header القسم العلوي */}
            <header className="page-content no-print" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ color: 'var(--color-1)', margin: 0 }}>Purchase Orders</h2>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Create and manage procurement requests</p>
                </div>
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{ background: showAddForm ? 'var(--text-muted)' : 'linear-gradient(90deg, var(--color-2), var(--color-3))' }}
                >
                    {showAddForm ? 'Cancel' : '+ New Request'}
                </button>
            </header>

            {/* 2. فورم الإضافة المطور */}
            {showAddForm && (
                <div className="page-content" style={{ marginBottom: '30px', animation: 'slideDown 0.4s ease' }}>
                    <h3 style={{ color: 'var(--color-1)', marginTop: 0 }}>Create New Purchase Order</h3>
                    <form onSubmit={handleCreateOrder}>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Target Supplier</label>
                                <select 
                                    className="modern-select"
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}
                                >
                                    <option value="">-- Select Provider --</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Selected Items</label>
                                {formData.items.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <select 
                                            style={{ flex: 3, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}
                                            value={item.product}
                                            onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                            required
                                        >
                                            <option value="">-- Choose Product --</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.unit_price} EGP)</option>)}
                                        </select>
                                        <input 
                                            type="number" min="1" placeholder="Qty"
                                            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={addItemField} className="edit-btn" style={{ width: '100%', padding: '10px' }}>
                                    + Add Line Item
                                </button>
                            </div>
                        </div>

                        <button type="submit" style={{ width: '100%', marginTop: '20px', padding: '15px' }}>
                            Confirm & Submit Order
                        </button>
                    </form>
                </div>
            )}

            {/* 3. قائمة الطلبات بنظام الكروت */}
            <div className="orders-grid">
                {orders.length === 0 ? (
                    <div className="page-content" style={{textAlign:'center'}}>No active orders found.</div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="page-content" style={{ padding: '0', overflow: 'hidden', marginBottom: '30px', border: '1px solid rgba(13, 17, 100, 0.1)' }}>
                            {/* كارت الهيدر */}
                            <div style={{ background: 'rgba(13, 17, 100, 0.03)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--color-1)' }}>PO #{order.order_number}</h4>
                                    <small style={{ color: 'var(--text-muted)' }}>By: {order.requesting_officer_name} | To: {order.supplier_name}</small>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span className={`badge ${order.status}`} style={{
                                        background: order.status === 'approved' ? '#dcfce7' : '#fef9c3',
                                        color: order.status === 'approved' ? '#15803d' : '#a16207',
                                        padding: '6px 15px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold'
                                    }}>
                                        {order.status.toUpperCase()}
                                    </span>
                                    {order.status === 'pending' && (
                                        <button onClick={() => handleApprove(order.id)} style={{ background: 'var(--color-1)', padding: '6px 12px', fontSize: '12px' }}>
                                            Approve
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* جدول المنتجات داخل الطلب */}
                            <table className="dash-table" style={{ margin: '0', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ paddingLeft: '20px' }}>Product</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th style={{ paddingRight: '20px' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items && order.items.map(item => (
                                        <tr key={item.id}>
                                            <td style={{ paddingLeft: '20px' }}>{item.product_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{parseFloat(item.unit_price).toLocaleString()} EGP</td>
                                            <td style={{ paddingRight: '20px' }}><strong>{(item.quantity * item.unit_price).toLocaleString()} EGP</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* فوتر الكارت */}
                            <div style={{ padding: '20px', textAlign: 'right', borderTop: '1.5px solid #f1f5f9' }}>
                                <span style={{ color: 'var(--text-muted)', marginRight: '10px' }}>Order Total:</span>
                                <strong style={{ fontSize: '1.4rem', color: 'var(--color-1)' }}>{parseFloat(order.total_amount).toLocaleString()} EGP</strong>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;