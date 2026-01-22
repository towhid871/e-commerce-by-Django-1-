from django.shortcuts import render
from .models import Product

from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
import json

import random
import string
from datetime import datetime
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Product, Order, OrderItem

def home(request):
    featured_products = Product.objects.all()[:4]
    context = {
        'featured_products': featured_products,
    }
    return render(request, 'home.html', context)

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def shop(request):
    products = Product.objects.all()
    context = {
        'products': products,
    }
    return render(request, 'shop.html', context)


def shop(request):
    products = Product.objects.all()
    
    # Get unique categories
    categories = Product.objects.values_list('category', flat=True).distinct()
    
    context = {
        'products': products,
        'categories': categories,
    }
    return render(request, 'shop.html', context)















def cart(request):
    cart_items = []
    cart_total = 0
    total_items = 0
    
    # Get cart from localStorage via AJAX or initialize empty
    # For server-side rendering, we'll show empty initially
    # JavaScript will populate it
    
    # Calculate totals
    cart_data = request.GET.get('cart', '[]')
    try:
        cart_items = json.loads(cart_data)
        for item in cart_items:
            try:
                product = Product.objects.get(id=int(item['id']))
                item_price = float(product.price) * int(item['quantity'])
                cart_total += item_price
                total_items += int(item['quantity'])
                
                # Add product details to cart item
                item['name'] = product.name
                item['price'] = str(product.price)
                item['image'] = product.image.url if product.image else ''
                item['category'] = product.category
            except (Product.DoesNotExist, ValueError):
                continue
    except json.JSONDecodeError:
        cart_items = []
    
    # Calculate shipping
    shipping = 0 if cart_total >= 2000 else 100
    
    # Discount calculation (example: 10% off above 3000)
    discount_amount = 0
    if cart_total > 3000:
        discount_amount = cart_total * 0.1  # 10% discount
    
    cart_grand_total = cart_total + shipping - discount_amount
    
    # Get featured products for empty cart
    featured_products = Product.objects.all()[:3]
    
    context = {
        'cart_items': cart_items,
        'cart_total': round(cart_total, 2),
        'total_items': total_items,
        'shipping': shipping,
        'discount_amount': round(discount_amount, 2),
        'cart_grand_total': round(cart_grand_total, 2),
        'featured_products': featured_products,
    }
    
    return render(request, 'cart.html', context)

def update_cart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            cart_data = data.get('cart', [])
            
            # Validate cart data
            validated_cart = []
            for item in cart_data:
                if 'id' in item and 'quantity' in item:
                    try:
                        product_id = int(item['id'])
                        quantity = int(item['quantity'])
                        
                        if quantity > 0:
                            validated_cart.append({
                                'id': product_id,
                                'quantity': quantity
                            })
                    except (ValueError, TypeError):
                        continue
            
            # You could save to session here if needed
            # request.session['cart'] = validated_cart
            
            return JsonResponse({
                'success': True,
                'cart': validated_cart
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })














def checkout(request):
    cart_items = []
    cart_total = 0
    total_items = 0
    
    # Get cart from session or initialize
    cart_data = request.GET.get('cart', '[]')
    try:
        cart_items = json.loads(cart_data)
        for item in cart_items:
            try:
                product = Product.objects.get(id=int(item['id']))
                item_price = float(product.price) * int(item['quantity'])
                cart_total += item_price
                total_items += int(item['quantity'])
                
                # Add product details
                item['name'] = product.name
                item['price'] = str(product.price)
                item['image'] = product.image.url if product.image else ''
                item['category'] = product.category
            except (Product.DoesNotExist, ValueError):
                continue
    except json.JSONDecodeError:
        cart_items = []
    
    # Calculate totals
    shipping = 0 if cart_total >= 2000 else 100
    discount_amount = cart_total * 0.1 if cart_total > 3000 else 0
    cart_grand_total = cart_total + shipping - discount_amount
    
    # Generate random order ID for display
    random_order_id = generate_order_id()
    
    if request.method == 'POST':
        # Process checkout form
        return process_checkout(request, cart_items, cart_grand_total)
    
    context = {
        'cart_items': cart_items,
        'cart_total': round(cart_total, 2),
        'total_items': total_items,
        'shipping': shipping,
        'discount_amount': round(discount_amount, 2),
        'cart_grand_total': round(cart_grand_total, 2),
        'random_order_id': random_order_id,
    }
    
    return render(request, 'checkout.html', context)

def process_checkout(request, cart_items, total_amount):
    if request.method == 'POST':
        try:
            # Get form data
            full_name = request.POST.get('full_name', '').strip()
            phone_number = request.POST.get('phone_number', '').strip()
            email = request.POST.get('email', '').strip()
            address = request.POST.get('address', '').strip()
            city = request.POST.get('city', '').strip()
            area = request.POST.get('area', '').strip()
            order_notes = request.POST.get('order_notes', '').strip()
            
            # Validate required fields
            if not all([full_name, phone_number, address, city]):
                return JsonResponse({
                    'success': False,
                    'error': 'Please fill all required fields'
                })
            
            # Generate unique order ID
            order_id = generate_order_id()
            
            # Create order
            order = Order.objects.create(
                order_id=order_id,
                customer_name=full_name,
                customer_phone=phone_number,
                customer_email=email if email else None,
                customer_address=f"{address}\n{area}" if area else address,
                city=city,
                order_notes=order_notes,
                total_amount=total_amount,
                status='pending'
            )
            
            # Add order items
            for item in cart_items:
                try:
                    product = Product.objects.get(id=int(item['id']))
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=int(item['quantity']),
                        price=float(product.price)
                    )
                except (Product.DoesNotExist, ValueError):
                    continue
            
            # Clear cart after successful order
            # You can clear localStorage via JavaScript
            
            return JsonResponse({
                'success': True,
                'order_id': order_id,
                'customer_name': full_name,
                'phone_number': phone_number,
                'total_amount': total_amount
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

def generate_order_id():
    """Generate unique order ID"""
    timestamp = datetime.now().strftime('%Y%m%d')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{timestamp}-{random_str}"

@csrf_exempt
def process_checkout_ajax(request):
    """AJAX endpoint for checkout processing"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get cart data and form data
            cart_items = data.get('cart', [])
            form_data = data.get('form_data', {})
            
            # Validate
            if not cart_items:
                return JsonResponse({
                    'success': False,
                    'error': 'Cart is empty'
                })
            
            # Process order (similar to process_checkout)
            # ... order creation logic ...
            
            return JsonResponse({
                'success': True,
                'order_id': generate_order_id(),
                'message': 'Order placed successfully!'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid data'
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request'
    })

















def cart(request):
    cart_items = []
    cart_total = 0
    total_items = 0
    
    # Get cart from localStorage (via AJAX) or from session
    cart_data_json = request.GET.get('cart', '[]')
    
    try:
        cart_data = json.loads(cart_data_json)
        
        for item in cart_data:
            try:
                product = Product.objects.get(id=int(item['id']))
                quantity = int(item['quantity'])
                item_price = float(product.price) * quantity
                
                cart_total += item_price
                total_items += quantity
                
                # Prepare cart item with full product details
                cart_item = {
                    'id': product.id,
                    'name': product.name,
                    'price': float(product.price),
                    'quantity': quantity,
                    'image': product.image.url if product.image else '',
                    'category': product.category,
                    'total': item_price
                }
                cart_items.append(cart_item)
                
            except (Product.DoesNotExist, ValueError, KeyError) as e:
                print(f"Error loading product {item.get('id')}: {e}")
                continue
                
    except json.JSONDecodeError:
        cart_items = []
        print("Cart JSON decode error")
    
    # Calculate shipping
    shipping = 0 if cart_total >= 2000 else 100
    
    # Discount calculation
    discount_amount = cart_total * 0.1 if cart_total > 3000 else 0
    
    cart_grand_total = cart_total + shipping - discount_amount
    
    # Get featured products for empty cart
    featured_products = Product.objects.all()[:3]
    
    context = {
        'cart_items': cart_items,
        'cart_total': round(cart_total, 2),
        'total_items': total_items,
        'shipping': shipping,
        'discount_amount': round(discount_amount, 2),
        'cart_grand_total': round(cart_grand_total, 2),
        'featured_products': featured_products,
    }
    
    return render(request, 'cart.html', context)









def get_product_details(request, product_id):
    """Get product details for cart"""
    try:
        product = Product.objects.get(id=product_id)
        return JsonResponse({
            'id': product.id,
            'name': product.name,
            'price': str(product.price),
            'image': product.image.url if product.image else '',
            'category': product.category,
            'stock': product.stock
        })
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)