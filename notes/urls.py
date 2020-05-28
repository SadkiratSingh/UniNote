from django.urls import path
from . import views

# Create your views here.

urlpatterns=[
    path('',views.HomePageView.as_view(),name='notes-home'),
]
