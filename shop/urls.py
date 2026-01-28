from django.urls import path
from .views import (
    Custom404View,
    HomePageView,
    # InfoPageView,
    ProductListView,
    ProductDetailView,
    # SpecificationsPageView,
    AboutPageView,
    ConnectPageView,
)

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    # path('info/', InfoPageView.as_view(), name='info'),
    # path('specifications/', SpecificationsPageView.as_view(), name='specifications'),
    path('about/', AboutPageView.as_view(), name='about'),
    path('connect/', ConnectPageView.as_view(), name='connect'),
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),
    path('error/', Custom404View.as_view(), name='error'),
    
    
]