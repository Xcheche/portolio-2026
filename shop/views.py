from django.shortcuts import render

# Create your views here.


#------------------- Shop Page-------------------
def shop(request):
    return render(request, 'shop/shop.html')

#shoppage    