import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    // حقول التاريخ للتقارير المجمعة
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

    // 1. وظيفة البحث المجمع بالفترة الزمنية
    const handleFilter = (e) => {
        e.preventDefault();
        fetchInvoices({ start_date: startDate, end_date: endDate });
    };

    // 2. وظيفة طباعة فاتورة واحدة (بكل التفاصيل)
    const printSingleInvoice = (inv) => {
        // تأكد إن فيه بيانات أصلاً قبل ما تفتح النافذة
        if (!inv.order_details) {
            alert("عفواً، لا توجد تفاصيل لهذا الطلب بعد. تأكد من الموافقة على الأوردر أولاً.");
            return;
        }
    
        const printWindow = window.open('', '_blank');
        
        // تجهيز قائمة المنتجات بأمان
        const itemsHtml = inv.order_details.items ? inv.order_details.items.map(item => `
            <tr>
                <td>${item.product_name || 'N/A'}</td>
                <td>${item.quantity}</td>
                <td>${item.unit_price} EGP</td>
                <td>${(item.quantity * item.unit_price).toFixed(2)} EGP</td>
            </tr>
        `).join('') : '<tr><td colspan="4">No items found</td></tr>';
    
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${inv.invoice_number}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; line-height: 1.6; direction: rtl; }
                        .header { text-align: center; border-bottom: 3px solid #853953; padding-bottom: 10px; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: center; }
                        th { background-color: #f8f9fa; }
                        .footer { text-align: left; margin-top: 30px; font-size: 1.3em; color: #853953; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>فاتورة شراء</h1>
                        <p>رقم الفاتورة: ${inv.invoice_number}</p>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <p><strong>بواسطة الموظف:</strong> ${inv.order_details.requesting_officer_name || 'غير محدد'}</p>
                            <p><strong>رقم الطلب الأصلي:</strong> ${inv.order_number || inv.order}</p>
                        </div>
                        <div style="text-align: left;">
                            <p><strong>المورد:</strong> ${inv.order_details.supplier_name || 'غير محدد'}</p>
                            <p><strong>تاريخ الفاتورة:</strong> ${new Date(inv.issue_date).toLocaleDateString('ar-EG')}</p>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكمية</th>
                                <th>سعر الوحدة</th>
                                <th>الإجمالي الفرعي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    <div class="footer">
                        <strong>الإجمالي الكلي: ${inv.total_amount} EGP</strong>
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); };
                        <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                            }, 500); 
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    // 3. حساب الإجمالي الكلي للتقرير
    const totalSum = invoices.reduce((acc, inv) => acc + parseFloat(inv.total_amount), 0);

    if (loading) return <div className="page-content">Generating Financial Report...</div>;

    return (
        <div className="page-content">
            <header className="no-print" style={{ borderBottom: '2px solid #27ae60', marginBottom: '20px' }}>
                <h2 style={{color: '#27ae60'}}>Financial Invoices & Reporting</h2>
                
                {/* فورم الفلترة المجمعة */}
                <form onSubmit={handleFilter} style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'flex-end' }}>
                    <div>
                        <label style={{display: 'block', fontSize: '12px'}}>From Date:</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label style={{display: 'block', fontSize: '12px'}}>To Date:</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <button type="submit" style={{background: '#27ae60', color: 'white', padding: '6px 15px', border: 'none', borderRadius: '4px'}}>
                        Filter Report
                    </button>
                    <button onClick={() => window.print()} style={{background: '#2c3e50', color: 'white', padding: '6px 15px', border: 'none', borderRadius: '4px'}}>
                        Print Current List 🖨️
                    </button>
                </form>
            </header>

            <div className="printable-area">
                <h3 className="only-print" style={{display: 'none'}}>Invoices Report Summary</h3>
                <table className="styled-table" style={{width: '100%'}}>
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Officer</th>
                            <th>Supplier</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th className="no-print">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv.id}>
                                <td>{inv.invoice_number}</td>
                                <td>{inv.order_details?.requesting_officer_name}</td>
                                <td>{inv.order_details?.supplier_name}</td>
                                <td style={{fontWeight: 'bold', color: '#27ae60'}}>{inv.total_amount} EGP</td>
                                <td>{new Date(inv.issue_date).toLocaleDateString()}</td>
                                <td className="no-print">
                                    <button onClick={() => printSingleInvoice(inv)} style={{cursor: 'pointer', background: '#e67e22', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px'}}>
                                        Print Invoice 📄
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={{background: '#f9f9f9', fontWeight: 'bold'}}>
                            <td colSpan="3" style={{textAlign: 'right'}}>Report Total:</td>
                            <td style={{color: '#27ae60'}}>{totalSum.toFixed(2)} EGP</td>
                            <td colSpan="2"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <style>
                {`
                @media print {
                    .no-print { display: none !important; }
                    .only-print { display: block !important; text-align: center; }
                    body { background: white; }
                    table { border: 1px solid #ddd; }
                }
                `}
            </style>
        </div>
    );
};

export default Invoices;