
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
var pdfGridItems=undefined;
//global variables//

//button clicks action//
openNavBar.onclick=navbardisplay;
getSemDetailsButtons.forEach((button)=>{
    button.onclick=loadSemCourses;
})
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
    var sem=this.classList[1];
    var http;
    http=new XMLHttpRequest();
    http.onreadystatechange=checkResponse;
    http.open('GET','getsemcourses/'+sem,true);
    http.send();
}

function checkResponse(){
    if(this.readyState==4 && this.status==200){
        var response=JSON.parse(this.responseText);
        if(response.hasOwnProperty('login_url')){
           window.location.href=response['login_url']
        }
        else if(response.hasOwnProperty('courses')){
            subjectsList=response['courses'];
            createFormContent();
        }
    }
}

function createFormContent(){
    formCont.style.display='block';
    closeFormButton.onclick=closeForm;
    courseForm.style.display='block';
    submitCourseFormData.style.display='block';
    submitCourseFormData.addEventListener('click',getNotes);
    pdfGridWrap.style.display='none';
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
        var notesstr='';
        var img_url;
        var file_name;
        var alt_file_name;
        var orgFileName;
        var i=0;
        while(i<dataList.length){
            img_url=dataList[i]['img_url'];
            file_name=dataList[i]['file_name'];
            alt_file_name=dataList[i]['file_name_alt'];
            orgFileName=dataList[i]['org_file_name'];
            notesstr+="<div class='pdf-grid-item'>";
            notesstr+=`<img src=${pdfsrc} class='pdf-image' alt='pdf'>`;
            notesstr+=`<p class='pdf-info'>${file_name}</p>`;
            notesstr+=`<p class='pdf-path'>${orgFileName}</p>`;
            notesstr+="<button class='pdf-download' onclick='downloadPdf(this)' >Download</button>";
            notesstr+="</div>";
            notesstr+=`<img src=${img_url} class='notes-image' id=${alt_file_name} alt='pdf'>`;
            i=i+1;
        }
        pdfGrid.innerHTML=notesstr;
        alterClassName()
        runfordisplay()
    }
}

function alterClassName(){
    var pdfIcons=document.querySelectorAll('.pdf-image');
    var notesImgs=document.querySelectorAll('.notes-image');
    for(var i=0;i<notesImgs.length;i++){
        pdfIcons[i].classList.add(notesImgs[i].id);
    }
}

function runfordisplay(){
    var pdfIconsList=document.querySelectorAll('.pdf-image');
    pdfIconsList.forEach((icon)=>{
        icon.addEventListener('click',notesImgDisplay)
    })
}

function notesImgDisplay(e){
    closeFormButton.style.display='none';
    pdfGridItems=document.querySelectorAll('.pdf-grid-item');
    pdfGridItems.forEach((item)=>{
        item.style.display='none';
    })
    var notesImageId=e.target.classList[1];
    my_img=document.getElementById(notesImageId);
    my_img.style.display='block';
    my_img.onclick=revertpdfdisplay;
}

function revertpdfdisplay(){
    this.style.display='none';
    closeFormButton.style.display='block';
    pdfGridItems.forEach((item)=>{
        item.style.display='block';
    })
}

function downloadPdf(target){
    orgName=target.previousElementSibling.innerText;
    window.location.href=`downloadpdf/${orgName}`;
}



