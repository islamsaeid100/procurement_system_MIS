import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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
            })
            .catch(err => {
                console.error("Post Error:", err.response?.data);
                alert("Error adding supplier.");
            });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredSuppliers = suppliers.filter(sup => 
        (sup.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (sup.contact_person?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="page-content">Connecting to Database...</div>;

    return (
        <div className="page-content">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #2c3e50', paddingBottom: '10px' }}>
                <h2 style={{margin: 0, color: '#853953'}}>Suppliers Directory</h2>
                <div style={{ color: '#7f8c8d' }}>Total: {suppliers.length} Records</div>
            </header>

            <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <h3 style={{marginTop: 0}}>Register New Vendor</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <input name="name" placeholder="Company Name" value={formData.name} onChange={handleChange} required />
                    <input name="contact_person" placeholder="Contact Person" value={formData.contact_person} onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Business Email" value={formData.email} onChange={handleChange} required />
                    <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                    <input name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} style={{gridColumn: 'span 2'}} required />
                    <button type="submit" style={{ background: '#853953', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
                        + Add Supplier
                    </button>
                </form>
            </section>

            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Search Suppliers..." 
                    style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
            </div>

            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Contact Person</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSuppliers.map(sup => (
                        <tr key={sup.id}>
                            <td><strong>{sup.name}</strong></td>
                            <td>{sup.contact_person}</td>
                            <td>{sup.email}</td>
                            <td>{sup.phone}</td>
                            <td>{sup.address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Suppliers;