import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
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
            setData({ suppliers: sup.data, products: prod.data, orders: ord.data, invoices: inv.data });
            setFilteredData({ orders: ord.data, invoices: inv.data });
            setLoading(false);
        } catch (err) {
            console.error("Dashboard Load Error:", err);
            setLoading(false);
        }
    };

    const handleFilter = () => {
        if (!dateRange.start || !dateRange.end) {
            alert("يرجى اختيار الفترة الزمنية");
            return;
        }
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        const newOrders = data.orders.filter(o => { const d = new Date(o.created_at); return d >= start && d <= end; });
        const newInvoices = data.invoices.filter(i => { const d = new Date(i.issue_date); return d >= start && d <= end; });
        setFilteredData({ orders: newOrders, invoices: newInvoices });
    };

    const resetFilter = () => {
        setFilteredData({ orders: data.orders, invoices: data.invoices });
        setDateRange({ start: '', end: '' });
    };

    if (loading) return <div className="page-content" style={{textAlign: 'center', padding: '50px'}}>Loading Analytics...</div>;

    const totalSales = filteredData.invoices.reduce((acc, inv) => acc + parseFloat(inv.total_amount), 0);
    
    // ألوان هادئة ومريحة للرسوم البيانية (Muted Palette)
    const chartColors = ['#4e54c8', '#a445b2', '#ff4b5c', '#f78d60'];

    const barData = {
        labels: ['Suppliers', 'Products', 'Orders'],
        datasets: [{
            label: 'Total Count',
            data: [data.suppliers.length, data.products.length, filteredData.orders.length],
            backgroundColor: chartColors,
            borderRadius: 12,
            borderWidth: 0,
        }]
    };

    return (
        <div className="dashboard-wrapper">
            {/* 1. نظام الفلترة (Header) */}
            <header className="page-content no-print" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '25px',
                borderRadius: '24px',
                padding: '20px 30px'
            }}>
                <div style={{color: '#0D1164'}}>
                    <h2 style={{margin: 0, fontSize: '1.5rem'}}>Analytics Dashboard</h2>
                    <p style={{margin: 0, fontSize: '0.8rem', opacity: 0.6}}>Overview of your procurement performance</p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{display: 'flex', background: '#f1f5f9', padding: '5px 15px', borderRadius: '15px', gap: '10px', alignItems: 'center'}}>
                        <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} style={{border: 'none', background: 'transparent', fontSize: '0.8rem'}} />
                        <span style={{color: '#94a3b8'}}>→</span>
                        <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} style={{border: 'none', background: 'transparent', fontSize: '0.8rem'}} />
                    </div>
                    <button onClick={handleFilter} style={{padding: '10px 20px', borderRadius: '15px'}}>Update</button>
                    <button onClick={resetFilter} style={{background: '#f1f5f9', color: '#64748b', boxShadow: 'none', padding: '10px 15px', borderRadius: '15px'}}>Reset</button>
                    <button onClick={() => window.print()} style={{background: '#0D1164', color: '#fff', padding: '10px 15px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span>⎙</span> Print
                    </button>
                </div>
            </header>

            {/* 2. كروت الإحصائيات (تباين عالي وكيرفات ناعمة) */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div className="stat-card" style={{ 
                    flex: 1, 
                    background: 'linear-gradient(135deg, #0D1164, #2d3494)', 
                    color: '#fff', 
                    borderRadius: '24px',
                    padding: '25px' 
                }}>
                    <p style={{fontSize: '0.9rem', opacity: 0.8, margin: 0}}>Total Revenue</p>
                    <h2 style={{fontSize: '2rem', margin: '10px 0'}}>{totalSales.toLocaleString()} <span style={{fontSize: '1rem'}}>EGP</span></h2>
                </div>
                
                <div className="stat-card" style={{ 
                    flex: 1, 
                    background: 'linear-gradient(135deg, #EA2264, #ff5e78)', 
                    color: '#fff', 
                    borderRadius: '24px',
                    padding: '25px' 
                }}>
                    <p style={{fontSize: '0.9rem', opacity: 0.8, margin: 0}}>Total Orders</p>
                    <h2 style={{fontSize: '2rem', margin: '10px 0'}}>{filteredData.orders.length}</h2>
                </div>

                <div className="stat-card" style={{ 
                    flex: 1, 
                    background: '#fff', 
                    color: '#0D1164', 
                    borderRadius: '24px',
                    padding: '25px',
                    border: '1px solid rgba(13, 17, 100, 0.1)'
                }}>
                    <p style={{fontSize: '0.9rem', opacity: 0.6, margin: 0}}>Active Products</p>
                    <h2 style={{fontSize: '2rem', margin: '10px 0'}}>{data.products.length}</h2>
                </div>
            </div>

            {/* 3. الرسوم البيانية */}
            <div style={{ display: 'flex', gap: '25px', marginBottom: '30px' }}>
                <div className="page-content" style={{ flex: 1.5, borderRadius: '24px' }}>
                    <h4 style={{marginTop: 0, color: '#0D1164', opacity: 0.7}}>Volume Analysis</h4>
                    <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }} />
                </div>
                <div className="page-content" style={{ flex: 1, borderRadius: '24px' }}>
                    <h4 style={{marginTop: 0, color: '#0D1164', opacity: 0.7}}>Distribution</h4>
                    <Pie data={barData} options={{ plugins: { legend: { position: 'bottom' } } }} />
                </div>
            </div>

            {/* 4. الجداول */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div className="dash-table-container" style={{borderRadius: '24px'}}>
                    <h4 style={{color: '#640D5F', paddingLeft: '10px'}}>Recent Suppliers</h4>
                    <table className="dash-table">
                        <thead><tr><th>Supplier Name</th><th>Activity</th></tr></thead>
                        <tbody>
                            {data.suppliers.slice(0, 5).map(s => (
                                <tr key={s.id}>
                                    <td><strong>{s.name}</strong></td>
                                    <td><span className="badge" style={{background: '#f1f5f9', color: '#0D1164'}}>{filteredData.orders.filter(o => o.supplier === s.id).length} Orders</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="dash-table-container" style={{borderRadius: '24px'}}>
                    <h4 style={{color: '#EA2264', paddingLeft: '10px'}}>Inventory Snapshot</h4>
                    <table className="dash-table">
                        <thead><tr><th>Product</th><th>Stock</th></tr></thead>
                        <tbody>
                            {data.products.slice(0, 5).map(p => (
                                <tr key={p.id}>
                                    <td><strong>{p.name}</strong></td>
                                    <td><span style={{color: p.stock_quantity < 10 ? '#ff4b5c' : '#2ecc71', fontWeight: 'bold'}}>{p.stock_quantity} units</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;