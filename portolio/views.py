from django.shortcuts import get_object_or_404, redirect, render
from django.db import transaction

from portolio.models.portfolio import Portfolio
from django.core.paginator import Paginator

# Create your views here.

#-------------------Home Page-------------------
def home(request):
    all_portfolios = Portfolio.objects.published()  # Fetch only published portfolios

    context = {
        'all_portfolios': all_portfolios
    }
    return render(request, 'portfolio/index.html', context)


#-------------------Portfolio Page-------------------
def portfolio(request):
    portfolios= Portfolio.objects.published()  # Fetch only published portfolios
    paginator = Paginator(portfolios, 1)

    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    context ={
        'page_obj': page_obj
    }
    return render(request, 'portfolio/portfolio.html', context)




#-------------------Portfolio Category-------------------



#--------------Portfolio Detail Page-------------------

def portfolio_detail(request):
    return render(request, 'portfolio/portfolio-detail.html')


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