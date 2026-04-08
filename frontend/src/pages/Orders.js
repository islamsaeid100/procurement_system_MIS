import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // States جديدة للإضافة
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
        } catch (err) {
            console.error("Error loading suppliers/products", err);
        }
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

    // --- وظيفة إضافة أوردر جديد ---
    const handleCreateOrder = async (e) => {
        e.preventDefault();
        
        // تجهيز البيانات بالشكل اللي الـ Serializer الجديد مستنيه
        const orderData = {
            supplier: parseInt(formData.supplier), // تحويل الـ ID لرقم
            items: formData.items.map(item => ({
                product: parseInt(item.product), // تأكد إن الـ ID رقم
                quantity: parseInt(item.quantity)
            }))
        };
    
        console.log("Sending Data:", orderData); // عشان تشوف البيانات في الـ Console قبل ما تتبعت
    
        try {
            const res = await api.post('orders/', orderData);
            alert("تم إنشاء طلب الشراء بنجاح! رقم الطلب: " + res.data.order_number);
            setShowAddForm(false);
            setFormData({ supplier: '', items: [{ product: '', quantity: 1 }] });
            fetchOrders(); // تحديث القائمة
        } catch (err) {
            console.error("Full Error Object:", err);
            // عرض الخطأ بشكل أوضح بدل كلمة undefined
            const errorMsg = err.response?.data 
                ? JSON.stringify(err.response.data) 
                : "حدث خطأ غير متوقع في الاتصال بالسيرفر";
            alert("خطأ في الإضافة: " + errorMsg);
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

    // --- الدالة القديمة للموافقة ---
    const handleApprove = async (orderId) => {
        if (window.confirm("هل أنت متأكد من الموافقة؟ سيتم إصدار فاتورة تلقائياً.")) {
            try {
                await api.post(`orders/${orderId}/approve/`);
                alert("تمت الموافقة بنجاح!");
                fetchOrders();
            } catch (err) {
                alert("فشل في الموافقة: " + (err.response?.data?.detail || "ليس لديك صلاحية"));
            }
        }
    };

    if (loading) return <div className="page-content">Fetching Purchase Orders...</div>;

    return (
        <div className="page-content">
            <header style={{ borderBottom: '2px solid #853953', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: '#853953' }}>Purchase Orders Management</h2>
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{ backgroundColor: '#853953', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
                >
                    {showAddForm ? 'Close' : '+ New Purchase Order'}
                </button>
            </header>

            {/* --- فورم إضافة أوردر جديد --- */}
            {showAddForm && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '30px', border: '1px solid #853953' }}>
                    <form onSubmit={handleCreateOrder}>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Select Supplier:</label>
                            <select 
                                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                                value={formData.supplier}
                                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                                required
                            >
                                <option value="">-- Choose Supplier --</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label>Order Items:</label>
                            {formData.items.map((item, index) => (
                                <div key={index} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <select 
                                        style={{ flex: 2, padding: '10px' }}
                                        value={item.product}
                                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Select Product --</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.unit_price} EGP)</option>)}
                                    </select>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        style={{ flex: 1, padding: '10px' }}
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={addItemField} style={{ marginTop: '10px', background: '#eee', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                                + Add Another Product
                            </button>
                        </div>

                        <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
                            Submit Purchase Order
                        </button>
                    </form>
                </div>
            )}

            {/* --- عرض الأوردرات --- */}
            {orders.length === 0 ? (
                <p>No purchase orders found.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <div style={{ background: '#f8f9fa', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                                <div>
                                    <span style={{ marginRight: '15px' }}><strong>Order:</strong> #{order.order_number}</span>
                                    <span style={{ marginRight: '15px' }}><strong>Officer:</strong> {order.requesting_officer_name}</span>
                                    <span><strong>Supplier:</strong> {order.supplier_name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', backgroundColor: order.status === 'approved' ? '#d4edda' : '#fff3cd', color: order.status === 'approved' ? '#155724' : '#856404' }}>
                                        {order.status.toUpperCase()}
                                    </span>
                                    {order.status === 'pending' && (
                                        <button onClick={() => handleApprove(order.id)} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                            Approve
                                        </button>
                                    )}
                                </div>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#fafafa' }}>
                                    <tr style={{ textAlign: 'left', fontSize: '13px', color: '#777' }}>
                                        <th style={{ padding: '12px' }}>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items && order.items.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                            <td style={{ padding: '12px' }}>{item.product_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.unit_price} EGP</td>
                                            <td><strong>{(item.quantity * item.unit_price).toFixed(2)} EGP</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ padding: '15px', textAlign: 'right', background: '#fff' }}>
                                <span style={{ fontSize: '18px' }}>Total: <strong style={{ color: '#853953' }}>{order.total_amount} EGP</strong></span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;