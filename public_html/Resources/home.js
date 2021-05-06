var aircraft;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    aircraft = JSON.parse(this.responseText);
    console.log(aircraft[0].reg)
    var sel = document.getElementById('ponteDeSorAircraftSelect');
    for(var i = 0; i < aircraft.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = aircraft[i]['reg'];
      opt.value = [i];
      sel.appendChild(opt);
    }
  }
};
xmlhttp.open("GET", "Resources/aircraftData.json", true);
xmlhttp.send();

function unlock() {
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
  document.getElementById("rwyCondDep").disabled = false

  document.getElementById("inpElevArr").disabled = false
  document.getElementById("inpPressArr").disabled = false
  document.getElementById("inpTempArr").disabled = false
  document.getElementById("inpWindArr").disabled = false
  document.getElementById("inpSlopeArr").disabled = false
  document.getElementById("rwyCondArr").disabled = false
}

document.getElementById("aircraftSelect").addEventListener("change", unlock)
document.getElementById("aircraftSelect").addEventListener("change", maths)
document.getElementById("inpFrnt").addEventListener("keyup", maths)
document.getElementById("inpRear").addEventListener("keyup", maths)
document.getElementById("inpBgge").addEventListener("keyup", maths)
document.getElementById("inpFuel").addEventListener("keyup", maths)
document.getElementById("inpBurn").addEventListener("keyup", maths)

function maths() {
  if (document.getElementById("aircraftSelect").value != "") {
    var bem = aircraft[document.getElementById("aircraftSelect").value].mass
    var bemmom = aircraft[document.getElementById("aircraftSelect").value].moment
    var bemarm = aircraft[document.getElementById("aircraftSelect").value].arm
  }

  document.getElementById('txtBEMArm').innerHTML = bemarm
  document.getElementById('txtBEM').innerHTML = Intl.NumberFormat().format(bem)
  document.getElementById('txtBEMMom').innerHTML = Intl.NumberFormat().format(bemmom)

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
  perfLDG()
}

document.getElementById("inpElevDep").addEventListener("keyup", perfTO)
document.getElementById("inpPressDep").addEventListener("keyup", perfTO)
document.getElementById("inpTempDep").addEventListener("keyup", perfTO)
document.getElementById("inpWindDep").addEventListener("keyup", perfTO)
document.getElementById("inpSlopeDep").addEventListener("keyup", perfTO)
document.getElementById("flapstoggle").addEventListener("click", perfTO)
document.getElementById("rwyCondDep").addEventListener("click", perfTO)

document.getElementById("inpElevArr").addEventListener("keyup", perfLDG)
document.getElementById("inpPressArr").addEventListener("keyup", perfLDG)
document.getElementById("inpTempArr").addEventListener("keyup", perfLDG)
document.getElementById("inpWindArr").addEventListener("keyup", perfLDG)
document.getElementById("inpSlopeArr").addEventListener("keyup", perfLDG)
document.getElementById("rwyCondArr").addEventListener("click", perfLDG)

function perfTO() {
  var mass = tom || 2550
  var flaps = document.getElementById("flapstoggle").checked
  var elev = Number(document.getElementById("inpElevDep").value) || 0
  var press = Number(document.getElementById("inpPressDep").value) || 1013
  var temp = Number(document.getElementById("inpTempDep").value) || 15
  var wind = Number(document.getElementById("inpWindDep").value) || 0
  var slope = Number(document.getElementById("inpSlopeDep").value) || 0.0
  if (document.getElementById("rwyCondDep").value == 0) {
    var rwyCond = 0
  } else if (document.getElementById("rwyCondDep").value == 1) {
    var rwyCond = 1
  } else if (document.getElementById("rwyCondDep").value == 2) {
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

function perfLDG() {
  var mass = lm || 2550
  var elev = Number(document.getElementById("inpElevArr").value) || 0
  var press = Number(document.getElementById("inpPressArr").value) || 1013
  var temp = Number(document.getElementById("inpTempArr").value) || 15
  var wind = Number(document.getElementById("inpWindArr").value) || 0
  var slope = Number(document.getElementById("inpSlopeArr").value) || 0.0
  if (document.getElementById("rwyCondArr").value == 0) {
    var rwyCond = 0
  } else if (document.getElementById("rwyCondArr").value == 1) {
    var rwyCond = 1
  } else if (document.getElementById("rwyCondArr").value == 2) {
    var rwyCond = 2
  } else if (document.getElementById("rwyCondArr").value == 3) {
    var rwyCond = 3
  }

  var pressAlt = ((1013 - press) * 30) + elev
  document.getElementById("txtPressAltArr").innerHTML = pressAlt

  if (pressAlt < 0) {
    var altVar = 0
  } else {
    var altVar = 0.024 * pressAlt
  }

  var tempVar = 3.2 * temp
  var windVar = 17.78 * wind
  var lmVar = 0.29 * (2550 - mass)
  var slopeVar = slope / 2

  var ld = Math.floor((1360 + altVar + tempVar - lmVar - windVar) + 0.5)

  if (rwyCond == 0) {
    var ldr = Math.floor((ld + ((0.1 * ld) * slopeVar)) + 0.5)
  } else if (rwyCond == 1) {
    var ldr = Math.floor(((ld + ((0.1 * ld) * slopeVar)) * 1.15) + 0.5)
  } else if (rwyCond == 2) {
    var ldr = Math.floor(((ld + ((0.1 * ld) * slopeVar)) * 1.15) + 0.5)
  } else if (rwyCond == 3) {
    var ldr = Math.floor(((ld + ((0.1 * ld) * slopeVar)) * 1.35) + 0.5)
  }

  document.getElementById("LDGResults").style.display = "block"
  document.getElementById("txtLDR").innerHTML = Intl.NumberFormat().format(ldr) + " ft"
  document.getElementById("txtLDR143").innerHTML = Intl.NumberFormat().format(Math.floor((ldr * 1.43) + 0.5)) + " ft"
}