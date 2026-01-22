def cart_count(request):
    """Add cart count to all templates"""
    cart_count = 0
    if 'cart' in request.session:
        cart_count = len(request.session['cart'])
    return {'cart_count': cart_count}