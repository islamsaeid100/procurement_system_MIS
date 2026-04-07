from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Supplier, Product, PurchaseOrder, OrderItem, Invoice

admin.site.register(User, UserAdmin)
admin.site.register(Supplier)
admin.site.register(Product)
admin.site.register(PurchaseOrder)
admin.site.register(Invoice)