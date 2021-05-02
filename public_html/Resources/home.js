var bem = 0
var bemarm = 0
var bemmom = 0

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
function setData(reg) {
  console.log(reg)
  if (reg == "LCTO") {
    bem = 1234
  } else if (reg == "LCTN") {
    bem = 5678
  } else if (reg == "LCTR") {
    bem = 7700
  }
  console.log(bem)
}
  // Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
    }
}