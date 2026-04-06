import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // هنجيب كل الأوردرات، والباك إند المفروض بيبعت معاها الـ Items
            const res = await api.get('orders/');
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Orders Load Error:", err);
            setLoading(false);
        }
    };

    if (loading) return <div className="page-content">Fetching Purchase Orders...</div>;

    return (
        <div className="page-content">
            <header style={{ borderBottom: '2px solid #e67e22', marginBottom: '20px' }}>
                <h2>Purchase Orders Inventory</h2>
            </header>

            {orders.length === 0 ? (
                <p>No purchase orders found.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} style={{ 
                            background: '#fff', 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            marginBottom: '20px',
                            overflow: 'hidden'
                        }}>
                            {/* رأس الأوردر (Header) */}
                            <div style={{ background: '#f8f9fa', padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Order ID:</strong> #{order.id}</span>
                                <span><strong>Status:</strong> {order.status}</span>
                                <span><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</span>
                            </div>

                            {/* تفاصيل المنتجات داخل الأوردر (Order Items) */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', padding: '10px' }}>
                                <thead style={{ background: '#eee' }}>
                                    <tr>
                                        <th style={{ padding: '10px' }}>Product ID</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* هنا بنعمل Loop على الـ items اللي جوه كل أوردر بناءً على الصورة اللي بعتها */}
                                    {order.items && order.items.map(item => (
                                        <tr key={item.id} style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '10px' }}>{item.product}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.unit_price}</td>
                                            <td><strong>${(item.quantity * item.unit_price).toFixed(2)}</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'right', padding: '10px' }}><strong>Total Order Amount:</strong></td>
                                        <td style={{ textAlign: 'center', color: '#e67e22' }}>
                                            <strong>${order.total_price || 'Calculating...'}</strong>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;