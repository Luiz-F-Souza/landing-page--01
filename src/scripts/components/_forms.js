
const forms = {
  title: document.querySelector(".h2"),
  containerProgress: document.querySelectorAll(".container--steps"),
  containerFormsInputs: document.querySelectorAll("form"),
  stepsNumber: document.querySelectorAll(".step-number"), // para estilizar o ::after dele quando ativo em telas pequanas.. estilo no query

  cepInfo: {
    cepInput: document.getElementById("cep"),
    streetInput: document.getElementById("place-of-change"),
    cityInput: document.getElementById("city-of-change"),
    provinceInput: document.getElementById("province"),
    errorMsg: document.querySelector(".error-p-msg")
  },

  btns: {
    btnNext: document.querySelector(".btn--go-next"),
    btnBack: document.querySelector(".btn--go-back"),
    containerBtns: document.querySelector(".container--btns")
  },

  svgFinish: document.querySelector(".svg-finish")

}

const body = document.querySelector("body")
const btnBudget = document.querySelectorAll(".btn--cta-budget")
const formBody = document.querySelector(".container--form--full")

//---------------------------------------------------------------------------------------------------------------


//function to open modal
function openModal(){

  formBody.classList.toggle("hidden")
    
  body.style.overflow = "hidden" // just to prevent the background scrolling with modal open
  
}

// function that should run always that the modal needs to be closed
function closeModal(){
  body.style.overflow = ""
  formBody.classList.add("hidden")
}

// function that checks if the typed cep its valid or not.
function invalidCEP(){
  forms.cepInfo.cepInput.style.outline = "2px solid red"
  forms.cepInfo.errorMsg.textContent = "CEP INVÁLIDO"
  forms.cepInfo.errorMsg.style.padding = "10px 0"

  forms.cepInfo.cityInput.value = ""
  forms.cepInfo.provinceInput.value = ""
  forms.cepInfo.streetInput.value = ""
}

//---------------------------------------------------------------------------------------------------------------

// to add openModal() to each btn that has "btn--cta-budget" as class
btnBudget.forEach(btn => {
  btn.addEventListener("click", e =>{

    openModal()
  })
})

//to close modal when the user clicks outside of the form
formBody.addEventListener("click", e => {

  //this is checking if where the click happened contains this class (only the parent container has this class)
  e.target.classList.contains("container--form--full") ? closeModal() : ""
  
})

// to make modal close when esc is clicked
body.addEventListener("keyup", e =>{
  
  e.key.includes("Escape") ? closeModal() : ""
  
})

// btn to go foward and at the end submit the form
forms.btns.btnNext.addEventListener("click", e => {



  for(i = 0; i < forms.containerProgress.length; i++){
    //this checks if the progress container contains "active" class returning true or false.
  const containsActiveOrNot =  forms.containerProgress[i].classList.contains("active")

  

  //if containerProgress its true, then it means that it is active at the moment and the script will not enter here.
  //when the first containerProgress equal false its found, then the code enter here and at the end return to finish the function.
  if(!containsActiveOrNot){

    forms.containerProgress[i].classList.add("active") // to change the input fields
    forms.stepsNumber[i].classList.add("active") // to change the info about which field the user are

    forms.containerFormsInputs[i-1].classList.add("hidden") // to hidde the page that was active
    forms.containerFormsInputs[i].classList.remove("hidden") // to show the page that should be active

    // to change the text container from "PROXIMO" to "ENVIAR" in case its the last screen with input
    i + 2 === forms.containerProgress.length ? forms.btns.btnNext.textContent = "ENVIAR" : forms.btns.btnNext.textContent = "PRÓXIMO"

    
    forms.btns.btnNext.style.backgroundColor = "#61E16E"


    if(i === forms.containerProgress.length - 1){

      forms.btns.btnNext.textContent = "FECHAR JANELA"
      forms.btns.btnNext.style.backgroundColor = "BLACK"
      forms.btns.btnBack.style.display = "none"
      forms.btns.containerBtns.style.left = "50%"

      forms.svgFinish.classList.remove("hidden")
      
      
    }
    
    return
    }

    i + 1 === forms.containerProgress.length ? closeModal() : ""
  }


})

// btn to go back and at first page close modal (similar to what we have seen in btnNext, but backwards)
forms.btns.btnBack.addEventListener("click", e => {

  for(i = 3; i > 0; i-- ){

   
    const containsOrNot = forms.containerProgress[i].classList.contains("active")

    if(!forms.containerFormsInputs[0].classList.contains("hidden")){
      closeModal()
      return
    }

    if(containsOrNot){

      forms.containerProgress[i].classList.remove("active")
      forms.stepsNumber[i].classList.remove("active")

      forms.containerFormsInputs[i].classList.add("hidden")
      forms.containerFormsInputs[i - 1].classList.remove("hidden")
      
      
      
      i  === forms.containerProgress.length - 1 ? forms.btns.btnNext.textContent = "ENVIAR" : forms.btns.btnNext.textContent = "PRÓXIMO"
      forms.btns.btnNext.style.backgroundColor = "#61E16E"
      return
    }
  }



})

// to take info about the typed cep when the user change input box.
forms.cepInfo.cepInput.addEventListener("focusout", e => {

  const cepInputed = forms.cepInfo.cepInput.value // to take the last value typed before changed the focus.
  const cleanCep = cepInputed.replace('-','').replace('.','').replace(',','').replace(' ','') // to clean the string typed.
  const cleanCepLenght = cleanCep.length // to see the length of the typed string

  
  if(cleanCepLenght !== 8){
    // if it has less or higher than 8, it means that will be invalid
    invalidCEP()

    }else{
      // if the string has 8 chars, then the error msg (in case that has already been shown), has to desapear and the out line should be normal
      forms.cepInfo.cepInput.style.outline = "none"
      forms.cepInfo.errorMsg.textContent = ""
      forms.cepInfo.errorMsg.style.padding = "0"

      //this takes the viacep url and replace with the typed cep. then it converts to jason and finaly takes the info that we need
      const urlCEP = `https://viacep.com.br/ws/${cleanCep}/json/`
      fetch(urlCEP).then(response => response.json()).then(e => {
      const cepData = {
          street: e.logradouro,
          district: e.bairro,
          city: e.localidade,
          province: e.uf
        }

        
        //if the city is undefined it means that we have something wrong with the cep, it calls invalidCEP() . if the city is some valid value, then it will replace the inputs with thease values.
      if(cepData.city){
        forms.cepInfo.cityInput.value = `${cepData.city}`
        forms.cepInfo.provinceInput.value = `${cepData.province}`
        forms.cepInfo.streetInput.value = `${cepData.street}, ${cepData.district} `
          }else{
        invalidCEP()
       }
    })
  } 
})

