import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
    });

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('suppliers/');
            setSuppliers(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('suppliers/', formData)
            .then(() => {
                alert("Supplier Registered Successfully!");
                fetchSuppliers();
                setFormData({ name: '', contact_person: '', email: '', phone: '', address: '' });
                setShowForm(false);
            })
            .catch(err => {
                alert("Error adding supplier. Check your connection.");
            });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredSuppliers = suppliers.filter(sup => 
        (sup.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (sup.contact_person?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="page-content" style={{textAlign:'center', padding:'50px'}}>Connecting to Directory...</div>;

    return (
        <div className="suppliers-page">
            {/* 1. هيدر الموردين المطور */}
            <header className="page-content" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ color: 'var(--color-1)', margin: 0 }}>Suppliers Directory</h2>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total: {suppliers.length} Registered Vendors</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                        type="text" 
                        placeholder="🔍 Quick Search..." 
                        style={{ padding: '10px 15px', borderRadius: '12px', border: '1.5px solid #e2e8f0', width: '250px' }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <button onClick={() => setShowForm(!showForm)} style={{ background: showForm ? 'var(--text-muted)' : 'linear-gradient(90deg, var(--color-2), var(--color-3))' }}>
                        {showForm ? 'Cancel' : '+ New Vendor'}
                    </button>
                </div>
            </header>

            {/* 2. فورم إضافة مورد (Glassmorphism) */}
            {showForm && (
                <div className="page-content" style={{ marginBottom: '30px', animation: 'slideUp 0.4s ease' }}>
                    <h3 style={{ color: 'var(--color-1)', marginTop: 0 }}>Register New Partner</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <div className="input-group">
                                <label>Company Name</label>
                                <input name="name" placeholder="e.g. Tech Solutions Inc." value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Contact Person</label>
                                <input name="contact_person" placeholder="Name of representative" value={formData.contact_person} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input name="email" type="email" placeholder="vendor@example.com" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input name="phone" placeholder="+20 123 456 789" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label>Office Address</label>
                                <input name="address" placeholder="Building, Street, City" value={formData.address} onChange={handleChange} required />
                            </div>
                            <button type="submit" style={{ gridColumn: '1 / -1', padding: '15px', marginTop: '10px' }}>
                                Confirm Registration
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 3. جدول الموردين المطور */}
            <div className="dash-table-container">
                <table className="dash-table">
                    <thead>
                        <tr>
                            <th>Partner Info</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.length > 0 ? filteredSuppliers.map(sup => (
                            <tr key={sup.id}>
                                <td>
                                    <div style={{fontWeight: '700', color: 'var(--color-1)'}}>{sup.name}</div>
                                    <div style={{fontSize: '10px', color: 'var(--color-3)', letterSpacing: '1px'}}>VERIFIED VENDOR</div>
                                </td>
                                <td>{sup.contact_person}</td>
                                <td><a href={`mailto:${sup.email}`} style={{textDecoration:'none', color:'var(--color-2)'}}>{sup.email}</a></td>
                                <td>{sup.phone}</td>
                                <td style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{sup.address}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{textAlign:'center', padding:'30px'}}>No suppliers match your search.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Suppliers;