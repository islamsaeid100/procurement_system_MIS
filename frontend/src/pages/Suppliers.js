<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // حالة البحث

    // حقول المورد بناءً على الـ Model بتاعك يا إسلام
    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
    });

    const fetchSuppliers = () => {
        api.get('suppliers/')
            .then(res => {
                setSuppliers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('suppliers/', formData)
            .then(res => {
                alert("Supplier Registered Successfully!");
                fetchSuppliers();
                setFormData({ name: '', contact_person: '', email: '', phone: '', address: '' });
            })
            .catch(err => {
                console.error("Post Error:", err.response?.data);
                alert("Error adding supplier. Check console or uniqueness of email.");
            });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // فلترة الموردين بناءً على اسم البحث
    const filteredSuppliers = suppliers.filter(sup => 
        sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="page-content">Connecting to Database...</div>;

    return (
        <div className="page-content">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #2c3e50', paddingBottom: '10px' }}>
                <h2 style={{margin: 0}}>Suppliers Directory</h2>
                <div style={{ color: '#7f8c8d' }}>Total: {suppliers.length} Records</div>
            </header>

            {/* فورم إضافة مورد جديد */}
            <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <h3 style={{marginTop: 0, color: '#34495e'}}>Register New Vendor</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <input name="name" placeholder="Company Name" value={formData.name} onChange={handleChange} required />
                    <input name="contact_person" placeholder="Contact Person" value={formData.contact_person} onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Business Email" value={formData.email} onChange={handleChange} required />
                    <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                    <input name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} style={{gridColumn: 'span 2'}} required />
                    <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        + Add Supplier
                    </button>
                </form>
            </section>

            {/* شريط البحث الذكي */}
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{fontWeight: 'bold'}}>Search:</span>
                <input 
                    type="text" 
                    placeholder="Search by Name or Contact Person..." 
                    style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
            </div>

            {/* جدول عرض الموردين بفلترة لحظية */}
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Contact Person</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map(sup => (
                            <tr key={sup.id}>
                                <td><strong>{sup.name}</strong></td>
                                <td>{sup.contact_person}</td>
                                <td>{sup.email}</td>
                                <td>{sup.phone}</td>
                                <td>{sup.address}</td>
                                <td>
                                    <button style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }} title="Delete">🗑️</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No suppliers match your search.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

=======
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // الحقول دي لازم تطابق الـ Fields في الـ Serializer بتاع الباك-إند
    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
    });

    // جلب البيانات من الداتابيز
    const fetchSuppliers = async () => {
        try {
            const res = await api.get('suppliers/');
            // تأكد إن res.data هي قائمة (Array)
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
            .then(res => {
                alert("Supplier Registered Successfully!");
                fetchSuppliers(); // تحديث الجدول بعد الإضافة
                setFormData({ name: '', contact_person: '', email: '', phone: '', address: '' });
            })
            .catch(err => {
                console.error("Post Error:", err.response?.data);
                alert("Error adding supplier. Check if all fields match Backend requirements.");
            });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // فلترة الموردين (تأكد إن الحقول موجودة في الداتا اللي جاية من الباك)
    const filteredSuppliers = suppliers.filter(sup => 
        (sup.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (sup.contact_person?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="page-content" style={{textAlign: 'center', marginTop: '50px', fontSize: '20px', color: '#853953'}}>Connecting to Database...</div>;

    return (
        <div className="page-content">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #2c3e50', paddingBottom: '10px' }}>
                <h2 style={{margin: 0, color: '#853953'}}>Suppliers Directory</h2>
                <div style={{ color: '#7f8c8d', fontWeight: 'bold' }}>Total: {suppliers.length} Records</div>
            </header>

            {/* فورم إضافة مورد جديد - نفس الاستايل */}
            <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <h3 style={{marginTop: 0, color: '#34495e'}}>Register New Vendor</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <input name="name" placeholder="Company Name" value={formData.name} onChange={handleChange} required style={{padding: '10px', borderRadius: '4px', border: '1px solid #ddd'}} />
                    <input name="contact_person" placeholder="Contact Person" value={formData.contact_person} onChange={handleChange} required style={{padding: '10px', borderRadius: '4px', border: '1px solid #ddd'}} />
                    <input name="email" type="email" placeholder="Business Email" value={formData.email} onChange={handleChange} required style={{padding: '10px', borderRadius: '4px', border: '1px solid #ddd'}} />
                    <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={{padding: '10px', borderRadius: '4px', border: '1px solid #ddd'}} />
                    <input name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} style={{gridColumn: 'span 2', padding: '10px', borderRadius: '4px', border: '1px solid #ddd'}} required />
                    <button type="submit" style={{ background: '#853953', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        + Add Supplier
                    </button>
                </form>
            </section>

            {/* شريط البحث */}
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{fontWeight: 'bold', color: '#2c3e50'}}>Quick Filter:</span>
                <input 
                    type="text" 
                    placeholder="Search by Name or Contact Person..." 
                    style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
            </div>

            {/* الجدول - نفس الـ Class "styled-table" */}
            <table className="styled-table">
                <thead>
                    <tr style={{background: '#853953', color: '#ffffff'}}>
                        <th>Company Name</th>
                        <th>Contact Person</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map(sup => (
                            <tr key={sup.id}>
                                <td><strong>{sup.name}</strong></td>
                                <td>{sup.contact_person}</td>
                                <td>{sup.email}</td>
                                <td>{sup.phone}</td>
                                <td>{sup.address}</td>
                                <td>
                                    <button style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }} title="Delete">🗑️</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999', fontStyle: 'italic' }}>No records found in database.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

>>>>>>> 0f69498e7aae3db51c1316b76db8a4a800ea3b4f
export default Suppliers;