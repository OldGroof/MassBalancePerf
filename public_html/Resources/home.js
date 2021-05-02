function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show")
}
  
function setData(reg) {
  console.log(reg)
  if (reg == "LCTO") {
    bem = 1681
    bemarm = 89.34
    bemmom = 150178
  } else if (reg == "LCTP") {
    bem = 1689
    bemarm = 89.51
    bemmom = 151188
  } else if (reg == "LCTR") {
    bem = 1690
    bemarm = 88.99
    bemmom = 150387
  } else {
    return
  }

  document.getElementById('txtBEMArm').innerHTML = bemarm
  document.getElementById('txtBEM').innerHTML = Intl.NumberFormat().format(bem)
  document.getElementById('txtBEMMom').innerHTML = Intl.NumberFormat().format(bemmom)
  document.getElementById('inpFrnt').disabled = false
  document.getElementById('inpRear').disabled = false
  document.getElementById('inpBgge').disabled = false
  maths()
}

window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
    }
}

document.getElementById("inpFrnt").addEventListener("keyup", maths)
document.getElementById("inpFrnt").addEventListener("focus", maths)
document.getElementById("inpRear").addEventListener("keyup", maths)
document.getElementById("inpRear").addEventListener("focus", maths)
document.getElementById("inpBgge").addEventListener("keyup", maths)
document.getElementById("inpBgge").addEventListener("focus", maths)

function maths() {
  var frntMass = Number(document.getElementById("inpFrnt").value)
  var rearMass = Number(document.getElementById("inpRear").value)
  var bggeMass = Number(document.getElementById("inpBgge").value)

  var frntMom = frntMass * 80.5
  var rearMom = rearMass * 118.1
  var bggeMom = bggeMass * 142.8

  var zfm = bem + frntMass + rearMass + bggeMass
  var zfmMom = bemmom + frntMom + rearMom + bggeMom
  var zfmArm = Math.round((zfmMom / zfm) * 10) / 10

  if (frntMom != 0) {
    document.getElementById("txtFrntMom").innerHTML = Intl.NumberFormat().format(Math.round(frntMom))
  } else {
    document.getElementById("txtFrntMom").innerHTML = ""
  }
  if (rearMom != 0) {
    document.getElementById("txtRearMom").innerHTML = Intl.NumberFormat().format(Math.round(rearMom))
  } else {
    document.getElementById("txtRearMom").innerHTML = ""
  }
  if (bggeMom != 0) {
    document.getElementById("txtBggeMom").innerHTML = Intl.NumberFormat().format(Math.round(bggeMom))
  } else {
    document.getElementById("txtBggeMom").innerHTML = ""
  }

  document.getElementById("txtZFMArm").innerHTML = zfmArm
  document.getElementById("zfmCG").innerHTML = "Zero Fuel C of G: " + zfmArm
  document.getElementById("txtZFM").innerHTML = Intl.NumberFormat().format(zfm)
  document.getElementById("txtZFMMom").innerHTML = Intl.NumberFormat().format(Math.floor(zfmMom + 0.5))
}