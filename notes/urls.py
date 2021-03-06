from django.urls import path
from . import views

# Create your views here.

urlpatterns=[
    path('',views.HomePageView.as_view(),name='notes-home'),
    path('getsemcourses/<semester>/',views.ReturnSemesterCourses.as_view(),name='notes-sem-courses'),
    path('getnotes/',views.ReturnChapters.as_view(),name='notes-return-files'),
    path('downloadzip/<name>/',views.DownloadZip.as_view(),name='notes-download-zip'),
]
