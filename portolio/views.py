from django.shortcuts import get_object_or_404, redirect, render
from django.db import transaction

from portolio.models.portfolio import Portfolio
from portolio.models.category import Category
from django.core.paginator import Paginator

# Create your views here.

#-------------------Home Page-------------------
def home(request):
    all_portfolios = Portfolio.objects.published()[::2] # Fetch only published portfolios

    context = {
        'all_portfolios': all_portfolios
    }
    return render(request, 'portfolio/index.html', context)


#-------------------Portfolio Page-------------------
def portfolio(request):
    slug = request.GET.get("category", "").strip()

    categories = Category.objects.exclude(slug__in=[None, ""]).order_by("name")
    portfolios = Portfolio.objects.published().select_related("category")
    portfolio_count = portfolios.count()    

    if slug:
        portfolios = portfolios.filter(category__slug=slug)

    page_obj = Paginator(portfolios, 2).get_page(request.GET.get("page"))

    return render(request, "portfolio/portfolio.html", {
        "all_category": categories,
        "selected_category_slug": slug,
        "page_obj": page_obj,
        "portfolios": page_obj,  # access .object_list in template
        "portfolio_count": portfolio_count,
    })

    





#--------------Portfolio Detail Page-------------------

def portfolio_detail(request,slug):
    portfolio = get_object_or_404(Portfolio, slug=slug,status='Published')
    context = {
        'portfolio': portfolio
    }
    return render(request, 'portfolio/portfolio-detail.html', context)


#-------------------Dashboard Pages-------------------
def dashboard(request):
    return render(request, 'dashboard/dashboard.html')


def dashboard_v2(request):
    return render(request, 'dashboard/dashboard-v2.html')



#----------------------------Crud---------------------------
#----------------Delete Portfolio-------------------
def delete_portfolio(request, portfolio_id):
    portfolio = get_object_or_404(Portfolio, id=portfolio_id)

    if request.method == 'POST':
        with transaction.atomic():
            portfolio.delete()
        return redirect('home')

    return render(request, 'portfolio/confirm_delete.html', {'portfolio': portfolio})