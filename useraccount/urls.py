from django.urls import path
from . import views

urlpatterns=[
    path('login/',views.UserLoginView.as_view(),name='useraccount-login'),
    path('signup/',views.UserSignUpView.as_view(),name='useraccount-signup'),
    path('logout/',views.UserLogOutView.as_view(),name='useraccount-logout'),
]