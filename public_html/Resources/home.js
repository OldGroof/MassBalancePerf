function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show")
}

function setData(reg) {
  if (reg == "G-LCTO") {
    bem = 1681
    bemarm = 89.34
    bemmom = 150178
  } else if (reg == "G-LCTP") {
    bem = 1689
    bemarm = 89.51
    bemmom = 151188
  } else if (reg == "G-LCTR") {
    bem = 1690
    bemarm = 88.99
    bemmom = 150387
  } else {
    return
  }

  document.getElementById('txtDropdown').innerHTML = reg
  document.getElementById('txtBEMArm').innerHTML = bemarm
  document.getElementById('txtBEM').innerHTML = Intl.NumberFormat().format(bem)
  document.getElementById('txtBEMMom').innerHTML = Intl.NumberFormat().format(bemmom)
  document.getElementById('inpFrnt').disabled = false
  document.getElementById('inpRear').disabled = false
  document.getElementById('inpBgge').disabled = false
  document.getElementById('inpFuel').disabled = false
  document.getElementById('inpBurn').disabled = false

  document.getElementById("flapstoggle").disabled = false
  document.getElementById("inpElevDep").disabled = false
  document.getElementById("inpPressDep").disabled = false
  document.getElementById("inpTempDep").disabled = false
  document.getElementById("inpWindDep").disabled = false
  document.getElementById("inpSlopeDep").disabled = false
  document.getElementById("paved").disabled = false
  document.getElementById("grsDy").disabled = false
  document.getElementById("grsWt").disabled = false
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
document.getElementById("inpRear").addEventListener("keyup", maths)
document.getElementById("inpBgge").addEventListener("keyup", maths)
document.getElementById("inpFuel").addEventListener("keyup", maths)
document.getElementById("inpBurn").addEventListener("keyup", maths)

function maths() {
  var frntMass = Number(document.getElementById("inpFrnt").value)
  var rearMass = Number(document.getElementById("inpRear").value)
  var bggeMass = Number(document.getElementById("inpBgge").value)
  var fuelMass = Number(document.getElementById("inpFuel").value)
  var burnMass = Number(document.getElementById("inpBurn").value)

  var frntMom = frntMass * 80.5
  var rearMom = rearMass * 118.1
  var bggeMom = bggeMass * 142.8

  zfm = bem + frntMass + rearMass + bggeMass
  var zfmMom = bemmom + frntMom + rearMom + bggeMom
  var zfmArm = (Math.round((zfmMom / zfm) * 10) / 10).toFixed(1)

  var fuelMom = fuelMass * 95

  tom = zfm + fuelMass - 8
  var tomMom = zfmMom + fuelMom - 760
  var tomArm = (Math.round((tomMom / tom) * 10) / 10).toFixed(1)

  var burnMom = burnMass * -95

  lm = tom - burnMass
  var lmMom = tomMom + burnMom
  var lmArm = (Math.round((lmMom / lm) * 10) / 10).toFixed(1)

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
  if (fuelMom != 0) {
    document.getElementById("txtFuelMom").innerHTML = Intl.NumberFormat().format(Math.round(fuelMom))
  } else {
    document.getElementById("txtFuelMom").innerHTML = ""
  }
  if (burnMom != 0) {
    document.getElementById("txtBurnMom").innerHTML = Intl.NumberFormat().format(Math.round(burnMom))
  } else {
    document.getElementById("txtBurnMom").innerHTML = ""
  }

  document.getElementById("txtZFMArm").innerHTML = zfmArm
  document.getElementById("zfmCG").innerHTML = "Zero Fuel C of G: " + zfmArm
  document.getElementById("txtZFM").innerHTML = Intl.NumberFormat().format(zfm)
  document.getElementById("txtZFMMom").innerHTML = Intl.NumberFormat().format(Math.floor(zfmMom + 0.5))

  document.getElementById("txtTOMArm").innerHTML = tomArm
  document.getElementById("tomCG").innerHTML = "Take Off C of G: " + tomArm
  document.getElementById("txtTOM").innerHTML = Intl.NumberFormat().format(tom)
  document.getElementById("txtTOMMom").innerHTML = Intl.NumberFormat().format(Math.floor(tomMom + 0.5))

  document.getElementById("txtLMArm").innerHTML = lmArm
  document.getElementById("lmCG").innerHTML = "Landing C of G: " + lmArm
  document.getElementById("txtLM").innerHTML = Intl.NumberFormat().format(lm)
  document.getElementById("txtLMMom").innerHTML = Intl.NumberFormat().format(Math.floor(lmMom + 0.5))

  perfTO()
}

// Constants

const SEGMENTED_CONTROL_BASE_SELECTOR = ".ios-segmented-control";
const SEGMENTED_CONTROL_INDIVIDUAL_SEGMENT_SELECTOR = ".ios-segmented-control .option input";
const SEGMENTED_CONTROL_BACKGROUND_PILL_SELECTOR = ".ios-segmented-control .selection";


// Main

document.addEventListener("DOMContentLoaded", setup);

// Body functions

function setup() {
  forEachElement(SEGMENTED_CONTROL_BASE_SELECTOR, elem => {
    elem.addEventListener("change", updatePillPosition);
  })
  window.addEventListener("resize", updatePillPosition); // Prevent pill from detaching from element when window resized. Becuase this is rare I haven't bothered with throttling the event
}

function updatePillPosition() {
  forEachElement(SEGMENTED_CONTROL_INDIVIDUAL_SEGMENT_SELECTOR, (elem, index) => {
    if (elem.checked) moveBackgroundPillToElement(elem, index);
  })
}

function moveBackgroundPillToElement(elem, index) {
  document.querySelector(SEGMENTED_CONTROL_BACKGROUND_PILL_SELECTOR).style.transform = "translateX(" + (elem.offsetWidth * index) + "px)";
}

// Helper functions

function forEachElement(className, fn) {
  Array.from(document.querySelectorAll(className)).forEach(fn);
}

document.getElementById("inpElevDep").addEventListener("keyup", perfTO)
document.getElementById("inpPressDep").addEventListener("keyup", perfTO)
document.getElementById("inpTempDep").addEventListener("keyup", perfTO)
document.getElementById("inpWindDep").addEventListener("keyup", perfTO)
document.getElementById("inpSlopeDep").addEventListener("keyup", perfTO)
document.getElementById("flapstoggle").addEventListener("click", perfTO)
document.getElementById("rwyCondDep").addEventListener("click", perfTO)

function perfTO() {
  var mass = tom || 2550
  var flaps = document.getElementById("flapstoggle").checked
  var elev = Number(document.getElementById("inpElevDep").value) || 0
  var press = Number(document.getElementById("inpPressDep").value) || 1013
  var temp = Number(document.getElementById("inpTempDep").value) || 15
  var wind = Number(document.getElementById("inpWindDep").value) || 0
  var slope = Number(document.getElementById("inpSlopeDep").value) || 0.0
  if (document.getElementById("paved").checked == true) {
    var rwyCond = 0
  } else if (document.getElementById("grsDy").checked == true) {
    var rwyCond = 1
  } else if (document.getElementById("grsWt").checked == true) {
    var rwyCond = 2
  }

  var pressAlt = ((1013 - press) * 30) + elev
  document.getElementById("txtPressAltDep").innerHTML = pressAlt

  if (pressAlt < 0) {
    var altVar = 0
  } else {
    if (flaps == true) {
      var altVar = 0.13 * pressAlt
    } else {
      var altVar = 0.2 * pressAlt
    }
  }

  if (flaps == true) {
    var tempVar = 16.9 * temp
    var windVar = 21 * wind
    var slopeVar = slope / 2
    var tomVar = 1.53 * (2550 - mass)

    var tod = Math.floor((1400 + altVar + tempVar - tomVar - windVar) + 0.5)
  } else {
    var tempVar = 21.5 * temp
    var windVar = 18.5 * wind
    var slopeVar = slope / 2
    var tomVar = 2000 - ((0.00168824 * (mass * mass)) + (-6.04939 * (mass)) + 6447.05)

    var tod = Math.floor((1700 + altVar + tempVar - tomVar - windVar) + 0.5)
    if (tod < 1000) {
      tod = 1000
    }
  }

  if (rwyCond == 1) {
    var todr = Math.floor(((tod + ((0.1 * tod) * slopeVar)) * 1.2) + 0.5)
  } else if (rwyCond == 2) {
    var todr = Math.floor(((tod + ((0.1 * tod) * slopeVar)) * 1.3) + 0.5)
  } else {
    var todr = Math.floor((tod + ((0.1 * tod) * slopeVar)) + 0.5)
  }

  document.getElementById("TOResults").style.display = "block"
  document.getElementById("txtTODR").innerHTML = Intl.NumberFormat().format(todr) + " ft"
  document.getElementById("txtTODR125").innerHTML = Intl.NumberFormat().format(Math.floor((todr * 1.25) + 0.5)) + " ft"
  document.getElementById("txtTODR115").innerHTML = Intl.NumberFormat().format(Math.floor((todr * 1.15) + 0.5)) + " ft"
  document.getElementById("txtTODR130").innerHTML = Intl.NumberFormat().format(Math.floor((todr * 1.30) + 0.5)) + " ft"
}