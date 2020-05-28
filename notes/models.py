from django.db import models
from datetime import date


# Create your models here.
class Course(models.Model):

    SEMESTER=( ('first','First'),
           ('second','Second'),
           ('third','Third'),
           ('fourth','Fourth'),
           ('fifth','Fifth'),
           ('sixth','Sixth'),
           ('seventh','Seventh'),
           ('eigth','Eigth'),
           
        )
    cource_code=models.CharField(max_length=10,primary_key=True)
    course=models.CharField(max_length=30,default='course')
    semester=models.CharField(max_length=10,choices=SEMESTER,default='sem')

    def __str__(self):
        return '{},{} sem'.format(self.source_code,self.semester)

class PdfFiles(models.Model):

    TERM=[('minor1','minor1'),
          ('minor2','minor2'),
          ('major','major'),
        ]


    cource_code=models.ForeignKey(Course,on_delete=models.CASCADE)
    files=models.FileField(upload_to='notes/pdfs',default='files')
    image=models.ImageField(upload_to='notes/pdf_images',default='images')
    term=models.CharField(max_length=10,choices=TERM,default=1)
    upload_date=models.DateField(default=date.today())

    class Meta:
        verbose_name='Pdf File'

    def __str__(self):
        return '{},{} sem,{}'.format(self.cource_code.cource_code,self.cource_code.semester,self.term)

