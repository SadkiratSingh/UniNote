
//global variables//
const getSemDetailsButtons=document.querySelectorAll('.sem-subject-details');
const formCont=document.getElementsByClassName('form-container')[0];
const chooseCourse=document.querySelector('.choosecourse');
const closeFormButton=document.querySelector('.close-form');
const openNavBar=document.querySelector('.nav-icon');
const navList=document.querySelector('.nav-list');
const courseForm=document.querySelector('.getnotesform')
const submitCourseFormData=document.querySelector('.course-submit');
const pdfGridWrap=document.querySelector('.pdf-grid-wrapper');
const pdfGrid=document.querySelector('.pdf-grid')
var subjectsList=undefined;
//global variables//

//button clicks action//
closeFormButton.onclick=closeForm;
openNavBar.onclick=navbardisplay;
getSemDetailsButtons.forEach((button)=>{
    button.onclick=loadSemCourses;
})
submitCourseFormData.addEventListener('click',getNotes)
//button clicks action//

//header//
function navbardisplay(){
    navList.classList.toggle('nav-open')
}
//header

//for getNotes

function closeForm(){
    formCont.style.display='none';
}

function loadSemCourses(){
    formCont.style.display='block';
    courseForm.style.display='block';
    submitCourseFormData.style.display='block';
    pdfGridWrap.style.display='none';
    var sem=this.classList[1];
    var http;
    http=new XMLHttpRequest();
    http.onreadystatechange=checkResponse;
    http.open('GET','getsemcourses/'+sem,true);
    http.send();
}

function checkResponse(){
    if(this.readyState==4 && this.status==200){
        subjectsList=JSON.parse(this.responseText)['courses'];
        createFormContent();
    }
}

function createFormContent(){
    var formstr='';
    for(var i=0;i<subjectsList.length;i++){
        formstr+='<option value='+subjectsList[i][0]+'>'+subjectsList[i][1]+'</option>'
    }
    chooseCourse.innerHTML=formstr;
}

//for getNotes

function getNotes(e){
    var courseCode=document.getElementById('course').value;
    var term=document.getElementById('term').value;
    courseForm.style.display='none';
    e.target.style.display='none';
    pdfGridWrap.style.display='block';
    var http;
    http=new XMLHttpRequest();
    http.onreadystatechange=displayNotes;
    http.open('GET','getnotes?course='+courseCode+'&term='+term);
    http.send();
}

function displayNotes(){
    if(this.readyState==4 && this.status==200){
        var filesData=JSON.parse(this.responseText);
        var dataList=filesData['data'];
        var notesstr=''
        for(var i=0;i<dataList.length;i++){
            // <img src='{% static "images/pdf3.png" %}' class='pdf-image' alt='pdf'>
            // <p class='pdf-info'></p>
            // <button class='pdf-download'>Download</button>
            var img_url=dataList[i]['img_url'];
            var file_name=dataList[i]['file_name']
            notesstr+="<div class='pdf-grid-item'>";
            notesstr+=`<a href=${img_url} class='pdf-img-link'><img src=${pdfsrc} class='pdf-image' alt='pdf'></a>`;
            notesstr+=`<p class='pdf-info'>${file_name}</p>`;
            notesstr+="<button class='pdf-download'>Download</button>";
            notesstr+="</div>";
        }
        pdfGrid.innerHTML=notesstr;
    }
}