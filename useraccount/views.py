from django.shortcuts import render
from django.views.generic import View
from django.contrib.auth.views import LoginView
from django.views.generic.edit import FormView
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
# Create your views here.

class UserLoginView(LoginView):
    template_name='useraccount/login.html'

class UserSignUpView(FormView):
    form_class=UserCreationForm
    success_url=reverse_lazy('/notes/')
    template_name='useraccount/registration.html'