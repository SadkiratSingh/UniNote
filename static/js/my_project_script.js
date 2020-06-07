
//global variables//
const getSemDetailsButtons=document.querySelectorAll('.sem-subject-details');
const formCont=document.getElementsByClassName('form-container')[0];
const chooseCourse=document.querySelector('.choosecourse');
const closeFormButton=document.querySelector('.close-form');
const openNavBar=document.querySelector('.nav-icon');
const navList=document.querySelector('.nav-list');
const courseForm=document.querySelector('.getnotesform')
const submitCourseFormData=document.querySelector('.course-submit');
const chapterGridWrap=document.querySelector('.chapter-grid-wrapper');
const chapterGrid=document.querySelector('.chapter-grid')
var subjectsList=undefined;
var pdfGridItems=undefined;
//global variables//

//button clicks action//
openNavBar.onclick=navbardisplay;
getSemDetailsButtons.forEach((button)=>{
    button.onclick=loadSemCourses;
})
//button clicks action//

//header///
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
        if(response.hasOwnProperty('courses')){
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
    chapterGridWrap.style.display='none';
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
    chapterGridWrap.style.display='block';
    var http;
    http=new XMLHttpRequest();
    http.onreadystatechange=displayChapters;
    http.open('GET','getnotes?course='+courseCode+'&term='+term);
    http.send();
}

function displayChapters(){
    if(this.readyState==4 && this.status==200){
        var filesData=JSON.parse(this.responseText);
        var dataList=filesData['data'];
        var notesstr='';
        var img_url;
        var i=0;
        while(i<dataList.length){
            img_url=dataList[i]['img_url'];
            chapter_name=dataList[i]['ch_name'];
            notesstr+="<div class='chapter-grid-item'>";
            notesstr+=`<img src=${pdfsrc} class='zip-image' alt='zip'>`;
            notesstr+=`<p class='chapter-info'>${chapter_name}</p>`;
            notesstr+=`<button class='zip-download' onclick='downloadZip(this,${chapter_name}.id)' >Download</button>`;
            notesstr+="</div>";
            notesstr+=`<img src=${img_url} class='chapter-image' id=${chapter_name} alt='ch-image'>`;
            i=i+1;
        }
        chapterGrid.innerHTML=notesstr;
        alterClassName()
        runfordisplay()
    }
}

function alterClassName(){
    var zipIcons=document.querySelectorAll('.zip-image');
    var chapterImgs=document.querySelectorAll('.chapter-image');
    for(var i=0;i<chapterImgs.length;i++){
        zipIcons[i].classList.add(chapterImgs[i].id);
    }
}

function runfordisplay(){
    var zipIconsList=document.querySelectorAll('.zip-image');
    zipIconsList.forEach((icon)=>{
        icon.addEventListener('click',chapterImgDisplay)
    })
}

function chapterImgDisplay(e){
    closeFormButton.style.display='none';
    chapterGridItems=document.querySelectorAll('.chapter-grid-item');
    chapterGridItems.forEach((item)=>{
        item.style.display='none';
    })
    var chapterImageId=e.target.classList[1];
    my_img=document.getElementById(chapterImageId);
    my_img.style.display='block';
    my_img.onclick=revertpdfdisplay;
}

function revertpdfdisplay(){
    this.style.display='none';
    closeFormButton.style.display='block';
    chapterGridItems.forEach((item)=>{
        item.style.display='block';
    })
}

function downloadZip(target,chname){
    window.location.href=`downloadzip/${chname}`;
}

//auth-modifications//
var loginButton=document.querySelector('.login-link');
var signUpButton=document.querySelector('.signup-link');
if(loginButton && signUpButton){
    var url=window.location.href;
    var url_list=url.split('/');
    if(url_list[4]=='login'){
        loginButton.classList.add('active');
        signUpButton.classList.remove('active');
    }
    else if(url_list[4]=='signup'){
        signUpButton.classList.add('active');
        loginButton.classList.remove('active');
    }
}

helpButtons=document.querySelectorAll('.click-for-help');
helpButtons.forEach((b)=>{
    b.addEventListener('click',displayHelp);
})
function displayHelp(e){
    alert(e.target.previousElementSibling.innerText);
}
//auth-modifications//



