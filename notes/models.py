from django.db import models
from datetime import date
import re

# Create your models here.

class Semester(models.Model):
    SEMESTER=( ('first','First'),
           ('second','Second'),
           ('third','Third'),
           ('fourth','Fourth'),
           ('fifth','Fifth'),
           ('sixth','Sixth'),
           ('seventh','Seventh'),
           ('eigth','Eigth'),
           
        )
    semester=models.CharField(max_length=10,choices=SEMESTER,primary_key=True)

    def __str__(self):
        return self.semester

        
class Course(models.Model):
    cource_code=models.CharField(max_length=10,primary_key=True)
    course=models.CharField(max_length=30,default='course')
    semester=models.ForeignKey(Semester,on_delete=models.CASCADE,default='first')

    def __str__(self):
        return '{},{} sem'.format(self.cource_code,self.semester.semester)

class Chapter(models.Model):

    TERM=[('minor1','minor1'),
          ('minor2','minor2'),
          ('major','major'),
        ]
    name=models.CharField(max_length=100,default='chapter',primary_key=True)
    image=models.ImageField(upload_to='notes/pdf_images',default='images')
    term=models.CharField(max_length=10,choices=TERM,default=1)
    rel_course=models.ForeignKey(Course,on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name},{self.term}'

#### for collection of pdf files related to one chapter ####
def call_to_upload(instance,filename):
    return f'notes/pdfs/{instance.rel_chapter.name}/{filename}'
#### for collection of pdf files related to one chapter ####

class PdfFiles(models.Model):
    rel_chapter=models.ForeignKey(Chapter,on_delete=models.CASCADE,default=1)
    files=models.FileField(upload_to=call_to_upload,default='files')
    upload_date=models.DateField(default=date.today())

    class Meta:
        verbose_name='Pdf File'

    def __str__(self):
        ch_name=self.rel_chapter.name
        file_name=re.sub(f'notes/pdfs/{ch_name}/','',self.files.name)
        file_name=re.sub('.pdf','',file_name)
        return '{},{},{}'.format(self.rel_chapter.name,self.rel_chapter.term,file_name)