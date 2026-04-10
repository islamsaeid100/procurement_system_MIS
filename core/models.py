from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('procurement_manager', 'Procurement Manager'),
        ('requesting_officer', 'Requesting Officer'),
        ('finance', 'Finance/Accountant'),
        ('warehouse', 'Warehouse Keeper'),
        ('admin', 'System Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='requesting_officer')

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='products')

    def __str__(self):
        return self.name
    
class PurchaseOrder(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('approved', 'Approved by Finance'),
        ('rejected', 'Rejected'),
        ('delivered', 'Delivered/Received'),
    )
    order_number = models.CharField(max_length=50, unique=True)
    requesting_officer = models.ForeignKey(User, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.order_number

# ده الجدول اللي كان ناقص ومسبب الـ Error
class OrderItem(models.Model):
    order = models.ForeignKey(PurchaseOrder, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

class Invoice(models.Model):
    order = models.OneToOneField(PurchaseOrder, on_delete=models.CASCADE, related_name='invoice')
    invoice_number = models.CharField(max_length=50, unique=True)
    issue_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    is_paid = models.BooleanField(default=False)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    # backend/models.py (مثال)

class StockMovement(models.Model):
    MOVEMENT_TYPES = (
        ('IN', 'إضافة للمخزن'),
        ('OUT', 'صرف من المخزن'),
    )
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='movements')
    quantity = models.PositiveIntegerField()
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_TYPES)
    notes = models.TextField(blank=True, null=True) # مثلاً: صرف لمشروع كذا
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # السحر هنا: تحديث استوك المنتج أوتوماتيك عند الحفظ
        product = self.product
        if self.movement_type == 'OUT':
            if product.stock_quantity >= self.quantity:
                product.stock_quantity -= self.quantity
            else:
                raise ValueError("الكمية المطلوبة أكبر من المتاحة في المخزن!")
        else:
            product.stock_quantity += self.quantity
        
        product.save()
        super().save(*args, **kwargs)