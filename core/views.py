import uuid
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.http import HttpResponse

from .models import User, Supplier, Product, PurchaseOrder, Invoice
from .serializers import (
    UserSerializer, SupplierSerializer, ProductSerializer, 
    PurchaseOrderSerializer, InvoiceSerializer, RegisterSerializer
)

class IsFinanceOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['finance', 'admin']

class IsRequestingOfficer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'requesting_officer'

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
            return [IsAuthenticated()] # سمحنا بالإنشاء لكل المسجلين مؤقتاً للتجربة
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # توليد رقم طلب فريد وربط اليوزر
        random_no = f"PO-{uuid.uuid4().hex[:6].upper()}"
        serializer.save(requesting_officer=self.request.user, order_number=random_no)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        order = self.get_object()
        order.status = 'approved'
        order.save()
        
        Invoice.objects.get_or_create(
            order=order,
            defaults={
                'invoice_number': f"INV-{order.order_number}",
                'due_date': '2026-12-31',
                'total_amount': order.total_amount
            }
        )
        return Response({'status': 'Approved'})

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Invoice.objects.all()
        start = self.request.query_params.get('start_date')
        end = self.request.query_params.get('end_date')
        if start and end:
            queryset = queryset.filter(issue_date__range=[start, end])
        return queryset

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

def home_view(request):
    return HttpResponse("<h1>API Is Running Correctly</h1>")