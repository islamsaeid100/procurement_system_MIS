import React from 'react';
import '../styles/Print.css';

const InvoiceDetail = ({ invoice }) => {
    const handlePrint = () => {
        window.print(); // هذا الأمر يفتح نافذة الطباعة الخاصة بالمتصفح
    };

    return (
        <div className="print-container">
            <button className="btn-print" onClick={handlePrint}>طباعة الفاتورة</button>
            
            <div className="invoice-box">
                <h1 style={{color: '#853953'}}>Procurement Invoice</h1>
                <hr />
                
                {/* بيانات الفاتورة الأساسية */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <p><strong>رقم الفاتورة:</strong> {invoice.invoice_number}</p>
                        <p><strong>التاريخ:</strong> {invoice.issue_date}</p>
                        <p><strong>اليوزر اللي طلب (الموظف):</strong> {invoice.order_details.requesting_officer_name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p><strong>المورد:</strong> {invoice.order_details.supplier_name}</p>
                        <p><strong>حالة الطلب:</strong> {invoice.order_details.status}</p>
                    </div>
                </div>

                {/* جدول المنتجات بالتفصيل */}
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>الكمية</th>
                            <th>سعر الوحدة</th>
                            <th>الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.order_details.items.map(item => (
                            <tr key={item.id}>
                                <td>{item.product_name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit_price} EGP</td>
                                <td>{item.quantity * item.unit_price} EGP</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" style={{textAlign: 'right'}}><strong>الإجمالي الكلي:</strong></td>
                            <td><strong>{invoice.total_amount} EGP</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};