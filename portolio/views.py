from django.shortcuts import render

# Create your views here.

#-------------------Home Page-------------------
def home(request):
    return render(request, 'portfolio/index.html')


#-------------------Portfolio Page-------------------
def portfolio(request):
    return render(request, 'portfolio/portfolio.html')




#-------------------Portfolio Category-------------------



#--------------Portfolio Detail Page-------------------

def portfolio_detail(request):
    return render(request, 'portfolio/portfolio-detail.html')


#-------------------Dashboard Pages-------------------
def dashboard(request):
    return render(request, 'dashboard/dashboard.html')


def dashboard_v2(request):
    return render(request, 'dashboard/dashboard-v2.html')