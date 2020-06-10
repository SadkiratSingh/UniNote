from django.shortcuts import render



def viewHomePage(request,*args,**kwargs):
    return render(request,template_name='global/intro.html')