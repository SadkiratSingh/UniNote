from django.shortcuts import render
from django.views.generic.base import View
from .models import Semester,Course,PdfFiles,Chapter
from django.http import HttpResponse,JsonResponse,QueryDict,HttpResponseRedirect
import re
import io,zipfile,os
from django.contrib.auth.mixins import AccessMixin
from urllib.parse import urlparse,urlunparse
# Create your views here.

class LoginCheck(AccessMixin):
    def get_redirect_url(self):
        ### get all params to generate redirect url ###
        path='/'+self.request.get_full_path().split('/')[1]+'/'
        redirect_field=self.get_redirect_field_name()
        login_url=self.get_login_url()
        ### get all params to generate redirect url ###
        
        ##generate redirect_url##
        parse_list=list(urlparse(login_url))
        empty_query=parse_list[4]
        query_obj=QueryDict(empty_query,mutable=True)
        query_obj[redirect_field]=path
        query_string=query_obj.urlencode(safe='/')
        parse_list[4]=query_string
        redirect_url=urlunparse(parse_list)
        return redirect_url
        ##generate redirect_url##

    def dispatch(self,request,*args,**kwargs):
        if(not request.user.is_authenticated):
            url=self.get_redirect_url()
            return HttpResponseRedirect(url)
        else:
            return super().dispatch(request,*args,**kwargs)

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

class ReturnChapters(View):
    def get(self,request,*args,**kwargs):
        course_id=request.GET.get('course')
        term=request.GET.get('term')
        all_related_chapters=list(Chapter.objects.filter(term=term,rel_course__cource_code=course_id))
        data_list=[]
        for obj in all_related_chapters:
            chapters_data={}
            chapters_data['ch_name']=obj.name
            #get url for pdfimage#
            chapters_data['img_url']=obj.image.url
            #get url for pdfimage#
            chapters_data['term']=term
            data_list.append(chapters_data)

        #sort data list acc to chapter name#
        data_list=sorted(data_list,key=lambda x:x['ch_name'])
        response=JsonResponse({'data':data_list})
        return response

class DownloadZip(LoginCheck,View):
    def get(self,request,*args,**kwargs):
        temp=io.BytesIO()
        chapter_name=kwargs['name']
        file_objects=PdfFiles.objects.filter(rel_chapter__name=chapter_name)
        archive=zipfile.ZipFile(temp,'w')
        for f in file_objects:
            abs_path=f.files.path
            base_name=os.path.basename(abs_path)
            archive.write(abs_path,base_name)
        archive.close()
        response=HttpResponse(temp.getvalue(),content_type='application/zip')
        response['content-disposition']=f'attachment; filename="{chapter_name}.zip"'
        return response