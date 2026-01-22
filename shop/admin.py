from django.contrib import admin
from .models import Product, Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'customer_name', 'customer_phone', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_id', 'customer_name', 'customer_phone']
    inlines = [OrderItemInline]
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_id', 'total_amount', 'status', 'created_at')
        }),
        ('Customer Information', {
            'fields': ('customer_name', 'customer_phone', 'customer_email', 'customer_address', 'city')
        }),
        ('Notes', {
            'fields': ('order_notes', 'admin_notes'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'stock']
    list_filter = ['category']
    search_fields = ['name', 'description']
    
admin.site.register(OrderItem)