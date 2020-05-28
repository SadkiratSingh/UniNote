from django.shortcuts import render
from django.views.generic.base import View
from .models import Semester
from django.http import HttpResponse

# Create your views here.

class HomePageView(View):
    def get(self,request,*args,**kwargs):
        all_sems_set=Semester.objects.all()
        semesters=list(all_sems_set)
        response=render(request,template_name='notes/home.html',context={'semesters':semesters})
        return response

    
