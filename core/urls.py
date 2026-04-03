from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SupplierViewSet, ProductViewSet, PurchaseOrderViewSet, InvoiceViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', PurchaseOrderViewSet)
router.register(r'invoices', InvoiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]