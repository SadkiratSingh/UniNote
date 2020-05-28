const getSemDetails=document.getElementsByClassName('sem-subject-details')[0];
const formCont=document.getElementsByClassName('form-container')[0];
getSemDetails.addEventListener('click',displayForm)

function displayForm(e){
    formCont.style.display='block';
}