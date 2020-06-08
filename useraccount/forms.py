from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
import re

def lastNameCheck(value):
    search_pat='^[A-Z][a-z]+$'
    if(re.search(search_pat,value)==None):
        raise ValidationError('Please enter valid last name',code='invalid')

class RegistrationForm(UserCreationForm):
    email=forms.EmailField(help_text='email should be of the type example@domain.com')
    first_name=forms.CharField(max_length=50,validators=[RegexValidator('^[A-Z][a-z]+$',message='Please enter valid first name',code='Invalid')],help_text='First letter of the name should be captial and thereafter it should contain one or more alphabets')
    last_name=forms.CharField(max_length=50,validators=[lastNameCheck],help_text='First letter of the name should be captial and thereafter it should contain one or more alphabets')
    
    class Meta:
        model=User
        fields=['username','first_name','last_name','email']

    def clean(self):
        validated_email=self.cleaned_data.get('email')
        if(User.objects.filter(email=validated_email).exists()):
            raise ValidationError('This email has been already taken!',code='redundancy')
        return super().clean()