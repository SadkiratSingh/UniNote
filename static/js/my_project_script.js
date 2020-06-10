
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
const chapterGrid=document.querySelector('.chapter-grid');
const globalWrap=document.querySelector('.global-wrapper');
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
        else if(response.hasOwnProperty('message')){
            alert(response['message']);
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
    var http;
    http=new XMLHttpRequest();
    http.onreadystatechange=displayChapters;
    http.open('GET','getnotes?course='+courseCode+'&term='+term);
    http.send();
}

function displayChapters(){
    if(this.readyState==4 && this.status==200){
        var response=JSON.parse(this.responseText);
        if(response.hasOwnProperty('delay_msg')){
            alert(response['delay_msg']);
        }
        else{
            chapterGridWrap.style.display='block';
            var dataList=response['data'];
            var notesstr='';
            var img_url;
            var i=0;
            while(i<dataList.length){
                img_url=dataList[i]['img_url'];
                chapter_name=dataList[i]['ch_name'];
                notesstr+="<div class='chapter-grid-item'>";
                notesstr+=`<img src=${pdfsrc} class='zip-image' alt='zip'>`;
                notesstr+=`<p class='chapter-info'>${chapter_name}</p>`;
                notesstr+=`<button class='zip-download ${chapter_name}' onclick='downloadZip(this)'>Download</button>`;
                notesstr+="</div>";
                notesstr+=`<img src=${img_url} class='chapter-image' id=${chapter_name} alt='ch-image'>`;
                i=i+1;
            }
            chapterGrid.innerHTML=notesstr;
            alterClassName()
            runfordisplay()
        }
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

function downloadZip(target){
    var chname=target.classList[1];
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

//handling error msgs//
errormsgssignup=document.querySelector('.signup-error-msgs');
errormsgslogin=document.querySelector('.login-error-msgs');
if(errormsgssignup){
errormsgssignup.onclick=vanishSignupMsgs;
}

if(errormsgslogin){
    errormsgslogin.onclick=vanishLoginMsgs;
}

function vanishSignupMsgs(){
    this.style.display='none';
}

function vanishLoginMsgs(){
    this.style.display='none';
}
//handling error msgs//

//handling intro page//
var win_url=window.location.href;
win_url_list=win_url.split('/');
if(win_url_list[3]==''){
    globalWrap.style.backgroundColor='#3AAFA9';
    var text=document.querySelector('.intro-text').innerText;
    document.querySelector('.intro-text').innerText='';
    var pos=0;
    var interval=90;    
    function type(){
        if (pos<text.length){
            document.querySelector('.intro-text').innerText+=text.charAt(pos);
            pos++;
        }
        else{
            document.querySelector('.intro-text').innerText='';
            pos=0;
        }
    }
    setInterval(type,100);
}

//handling intro page//
