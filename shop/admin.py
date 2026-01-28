from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'rating', 'review_count', 'is_featured', 'created_at')
    list_filter = ('category', 'is_featured', 'rating')
    search_fields = ('name', 'short_description', 'full_description')
    list_editable = ('rating', 'is_featured')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'category', 'main_image')
        }),
        ('Descriptions', {
            'fields': ('short_description', 'full_description', 'specifications')
        }),
        ('Rating & Status', {
            'fields': ('rating', 'review_count', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    prepopulated_fields = {'slug': ('name',)}  # অটো স্লাগ তৈরি হবে