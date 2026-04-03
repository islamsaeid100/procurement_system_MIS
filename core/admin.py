from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Supplier, Product, PurchaseOrder, OrderItem, Invoice

admin.site.register(User, UserAdmin)

admin.site.register(Supplier)
admin.site.register(Product)

admin.site.register(Invoice)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'requesting_officer', 'supplier', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'supplier')
    inlines = [OrderItemInline] 