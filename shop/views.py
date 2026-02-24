from django.shortcuts import render, redirect

# Create your views here.


#------------------- Shop Page-------------------
def shop(request):
    return render(request, 'shop/shop.html')


#------------------- Product Detail Page-------------------
def product_detail(request):
    return render(request, 'shop/shop-detail.html')


#------------------- Cart Page-------------------
def cart(request):
    return render(request, 'shop/cart.html')


#------------------- Shipping Page-------------------
def shipping(request):
    return render(request, 'shop/shipping.html')


#------------------- Checkout Page-------------------
def checkout(request):
    return render(request, 'shop/checkout.html')    