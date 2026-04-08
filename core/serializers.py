from rest_framework import serializers
from .models import User, Supplier, Product, PurchaseOrder, OrderItem, Invoice
from django.contrib.auth import get_user_model

User = get_user_model()

# 1. اليوزر
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

# 2. المورد
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

# 3. المنتجات
class ProductSerializer(serializers.ModelSerializer):
    supplier_name = serializers.ReadOnlyField(source='supplier.name')
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'unit_price', 'stock_quantity', 'supplier', 'supplier_name']

# 4. الأصناف داخل الطلب (هنا التعديل عشان الـ unit_price ميبقاش مطلوب)
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    # جعلنا السعر غير مطلوب في الـ POST لأنه سيُسحب من المنتج تلقائياً
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price']

# 5. تفاصيل الطلب
class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True) # يسمح بإرسال المنتجات مع الأوردر
    requesting_officer_name = serializers.ReadOnlyField(source='requesting_officer.username')
    supplier_name = serializers.ReadOnlyField(source='supplier.name')

    class Meta:
        model = PurchaseOrder
        fields = [
            'id', 'order_number', 'requesting_officer', 'requesting_officer_name', 
            'supplier', 'supplier_name', 'total_amount', 'status', 'items', 'created_at'
        ]
        read_only_fields = ['order_number', 'requesting_officer', 'total_amount', 'status']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        # إنشاء الأوردر
        order = PurchaseOrder.objects.create(**validated_data)
        total = 0
        
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            # سحب السعر الفعلي من بيانات المنتج في الداتابيز
            price = product.unit_price
            
            OrderItem.objects.create(
                order=order, 
                product=product, 
                quantity=quantity, 
                unit_price=price
            )
            total += (price * quantity)
        
        # تحديث الإجمالي الكلي للأوردر
        order.total_amount = total
        order.save()
        return order

# 6. الفاتورة
class InvoiceSerializer(serializers.ModelSerializer):
    order_details = PurchaseOrderSerializer(source='order', read_only=True)
    order_number = serializers.ReadOnlyField(source='order.order_number')
    class Meta:
        model = Invoice
        fields = ['id', 'order', 'order_number', 'invoice_number', 'issue_date', 'due_date', 'is_paid', 'total_amount', 'order_details']

# 7. التسجيل
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 'role')
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user