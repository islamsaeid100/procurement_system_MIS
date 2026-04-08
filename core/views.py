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

# --- 1. الصلاحيات (Permissions) ---

class IsFinanceOrAdmin(BasePermission):
    def has_permission(self, request, view):
        # التحقق من أن المستخدم مسجل وله دور 'finance' أو 'admin'
        return request.user.is_authenticated and request.user.role in ['finance', 'admin']

class IsRequestingOfficer(BasePermission):
    def has_permission(self, request, view):
        # التحقق من أن المستخدم هو 'requesting_officer'
        return request.user.is_authenticated and request.user.role == 'requesting_officer'

# --- 2. الـ ViewSets ---

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
        # السماح بإنشاء الطلبات لجميع المسجلين (للتسهيل) أو قصرها على الموظف المختص
        if self.action == 'create':
            return [IsAuthenticated()] 
        # التعديل والموافقة محصورة على الإدارة المالية والآدمن
        elif self.action in ['update', 'partial_update', 'approve']:
            return [IsFinanceOrAdmin()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # توليد رقم طلب فريد يبدأ بـ PO
        random_no = f"PO-{uuid.uuid4().hex[:6].upper()}"
        
        # حفظ الطلب مع ربطه بالمستخدم الحالي الذي قام بالطلب
        # ملاحظة: السيريالايزر سيتولى إنشاء العناصر (Items) وحساب الإجمالي
        serializer.save(
            requesting_officer=self.request.user, 
            order_number=random_no
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        # دالة الموافقة وتحويل الطلب لفاتورة
        order = self.get_object()
        
        if order.status == 'approved':
            return Response({'error': 'This order is already approved.'}, status=400)
            
        order.status = 'approved'
        order.save()
        
        # إنشاء الفاتورة تلقائياً بناءً على بيانات الطلب الموافق عليه
        Invoice.objects.get_or_create(
            order=order,
            defaults={
                'invoice_number': f"INV-{order.order_number}",
                'due_date': '2026-12-31', # تاريخ استحقاق افتراضي
                'total_amount': order.total_amount,
                'is_paid': False
            }
        )
        return Response({'status': 'Order approved and invoice generated successfully.'})

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # إمكانية تصفية الفواتير بناءً على التاريخ لاستخراج التقارير المجمعة
        queryset = Invoice.objects.all()
        start = self.request.query_params.get('start_date')
        end = self.request.query_params.get('end_date')
        if start and end:
            queryset = queryset.filter(issue_date__range=[start, end])
        return queryset

# --- 3. التسجيل والصفحة الرئيسية ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

def home_view(request):
    # صفحة بسيطة للتأكد من عمل السيرفر
    return HttpResponse("""
        <div style="text-align:center; padding:50px; font-family:sans-serif;">
            <h1 style="color:#853953;">Procurement Management System API</h1>
            <p>Status: <span style="color:green;">Online</span></p>
        </div>
    """)