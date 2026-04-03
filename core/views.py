from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated, BasePermission
from .models import User, Supplier, Product, PurchaseOrder, Invoice
from .serializers import UserSerializer, SupplierSerializer, ProductSerializer, PurchaseOrderSerializer, InvoiceSerializer
from django.http import HttpResponse

class IsFinanceOrAdmin(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['finance', 'admin']

class IsRequestingOfficer(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'requesting_officer'

# --- 2. الـ ViewSets ---

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated] 

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer

    def get_permissions(self):

        if self.action == 'create':

            return [IsRequestingOfficer()]
        elif self.action in ['update', 'partial_update']:

            return [IsFinanceOrAdmin()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):

        serializer.save(requesting_officer=self.request.user)

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

def home_view(request):
    return HttpResponse("""
        <h1>Welcome to Procurement System API</h1>
        <p>Go to <a href='/admin/'>Admin Panel</a> to manage data.</p>
        <p>Go to <a href='/api/'>API Root</a> to see JSON data.</p>
    """)