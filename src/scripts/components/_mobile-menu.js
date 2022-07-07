const openMenu = document.querySelector(".to-open-mobile-menu")
const closeMenu = document.querySelector(".to-close-mobile-menu")
const containerOpClBtns =  document.getElementById("icon-menu--query")
const containerNav = document.querySelector(".main-nav--ul")
const navItems = document.querySelectorAll(".main-nav--li")


function openCloseMenu() {
  openMenu.classList.toggle("active")
  closeMenu.classList.toggle("active")
  containerNav.classList.toggle("active")

  containerNav.classList.contains("active") ? body.style.overflow = "hidden" : body.style.overflow = "auto"
}


containerOpClBtns.addEventListener("click", e => {

    
    openCloseMenu()
    
})


navItems.forEach(item => {
  item.addEventListener("click", e => {
   
     openCloseMenu()

  })
})


