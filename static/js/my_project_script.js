const getSemDetailsButtons=document.querySelectorAll('.sem-subject-details');
const formCont=document.getElementsByClassName('form-container')[0];
const chooseCourse=document.querySelector('.choosecourse');
var subjectsList=undefined;

getSemDetailsButtons.forEach((button)=>{
    button.onclick=loadSemCourses;
})

function loadSemCourses(){
    formCont.style.display='block';
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