from django.shortcuts import render
from django.views.generic.base import View
from .models import Semester,Course
from django.http import HttpResponse,JsonResponse

# Create your views here.

class HomePageView(View):
    def get(self,request,*args,**kwargs):
        all_sems_set=Semester.objects.all()
        semesters=list(all_sems_set)
        response=render(request,template_name='notes/home.html',context={'semesters':semesters})
        return response

class ReturnSemesterCourses(View):
    def get(self,request,*args,**kwargs):
        required_sem=self.kwargs['semester']
        req_sem_obj=Semester.objects.get(semester=required_sem)
        req_sem_courses=list(req_sem_obj.course_set.all())
        courses=[]
        for i in range(len(req_sem_courses)):
             courses.append((req_sem_courses[i].cource_code,req_sem_courses[i].course))
        response=JsonResponse({'courses':courses})
        return response

    
