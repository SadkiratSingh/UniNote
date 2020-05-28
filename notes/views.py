from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse

# Create your views here.

class HomePageView(View):
    def get(self,request,*args,**kwargs):
        return HttpResponse('Welcome to notes app!!')
