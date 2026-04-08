import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import '../styles/Print.css'; // تأكد من وجود ملف الـ CSS اللي عملناه للطباعة
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
    Title, Tooltip, Legend, ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [data, setData] = useState({ suppliers: [], products: [], orders: [], invoices: [] });
    const [filteredData, setFilteredData] = useState({ orders: [], invoices: [] });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [sup, prod, ord, inv] = await Promise.all([
                api.get('suppliers/'),
                api.get('products/'),
                api.get('orders/'),
                api.get('invoices/')
            ]);
            const allData = { suppliers: sup.data, products: prod.data, orders: ord.data, invoices: inv.data };
            setData(allData);
            setFilteredData({ orders: ord.data, invoices: inv.data });
            setLoading(false);
        } catch (err) {
            console.error("Dashboard Load Error:", err);
            setLoading(false);
        }
    };

    // --- وظيفة الفلترة بالتاريخ ---
    const handleFilter = () => {
        if (!dateRange.start || !dateRange.end) {
            alert("يرجى اختيار تاريخ البداية والنهاية");
            return;
        }

        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);

        const newOrders = data.orders.filter(o => {
            const d = new Date(o.created_at);
            return d >= start && d <= end;
        });

        const newInvoices = data.invoices.filter(i => {
            const d = new Date(i.issue_date);
            return d >= start && d <= end;
        });

        setFilteredData({ orders: newOrders, invoices: newInvoices });
    };

    const resetFilter = () => {
        setFilteredData({ orders: data.orders, invoices: data.invoices });
        setDateRange({ start: '', end: '' });
    };

    if (loading) return <div className="page-content">Loading...</div>;

    // الحسابات بناءً على البيانات المفلترة
    const totalSales = filteredData.invoices.reduce((acc, inv) => acc + parseFloat(inv.total_amount), 0);
    const barData = {
        labels: ['Suppliers', 'Products', 'Orders (Filtered)'],
        datasets: [{
            label: 'Counts',
            data: [data.suppliers.length, data.products.length, filteredData.orders.length],
            backgroundColor: ['#3498db', '#2ecc71', '#e67e22']
        }]
    };

    return (
        <div className="page-content printable-dashboard">
            {/* الجزء ده هيختفي في الطباعة */}
            <header className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '10px' }}>
                <h2 style={{ color: '#853953', margin: 0 }}>Management Dashboard</h2>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} style={{padding: '5px'}} />
                    <span>to</span>
                    <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} style={{padding: '5px'}} />
                    <button onClick={handleFilter} style={{background: '#853953', color: 'white', border: 'none', padding: '7px 15px', borderRadius: '5px', cursor: 'pointer'}}>Filter</button>
                    <button onClick={resetFilter} style={{background: '#7f8c8d', color: 'white', border: 'none', padding: '7px 15px', borderRadius: '5px', cursor: 'pointer'}}>Reset</button>
                    <button onClick={() => window.print()} style={{background: '#27ae60', color: 'white', border: 'none', padding: '7px 15px', borderRadius: '5px', cursor: 'pointer'}}>Print Report 🖨️</button>
                </div>
            </header>

            {/* عنوان يظهر في الطباعة فقط */}
            <div className="only-print" style={{ display: 'none', textAlign: 'center', marginBottom: '30px' }}>
                <h1>Procurement System - Analytics Report</h1>
                <p>Period: {dateRange.start || 'All Time'} to {dateRange.end || 'Present'}</p>
                <hr />
            </div>

            {/* 1. الرسوم البيانية */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div className="chart-box" style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                    <Bar data={barData} options={{ responsive: true }} />
                </div>
                <div className="chart-box" style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                    <Pie data={barData} />
                </div>
            </div>

            {/* 2. كروت الإحصائيات */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <div className="stat-card" style={{ flex: 1, padding: '20px', background: '#27ae60', color: 'white', borderRadius: '10px' }}>
                    <h3>{totalSales.toFixed(2)} EGP</h3>
                    <p>Total Revenue (Filtered)</p>
                </div>
                <div className="stat-card" style={{ flex: 1, padding: '20px', background: '#e67e22', color: 'white', borderRadius: '10px' }}>
                    <h3>{filteredData.orders.length}</h3>
                    <p>Total Orders in Period</p>
                </div>
            </div>

            {/* 3. الجداول التفصيلية */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="table-section">
                    <h4>Suppliers Activity</h4>
                    <table className="dash-table">
                        <thead><tr><th>Name</th><th>Orders Count</th></tr></thead>
                        <tbody>
                            {data.suppliers.map(s => (
                                <tr key={s.id}>
                                    <td>{s.name}</td>
                                    <td>{filteredData.orders.filter(o => o.supplier === s.id).length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-section">
                    <h4>Products & Inventory</h4>
                    <table className="dash-table">
                        <thead><tr><th>Product</th><th>Price</th><th>Current Stock</th></tr></thead>
                        <tbody>
                            {data.products.map(p => (
                                <tr key={p.id}><td>{p.name}</td><td>{p.unit_price}</td><td>{p.stock_quantity}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .only-print { display: block !important; }
                    .page-content { padding: 0; margin: 0; }
                    .chart-box { border: 1px solid #ccc !important; break-inside: avoid; }
                    .dash-table { width: 100%; border-collapse: collapse; }
                    .dash-table th, .dash-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .stat-card { color: black !important; border: 1px solid #ccc !important; background: none !important; }
                }
                .dash-table { width: 100%; border-collapse: collapse; background: white; }
                .dash-table th { background: #f4f4f4; padding: 10px; }
                .dash-table td { padding: 10px; border-bottom: 1px solid #eee; }
                .table-section { background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            `}</style>
        </div>
    );
};

export default Dashboard;