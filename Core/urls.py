from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # সব পেজ shop অ্যাপের মাধ্যমে চলবে
    path('', include('shop.urls')),   # ← এটা দিয়েই সব চলবে
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


# handler404 = 'shop.views.custom_404'   ← এটা যোগ করো (আমরা এখন বানাবো)
# handler404 = 'shop.views.Custom404View.as_view()'