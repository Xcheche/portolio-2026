from django.shortcuts import render

# Create your views here.


#------------------Contact Page-------------------
def contact(request):
    return render(request, 'contact/contact.html')