var unitTO = "imp"
var unitLDG = "imp"
var aircraft
var airport
var runway
var intx

var depMetar
var arrMetar

var vertRng = document.getElementById("graph").style.height

var zfm = 1200
var zfmArm = 87.5
var tom = 1200
var tomArm = 87.5
var lm = 1200
var lmArm = 87.5

var xmlhttp = new XMLHttpRequest()
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    aircraft = JSON.parse(this.responseText)
    var sel = document.getElementById('aircraftSelect')
    for(var i = 0; i < aircraft.length; i++) {
      var opt = document.createElement('option')
      opt.innerHTML = aircraft[i]['reg']
      opt.value = [i]
      sel.appendChild(opt)
    }
  }
}
xmlhttp.open("GET", "Resources/cranfieldAircraftData.json", true)
xmlhttp.send()

var airportGet = new XMLHttpRequest()
airportGet.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    airport = JSON.parse(this.responseText)
    var sel = document.getElementById('airpSelect')
    for(var i = 0; i < airport.length; i++) {
      var opt = document.createElement('option')
      opt.innerHTML = airport[i]['icao'] + " " + airport[i]['name']
      opt.value = [i]

      sel.appendChild(opt)
    }
  }
}
airportGet.open("GET", "Resources/airportData.json", true)
airportGet.send()

var airportGetArr = new XMLHttpRequest()
airportGetArr.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    airport = JSON.parse(this.responseText)
    var sel = document.getElementById('airpSelectArr')
    for(var i = 0; i < airport.length; i++) {
      var opt = document.createElement('option')
      opt.innerHTML = airport[i]['icao'] + " " + airport[i]['name']
      opt.value = [i]

      sel.appendChild(opt)
    }
  }
}
airportGetArr.open("GET", "Resources/airportData.json", true)
airportGetArr.send()

window.onload = graphUpdate
window.onresize = graphUpdate

function depRunwayUpdate() {
  var sel = document.getElementById('rwySelect')
  for (i = sel.options.length-1; i >= 1; i--) {
    sel.options[i] = null;
  }

  runway = airport[document.getElementById("airpSelect").value].runways
  for(var i = 0; i < runway.length; i++) {
    var opt = document.createElement('option')
    opt.innerHTML = "RWY " + runway[i]['name']
    opt.value = [i]
    sel.appendChild(opt)
  }

  document.getElementById("TOResults").style.display = "none"
  document.getElementById("txtDepPressAlt").style.display = "none"
  document.getElementById("rwySelect").disabled = false
  document.getElementById("rwyCondDep").disabled = false
  document.getElementById("rwySelect").value = 0
}

function arrRunwayUpdate() {
  var sel = document.getElementById('rwySelectArr')
  for (i = sel.options.length-1; i >= 1; i--) {
    sel.options[i] = null;
  }

  runway = airport[document.getElementById("airpSelectArr").value].runways
  for(var i = 0; i < runway.length; i++) {
    var opt = document.createElement('option')
    opt.innerHTML = "RWY " + runway[i]['name']
    opt.value = [i]
    sel.appendChild(opt)
  }

  document.getElementById("LDGResults").style.display = "none"
  document.getElementById("txtArrPressAlt").style.display = "none"
  document.getElementById("rwySelectArr").disabled = false
  document.getElementById("rwyCondArr").disabled = false
  document.getElementById("rwySelectArr").value = 0
}

function intxUpdate() {
  var sel = document.getElementById('intxSelect')
  for (i = sel.options.length-1; i >= 1; i--) {
    sel.options[i] = null;
  }

  intx = runway[document.getElementById("rwySelect").value].intx

  if (intx.length != 0) {
    for(var i = 0; i < intx.length; i++) {
      var opt = document.createElement('option')
      opt.innerHTML = intx[i]['name']
      opt.value = [i]
      sel.appendChild(opt)
    }
    document.getElementById("intxSelect").disabled = false
    document.getElementById("intxSelect").value = 0
  } else {
    document.getElementById("intxSelect").disabled = true
    document.getElementById("intxSelect").value = 0
  }
}

function getDepMetar() {
  var icao = airport[document.getElementById("airpSelect").value]["icao"]
  var metar = new XMLHttpRequest()
  metar.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          result = JSON.parse(this.responseText)
          depMetar = result

          document.getElementById("txtMetarDep").innerHTML = "METAR " + depMetar.data[0].raw_text
          document.getElementById("metarBox").style.display = "block"
      }
  };
  metar.open("GET", "https://api.checkwx.com/metar/" + icao + "/decoded", true)
  metar.setRequestHeader('X-API-Key', '6f5de2372b0543bc9959c51695')
  metar.send()
}

function getArrMetar() {
  var icao = airport[document.getElementById("airpSelectArr").value]["icao"]
  var metar = new XMLHttpRequest()
  metar.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          result = JSON.parse(this.responseText)
          arrMetar = result

          document.getElementById("txtMetarArr").innerHTML = "METAR " + arrMetar.data[0].raw_text
          document.getElementById("metarBoxArr").style.display = "block"
      }
  };
  metar.open("GET", "https://api.checkwx.com/metar/" + icao + "/decoded", true)
  metar.setRequestHeader('X-API-Key', '6f5de2372b0543bc9959c51695')
  metar.send()
}

function getArrTaf() {
  icao = airport[document.getElementById("airpSelectArr").value]["icao"]
  var taf = new XMLHttpRequest()
  taf.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          result = JSON.parse(this.responseText)

          document.getElementById('txtTafArr').innerHTML = "TAF " + result.raw
      }
  };
  taf.open("GET", "https://avwx.rest/api/taf/" + icao, true)
  taf.setRequestHeader('Authorization', 'vTzmtdwxOfCF21hIR6YeeL9WF-JVSKTZHBBgv5boIBc')
  taf.send()
}

function graphUpdate() {
  vertRng = document.getElementById("graph").height

  document.getElementById("zfmGraph").style.top = ((0.958 - (((zfm - 1200) / 1350) * 0.9545)) * vertRng) + "px"
  document.getElementById("zfmGraph").style.left = (41.0385 + ((7.4 - (0.0026096 * (2550 - zfm))) * (zfmArm - 87.5) )) + "%"
  document.getElementById("lmGraph").style.top = ((0.958 - (((lm - 1200) / 1350) * 0.9545)) * vertRng) + "px"
  document.getElementById("lmGraph").style.left = (41.0385 + ((7.4 - (0.0026096 * (2550 - lm))) * (lmArm - 87.5) )) + "%"
  document.getElementById("tomGraph").style.top = ((0.958 - (((tom - 1200) / 1350) * 0.9545)) * vertRng) + "px"
  document.getElementById("tomGraph").style.left = (41.0385 + ((7.4 - (0.0026096 * (2550 - tom))) * (tomArm - 87.5) )) + "%"
}

function unlock() {
  document.getElementById('inpFrnt').disabled = false
  document.getElementById('inpRear').disabled = false
  document.getElementById('inpBgge').disabled = false
  document.getElementById('inpFuel').disabled = false
  document.getElementById('inpBurn').disabled = false

  document.getElementById("unitTO").disabled = false
  document.getElementById("flapstoggle").disabled = false
  document.getElementById("airpSelect").disabled = false

  document.getElementById("unitLDG").disabled = false
  document.getElementById("airpSelectArr").disabled = false

  document.getElementById("zfmGraph").hidden = false
  document.getElementById("lmGraph").hidden = false
  document.getElementById("tomGraph").hidden = false
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
  zfmArm = (Math.round((zfmMom / zfm) * 10) / 10).toFixed(1)

  var fuelMom = fuelMass * 95

  tom = zfm + fuelMass - 8
  var tomMom = zfmMom + fuelMom - 760
  tomArm = (Math.round((tomMom / tom) * 10) / 10).toFixed(1)

  var burnMom = burnMass * -95

  lm = tom - burnMass
  var lmMom = tomMom + burnMom
  lmArm = (Math.round((lmMom / lm) * 10) / 10).toFixed(1)

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
  document.getElementById("txtZFM").innerHTML = Intl.NumberFormat().format(zfm)
  document.getElementById("txtZFMMom").innerHTML = Intl.NumberFormat().format(Math.floor(zfmMom + 0.5))

  document.getElementById("txtTOMArm").innerHTML = tomArm
  document.getElementById("txtTOM").innerHTML = Intl.NumberFormat().format(tom)
  document.getElementById("txtTOMMom").innerHTML = Intl.NumberFormat().format(Math.floor(tomMom + 0.5))

  document.getElementById("txtLMArm").innerHTML = lmArm
  document.getElementById("txtLM").innerHTML = Intl.NumberFormat().format(lm)
  document.getElementById("txtLMMom").innerHTML = Intl.NumberFormat().format(Math.floor(lmMom + 0.5))

  graphUpdate()

  if (document.getElementById("airpSelect").value != "unavail") {
    perfTO()
  }
  if (document.getElementById("airpSelectArr").value != "unavail") {
    perfLDG()
  }
}

document.getElementById("unitTO").addEventListener("change", perfTO)
document.getElementById("airpSelect").addEventListener("change", getDepMetar)
document.getElementById("airpSelect").addEventListener("change", depRunwayUpdate)
document.getElementById("rwySelect").addEventListener("change", perfTO)
document.getElementById("rwySelect").addEventListener("change", intxUpdate)
document.getElementById("intxSelect").addEventListener("change", perfTO)
document.getElementById("flapstoggle").addEventListener("click", perfTO)
document.getElementById("rwyCondDep").addEventListener("change", perfTO)

document.getElementById("unitLDG").addEventListener("change", perfLDG)
document.getElementById("airpSelectArr").addEventListener("change", getArrMetar)
document.getElementById("airpSelectArr").addEventListener("change", getArrTaf)
document.getElementById("airpSelectArr").addEventListener("change", arrRunwayUpdate)
document.getElementById("rwySelectArr").addEventListener("change", perfLDG)
document.getElementById("rwyCondArr").addEventListener("change", perfLDG)

function perfTO() {
  if (document.getElementById("unitTO").checked == true) {
    unitTO = "met"
  } else {
    unitTO = "imp"
  }

  var mass = tom || 2550

  var flaps = document.getElementById("flapstoggle").checked
  var elev = Number(airport[document.getElementById("airpSelect").value]["elevation"]) || 0
  var bearing = Number(runway[document.getElementById("rwySelect").value]["bearing"]) || 0
  var slope = Number(runway[document.getElementById("rwySelect").value]["slope"]) || 0.0
  var rwyCond = document.getElementById("rwyCondDep").value

  var press = Number(Math.floor(depMetar.data[0].barometer.hpa)) || 1013
  var temp = Number(depMetar.data[0].temperature.celsius) || 15

  var windDir = Number(depMetar.data[0].wind.degrees) || 0
  var windSpd = Number(depMetar.data[0].wind.speed_kts) || 0

  var angle = windDir - bearing
  var crosswind = Math.floor((windSpd * Math.sin(angle * (Math.PI / 180))) + 0.5)
  var headwind = Math.floor((windSpd * Math.cos(angle * (Math.PI / 180))) + 0.5)
  var wind = Math.floor((headwind / 2) + 0.5)
  var pressAlt = ((1013 - press) * 30) + elev

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

  if (unitTO == "met") {
    todr = Math.floor((todr / 3.285) + 0.5)
  }

  document.getElementById("TOResults").style.display = "block"
  document.getElementById("txtDepPressAlt").style.display = "block"
  document.getElementById("txtDepPressAlt").innerHTML = "Pressure Altitude: " + pressAlt + " ft"
  document.getElementById("txtDepWindComp").innerHTML = "Headwind: " + headwind + " Crosswind: " + crosswind

  if (unitTO == "met") {
    document.getElementById("txtTODR").innerHTML = Intl.NumberFormat().format(todr) + " m"
    document.getElementById("txtTODR125").innerHTML = Intl.NumberFormat().format(Math.floor((todr * 1.25) + 0.5)) + " m"
    document.getElementById("txtTODR115").innerHTML = Intl.NumberFormat().format(Math.floor((todr * 1.15) + 0.5)) + " m"
    document.getElementById("txtTODR130").innerHTML = Intl.NumberFormat().format(Math.floor((todr * 1.30) + 0.5)) + " m"
  } else {
    document.getElementById("txtTODR").innerHTML = Intl.NumberFormat().format(todr) + " ft"
    document.getElementById("txtTODR125").innerHTML = Intl.NumberFormat().format(Math.floor((todr * 1.25) + 0.5)) + " ft"
    document.getElementById("txtTODR115").innerHTML = Intl.NumberFormat().format(Math.floor((todr * 1.15) + 0.5)) + " ft"
    document.getElementById("txtTODR130").innerHTML = Intl.NumberFormat().format(Math.floor((todr * 1.30) + 0.5)) + " ft"
  }
}

function perfLDG() {
  if (document.getElementById("unitLDG").checked == true) {
    unitLDG = "met"
  } else {
    unitLDG = "imp"
  }
  var mass = lm || 2550
  var elev = Number(airport[document.getElementById("airpSelectArr").value]["elevation"]) || 0
  var bearing = Number(runway[document.getElementById("rwySelectArr").value]["bearing"]) || 0
  var slope = Number(runway[document.getElementById("rwySelectArr").value]["slope"]) || 0.0
  var rwyCond = document.getElementById("rwyCondArr").value

  var press = Number(Math.floor(arrMetar.data[0].barometer.hpa)) || 1013
  var temp = Number(arrMetar.data[0].temperature.celsius) || 15

  var windDir = Number(arrMetar.data[0].wind.degrees) || 0
  var windSpd = Number(arrMetar.data[0].wind.speed_kts) || 0

  var angle = windDir - bearing
  var crosswind = Math.floor((windSpd * Math.sin(angle * (Math.PI / 180))) + 0.5)
  var headwind = Math.floor((windSpd * Math.cos(angle * (Math.PI / 180))) + 0.5)
  var wind = Math.floor((headwind / 2) + 0.5)
  var pressAlt = ((1013 - press) * 30) + elev

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

  if (unitLDG == "met") {
    ldr = Math.floor((ldr / 3.285) + 0.5)
  } 

  document.getElementById("LDGResults").style.display = "block"
  document.getElementById("txtArrPressAlt").style.display = "block"
  document.getElementById("txtArrPressAlt").innerHTML = "Pressure Altitude: " + pressAlt + " ft"
  document.getElementById("txtArrWindComp").innerHTML = "Headwind: " + headwind + " Crosswind: " + crosswind

  if (unitLDG == "met") {
    document.getElementById("txtLDR").innerHTML = Intl.NumberFormat().format(ldr) + " m"
    document.getElementById("txtLDR143").innerHTML = Intl.NumberFormat().format(Math.floor((ldr * 1.43) + 0.5)) + " m"
  } else {
    document.getElementById("txtLDR").innerHTML = Intl.NumberFormat().format(ldr) + " ft"
    document.getElementById("txtLDR143").innerHTML = Intl.NumberFormat().format(Math.floor((ldr * 1.43) + 0.5)) + " ft"
  }
}