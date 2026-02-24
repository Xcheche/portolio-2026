from django.urls import path
from .import views

urlpatterns = [
    path('', views.home, name='home'),
    path('portfolio', views.portfolio, name='portfolio'),
    path('portfolio/', views.portfolio_detail, name='portfolio_detail'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard-v2/', views.dashboard_v2, name='dashboard_v2'),
]