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