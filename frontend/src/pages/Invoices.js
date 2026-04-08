import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('invoices/') // تأكد إن الـ URL ده موجود عند زميلك
            .then(res => {
                setInvoices(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handlePrint = (invoiceId) => {
        // حركة احترافية: فتح نافذة الطباعة للمتصفح
        window.print();
    };

    if (loading) return <div className="page-content">Loading Financial Records...</div>;

    return (
        <div className="page-content">
            <header style={{ borderBottom: '2px solid #27ae60', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <h2>Invoices & Billing</h2>
                <button onClick={() => window.print()} style={{background: '#27ae60', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px'}}>
                    Print Monthly Report 🖨️
                </button>
            </header>

            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Order ID</th>
                        <th>Total Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th className="no-print">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(inv => (
                        <tr key={inv.id}>
                            <td>INV-{inv.invoice_number || inv.id}</td>
                            <td>Order #{inv.order}</td>
                            <td style={{fontWeight: 'bold', color: '#27ae60'}}>${inv.total_amount}</td>
                            <td>{new Date(inv.due_date).toLocaleDateString()}</td>
                            <td>
                                <span style={{color: inv.is_paid ? 'green' : 'red'}}>
                                    {inv.is_paid ? 'Paid' : 'Unpaid'}
                                </span>
                            </td>
                            <td className="no-print">
                                <button onClick={() => alert('Viewing Details...')} style={{cursor: 'pointer'}}>👁️ View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* CSS مخصوص للطباعة عشان نخفي الـ Navbar والزراير وقت الطباعة */}
            <style>
                {`
                @media print {
                    .navbar, .no-print, button { display: none !important; }
                    .page-content { margin: 0; padding: 0; }
                    table { width: 100%; border: 1px solid #000; }
                }
                `}
            </style>
        </div>
    );
};

export default Invoices;