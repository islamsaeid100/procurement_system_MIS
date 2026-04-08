import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// تفعيل أدوات الرسم البياني
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [s, p, o] = await Promise.all([
                    api.get('suppliers/'),
                    api.get('products/'),
                    api.get('orders/')
                ]);

                setChartData({
                    labels: ['Suppliers', 'Products', 'Orders'],
                    datasets: [
                        {
                            label: 'System Records',
                            data: [s.data.length, p.data.length, o.data.length],
                            backgroundColor: ['#3498db', '#2ecc71', '#e67e22'],
                            borderWidth: 1,
                        },
                    ],
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="page-content">Loading Charts...</div>;

    return (
        <div className="page-content">
            <h2 style={{color: '#2c3e50', marginBottom: '30px'}}>Analytics Overview</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                {/* الرسم البياني للأعمدة */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <h4 style={{textAlign: 'center'}}>Inventory Bar Chart</h4>
                    {chartData && <Bar data={chartData} />}
                </div>

                {/* الرسم البياني الدائري */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <h4 style={{textAlign: 'center'}}>Distribution Pie Chart</h4>
                    {chartData && <Pie data={chartData} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;