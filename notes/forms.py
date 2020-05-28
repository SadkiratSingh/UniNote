from django import forms
from django.forms import CharField,ChoiceField,Select

class SemDetailForm(forms.Form):
   TERMS=(('minor1','minor1'),
          ('minor2','minor2'),
          ('major','major'))
   course=forms.select()
   term=forms.select(choices=TERMS)
