import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async (params = {}) => {
        setLoading(true);
        try {
            const res = await api.get('invoices/', { params });
            setInvoices(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchInvoices({ start_date: startDate, end_date: endDate });
    };

    const printSingleInvoice = (inv) => {
        if (!inv.order_details) {
            alert("This order has no details yet.");
            return;
        }
        const printWindow = window.open('', '_blank');
        const itemsHtml = inv.order_details.items ? inv.order_details.items.map(item => `
            <tr>
                <td style="padding:15px; border-bottom:1px solid #f1f5f9;">${item.product_name}</td>
                <td style="padding:15px; border-bottom:1px solid #f1f5f9;">${item.quantity}</td>
                <td style="padding:15px; border-bottom:1px solid #f1f5f9;">${item.unit_price} EGP</td>
                <td style="padding:15px; border-bottom:1px solid #f1f5f9; font-weight:bold; color:#0D1164;">${(item.quantity * item.unit_price).toFixed(2)} EGP</td>
            </tr>
        `).join('') : '';

        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice ${inv.invoice_number}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; color: #1e293b; padding: 50px; }
                        .container { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 24px; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0D1164; padding-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
                        th { text-align: left; background: #f8fafc; padding: 12px; color: #64748b; font-size: 12px; }
                        .total { margin-top: 30px; text-align: right; font-size: 22px; font-weight: bold; color: #0D1164; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>PMS SYSTEM</h2>
                            <div style="text-align:right">
                                <h1 style="margin:0; color:#EA2264">INVOICE</h1>
                                <span># ${inv.invoice_number}</span>
                            </div>
                        </div>
                        <div style="margin-top:30px; display:grid; grid-template-columns: 1fr 1fr;">
                            <div><strong>Officer:</strong> ${inv.order_details.requesting_officer_name}</div>
                            <div style="text-align:right"><strong>Date:</strong> ${new Date(inv.issue_date).toLocaleDateString()}</div>
                        </div>
                        <table>
                            <thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                            <tbody>${itemsHtml}</tbody>
                        </table>
                        <div class="total">Total: ${inv.total_amount} EGP</div>
                    </div>
                    <script>window.onload = function() { setTimeout(() => { window.print(); window.close(); }, 500); }</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const totalSum = invoices.reduce((acc, inv) => acc + parseFloat(inv.total_amount), 0);

    if (loading) return <div className="container" style={{textAlign:'center', marginTop:'100px'}}>Loading...</div>;

    return (
        <div className="invoice-module">
            {/* 1. الفلتر والهيدر (مدمج في الثيم) */}
            <div className="page-content no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h2 style={{ color: 'var(--color-1)', margin: 0 }}>Financial Invoices</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accounting & Reporting</p>
                </div>
                
                <form onSubmit={handleFilter} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.03)', padding: '5px 15px', borderRadius: '15px', gap: '10px', alignItems: 'center' }}>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ border: 'none', background: 'transparent' }} />
                        <span>→</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ border: 'none', background: 'transparent' }} />
                    </div>
                    <button type="submit">Filter</button>
                    <button type="button" onClick={() => window.print()} className="logout-btn" style={{background: 'var(--color-1)'}}>
                        <span>⎙</span> Print List
                    </button>
                </form>
            </div>

            {/* 2. الجدول المالي الرئيسي */}
            <div className="dash-table-container">
                <table className="dash-table">
                    <thead>
                        <tr>
                            <th>Inv #</th>
                            <th>Officer</th>
                            <th>Supplier</th>
                            <th>Issue Date</th>
                            <th>Amount</th>
                            <th className="no-print">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv.id}>
                                <td><span className="badge">{inv.invoice_number}</span></td>
                                <td>{inv.order_details?.requesting_officer_name}</td>
                                <td>{inv.order_details?.supplier_name}</td>
                                <td>{new Date(inv.issue_date).toLocaleDateString()}</td>
                                <td><strong style={{color: 'var(--color-1)'}}>{parseFloat(inv.total_amount).toLocaleString()} EGP</strong></td>
                                <td className="no-print">
                                    <button 
                                        onClick={() => printSingleInvoice(inv)} 
                                        style={{ background: 'transparent', color: 'var(--color-3)', border: '1px solid var(--color-3)', padding: '5px 15px', borderRadius: '10px' }}
                                    >
                                        Print 📄
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'right', padding: '20px', color: 'var(--text-muted)', fontWeight: 'bold' }}>GRAND TOTAL:</td>
                            <td colSpan="2" style={{ padding: '20px' }}>
                                <strong style={{ fontSize: '1.3rem', color: 'var(--color-1)' }}>{totalSum.toLocaleString()} EGP</strong>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default Invoices;