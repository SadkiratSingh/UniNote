from django.shortcuts import render
from django.views.generic import View
from django.contrib.auth.views import LoginView,LogoutView
from django.views.generic.edit import CreateView
from .forms import RegistrationForm
from django.urls import reverse_lazy
from django.contrib import messages
from django.http import HttpResponseRedirect
# Create your views here.

class UserLoginView(LoginView):
    template_name='useraccount/login.html'
    redirect_authenticated_user=True
    
    def form_invalid(self,form):
        field_errors_dict=form.errors
        other_errors=form.non_field_errors()
        for error_list in field_errors_dict.values():
            for e in error_list:
                messages.error(self.request,e)

        return super().form_invalid(form)

class UserSignUpView(CreateView):
    form_class=RegistrationForm
    success_url=reverse_lazy('useraccount-login')
    template_name='useraccount/registration.html'

    def form_invalid(self,form):
        field_errors_dict=form.errors
        other_errors=form.non_field_errors()
        for error_list in field_errors_dict.values():
            for e in error_list:
                messages.error(self.request,e)

        return super().form_invalid(form)
    
    def dispatch(self,request,*args,**kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect('/notes/')
        else:
            return super().dispatch(request,*args,**kwargs)

class UserLogOutView(LogoutView):
    pass