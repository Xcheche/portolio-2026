from django.urls import path
from .import views


urlpatterns = [
    path('shop/', views.shop, name='shop'),
    path('shop-detail/', views.product_detail, name='product_detail'),
    path('cart/', views.cart, name='cart'),
    path('shipping/', views.shipping, name='shipping'),
    path('checkout/', views.checkout, name='checkout'),
]