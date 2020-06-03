from django.shortcuts import render
from django.views.generic.base import View
from .models import Semester,Course,PdfFiles
from django.http import HttpResponse,JsonResponse,QueryDict
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
            return JsonResponse({'login_url':url})
        else:
            return super().dispatch(request,*args,**kwargs)

class HomePageView(View):
    def get(self,request,*args,**kwargs):
        all_sems_set=Semester.objects.all()
        semesters=list(all_sems_set)
        response=render(request,template_name='notes/home.html',context={'semesters':semesters})
        return response

class ReturnSemesterCourses(LoginCheck,View):
    def get(self,request,*args,**kwargs):
        required_sem=self.kwargs['semester']
        req_sem_obj=Semester.objects.get(semester=required_sem)
        req_sem_courses=list(req_sem_obj.course_set.all())
        courses=[]
        for i in range(len(req_sem_courses)):
             courses.append((req_sem_courses[i].cource_code,req_sem_courses[i].course))
        response=JsonResponse({'courses':courses})
        return response

class ReturnFiles(View):
    def get(self,request,*args,**kwargs):
        course_id=request.GET.get('course')
        term=request.GET.get('term')
        all_required_files_data=list(PdfFiles.objects.filter(term=term,cource_code__cource_code=course_id))
        file_ext_pat='\.pdf$'
        data_list=[]
        for obj in all_required_files_data:
            files_data={}
            #get url for pdfimage#
            files_data['img_url']=obj.image.url
            #get url for pdfimage#

            #get pdf name shortened#
            pdf_name=obj.files.name
            pdf_name=re.sub('notes/pdfs/','',pdf_name)
            pdf_name=re.sub(file_ext_pat,'',pdf_name)
            pdf_name1=re.sub('-',' ',pdf_name)
            pdf_name2=re.sub('-','',pdf_name)
            files_data['file_name']=pdf_name1
            files_data['file_name_alt']=pdf_name2
            files_data['org_file_name']=pdf_name
            #get pdf name shortened#

            files_data['term']=term
            data_list.append(files_data)

        #sort data list acc to pdf name#
        data_list=sorted(data_list,key=lambda x:x['file_name'])
        
        response=JsonResponse({'data':data_list})

        return response

class DownloadPdf(View):
    def get(self,request,*args,**kwargs):
        temp=io.BytesIO()
        name_of_file=kwargs['name']
        name_of_file_f=re.sub('-',' ',name_of_file)
        file_obj=PdfFiles.objects.filter(files__contains=name_of_file)[0]
        abs_path=file_obj.files.path
        archive=zipfile.ZipFile(temp,'w')
        base_name=os.path.basename(abs_path)
        archive.write(abs_path,base_name)
        archive.close()
        response=HttpResponse(temp.getvalue(),content_type='application/zip')
        response['content-disposition']=f'attachment; filename="{name_of_file_f}.zip"'
        return response