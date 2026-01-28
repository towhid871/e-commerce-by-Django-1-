from django.views.generic.base import TemplateView
from django.views.generic import ListView, DetailView
from .models import Product

class HomePageView(TemplateView):
    template_name = 'home.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Home - Voxio'
        context['page'] = 'home'
        context['featured_product'] = Product.objects.filter(is_featured=True).first()  # প্রথম ফিচার্ড প্রোডাক্ট
        context['latest_products'] = Product.objects.all().order_by('-created_at')[:4]  # সর্বশেষ ৪টি প্রোডাক্ট
        return context

class InfoPageView(TemplateView):
    template_name = 'info.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Info - Voxio'
        context['page'] = 'info'
        return context

class SpecificationsPageView(TemplateView):
    template_name = 'specifications.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Specifications - Voxio'
        context['page'] = 'specifications'
        return context

class AboutPageView(TemplateView):
    template_name = 'about.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'About - Voxio'
        context['page'] = 'about'
        return context

class ConnectPageView(TemplateView):
    template_name = 'connect.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Connect - Voxio'
        context['page'] = 'connect'
        return context
    







class ProductListView(ListView):
    model = Product
    template_name = 'product_list.html'  # নতুন টেমপ্লেট বানাবে
    context_object_name = 'products'
    ordering = ['-created_at']



class ProductDetailView(DetailView):
    model = Product
    template_name = 'product_detail.html'  # নতুন টেমপ্লেট বানাবে
    context_object_name = 'product'
    slug_field = 'slug'          # URL-এ slug দিয়ে খুঁজবে
    slug_url_kwarg = 'slug'      # URL-এ <slug:slug> থাকবে

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f"{self.object.name} - Voxio"
        context['page'] = 'product_detail'

        
        return context
    
    

from django.http import HttpResponseNotFound

class Custom404View(TemplateView):
    template_name = 'error.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # যদি চাও extra কনটেক্সট পাঠাতে পারো
        context['error_message'] = "Page under construction or not found"
        context['title'] = "404 - Not Found"
        return context
    
    def get(self, request, *args, **kwargs):
        # 404 স্ট্যাটাস সেট করা
        response = super().get(request, *args, **kwargs)
        response.status_code = 404
        return response