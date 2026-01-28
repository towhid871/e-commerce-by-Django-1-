from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name="Product Name")
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)  # URL-এর জন্য (অপশনাল)
    
    # ছবি (একাধিক ছবি রাখতে চাইলে পরে Gallery মডেল যোগ করা যাবে)
    main_image = models.ImageField(upload_to='media/products/', verbose_name="Main Image", null=True, blank=True)
    
    # ডেসক্রিপশন
    short_description = models.TextField(verbose_name="Short Description", blank=True)
    full_description = models.TextField(verbose_name="Full Description", blank=True)
    
    # স্পেসিফিকেশন (একটা বড় টেক্সট ফিল্ডে সব লিখে দাও, পরে টেবিল করা যাবে)
    specifications = models.TextField(verbose_name="Specifications", blank=True)
    
    # রেটিং
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0, verbose_name="Rating")
    review_count = models.PositiveIntegerField(default=0, verbose_name="Number of Reviews")
    
    # অতিরিক্ত ইনফো
    category = models.CharField(max_length=100, blank=True, verbose_name="Category (e.g. Headphones)")
    is_featured = models.BooleanField(default=False, verbose_name="Featured Product?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ['-created_at']

    def __str__(self):
        return self.name