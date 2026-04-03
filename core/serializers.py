from rest_framework import serializers
from .models import User, Supplier, Product, PurchaseOrder, OrderItem, Invoice

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    supplier_name = serializers.ReadOnlyField(source='supplier.name')

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'unit_price', 'stock_quantity', 'supplier', 'supplier_name']

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price']

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    requesting_officer_name = serializers.ReadOnlyField(source='requesting_officer.username')
    supplier_name = serializers.ReadOnlyField(source='supplier.name')

    class Meta:
        model = PurchaseOrder
        fields = ['id', 'order_number', 'requesting_officer', 'requesting_officer_name', 
                  'supplier', 'supplier_name', 'total_amount', 'status', 'items', 'created_at']
        
class InvoiceSerializer(serializers.ModelSerializer):
    order_number = serializers.ReadOnlyField(source='order.order_number')

    class Meta:
        model = Invoice
        fields = ['id', 'order', 'order_number', 'invoice_number', 'issue_date', 'due_date', 'total_amount', 'is_paid']