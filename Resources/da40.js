var unitTO = "imp"
var unitLDG = "imp"
var aircraft

var airport
var selAirport
var selArrAirport

var runway
var selRunway

var arrRunway
var selArrRunway

var intx

var depMetar
var arrMetar

var zfm = 1200
var zfmArm = 87.5
var tom = 1200
var tomArm = 87.5
var lm = 1200
var lmArm = 87.5

window.onload = alert("Caution!\n This is to be used to confirm that data is correct.\n Do not use this as a substitute to the laminated pack.")

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
xmlhttp.open("GET", "Resources/da40AircraftData.json", true)
xmlhttp.send()

var airportGet = new XMLHttpRequest()
airportGet.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    airport = JSON.parse(this.responseText)
    airport = airport.sort(function(a, b) {
      var icaoA = a.name.toUpperCase()
      var icaoB = b.name.toUpperCase()

      if (icaoA < icaoB) {
        return -1
      }
      if (icaoA > icaoB) {
        return 1
      }

      return 0
    })

    for(var i = 0; i < airport.length; i++) {
      var opt = document.createElement('option')
      opt.innerHTML = airport[i]['icao'] + " " + airport[i]['name']
      opt.value = [i]
  
      document.getElementById('airpSelect').appendChild(opt)
    }
    for(var i = 0; i < airport.length; i++) {
      var opt = document.createElement('option')
      opt.innerHTML = airport[i]['icao'] + " " + airport[i]['name']
      opt.value = [i]
  
      document.getElementById('airpSelectArr').appendChild(opt)
    }

  }
}
airportGet.open("GET", "Resources/airportData.json", true)
airportGet.send()

function SelectDepAirport() {
  selAirport = {}

  selAirport = airport[document.getElementById("airpSelect").value]

  getDepMetar()

  var sel = document.getElementById('rwySelect')
  for (i = sel.options.length-1; i >= 1; i--) {
    sel.options[i] = null;
  }

  runway = selAirport.runways
  for(var i = 0; i < runway.length; i++) {
    var opt = document.createElement('option')
    opt.innerHTML = "RWY " + runway[i]['name']
    opt.value = [i]
    sel.appendChild(opt)
  }

  document.getElementById("TOResults").style.display = "none"
  document.getElementById("txtDepPressAlt").style.display = "none"
  document.getElementById("txtDepWindComp").style.display = "none"
  document.getElementById("manDepEntry").style.display = "none"
  document.getElementById("inpPressDep").disabled = true
  document.getElementById("inpPressDep").value = ""
  document.getElementById("inpTempDep").disabled = 
  document.getElementById("inpTempDep").value = ""
  document.getElementById("inpWindDep").disabled = true
  document.getElementById("inpWindDep").value = ""
  document.getElementById("rwySelect").disabled = false
  document.getElementById("rwySelect").value = 0
  document.getElementById("intxSelect").disabled = true
  document.getElementById("intxSelect").value = "unavail"
}

function SelectDepRunway() {
  selRunway = {}

  selRunway = selAirport.runways[document.getElementById("rwySelect").value]

  var sel = document.getElementById('intxSelect')
  for (i = sel.options.length-1; i >= 1; i--) {
    sel.options[i] = null;
  }

  intx = selRunway.intx

  if (intx.length != 0) {
    for(var i = 0; i < intx.length; i++) {
      var opt = document.createElement('option')
      opt.innerHTML = intx[i]['name']
      opt.value = [i]
      sel.appendChild(opt)
    }
    document.getElementById("intxSelect").disabled = false
    document.getElementById("intxSelect").value = "unavail"
  } else {
    document.getElementById("intxSelect").disabled = true
    document.getElementById("intxSelect").value = "unavail"
  }

  perfTO()
}

function SelectArrAirport() {
  selArrAirport = {}

  selArrAirport = airport[document.getElementById("airpSelectArr").value]

  getArrMetar()
  getArrTaf()

  var sel = document.getElementById('rwySelectArr')
  for (i = sel.options.length-1; i >= 1; i--) {
    sel.options[i] = null;
  }

  arrRunway = selArrAirport.runways
  for(var i = 0; i < arrRunway.length; i++) {
    var opt = document.createElement('option')
    opt.innerHTML = "RWY " + arrRunway[i]['name']
    opt.value = [i]
    sel.appendChild(opt)
  }

  document.getElementById("LDGResults").style.display = "none"
  document.getElementById("txtArrPressAlt").style.display = "none"
  document.getElementById("txtArrWindComp").style.display = "none"
  document.getElementById("manArrEntry").style.display = "none"
  document.getElementById("inpPressArr").disabled = true
  document.getElementById("inpPressArr").value = ""
  document.getElementById("inpTempArr").disabled = true
  document.getElementById("inpTempArr").value = ""
  document.getElementById("inpWindArr").disabled = true
  document.getElementById("inpWindArr").value = ""
  document.getElementById("rwySelectArr").disabled = false
  document.getElementById("rwySelectArr").value = 0
  document.getElementById("rwyCondArr").disabled = true
  document.getElementById("rwyCondArr").value = 0
}

function SelectArrRunway() {
  selArrRunway = {}

  selArrRunway = selArrAirport.runways[document.getElementById("rwySelectArr").value]

  document.getElementById("rwyCondArr").disabled = false

  perfLDG()
}

function getDepMetar() {
  var icao = selAirport.icao
  var metar = new XMLHttpRequest()
  metar.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          result = JSON.parse(this.responseText)
          depMetar = result

          if (depMetar.data[0] != null) {
            document.getElementById("txtMetarDep").innerHTML = "METAR " + depMetar.data[0].raw_text
            document.getElementById("txtMetarDep").style.display = "block"
          } else {
            document.getElementById("txtMetarDep").innerHTML = "METAR Unavail"
            document.getElementById("txtMetarDep").style.display = "none"
            document.getElementById("manDepEntry").style.display = "block"

            document.getElementById("inpPressDep").disabled = false
            document.getElementById("inpTempDep").disabled = false
            document.getElementById("inpWindDep").disabled = false
          }
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

          if (arrMetar.data[0] != null) {
            document.getElementById("txtMetarArr").innerHTML = "METAR " + arrMetar.data[0].raw_text
            document.getElementById("txtMetarArr").style.display = "block"
            document.getElementById("txtTafArr").style.display = "block"
          } else {
            document.getElementById("txtMetarArr").innerHTML = "METAR Unavail"
            document.getElementById("txtMetarArr").style.display = "none"
            document.getElementById("txtTafArr").style.display = "none"
            document.getElementById("manArrEntry").style.display = "block"

            document.getElementById("inpPressArr").disabled = false
            document.getElementById("inpTempArr").disabled = false
            document.getElementById("inpWindArr").disabled = false
          }
          document.getElementById("metarBoxArr").style.display = "block"
      }
  };
  metar.open("GET", "https://api.checkwx.com/metar/" + icao + "/decoded", true)
  metar.setRequestHeader('X-API-Key', '6f5de2372b0543bc9959c51695')
  metar.send()
}

function getArrTaf() {
  icao = selArrAirport.icao
  var taf = new XMLHttpRequest()
  taf.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          result = JSON.parse(this.responseText)

          if (result.raw != null) {
            document.getElementById('txtTafArr').innerHTML = "TAF " + result.raw
          } else {
            document.getElementById('txtTafArr').innerHTML = "TAF Unavail"
          }
      }
  };
  taf.open("GET", "https://avwx.rest/api/taf/" + icao, true)
  taf.setRequestHeader('Authorization', 'vTzmtdwxOfCF21hIR6YeeL9WF-JVSKTZHBBgv5boIBc')
  taf.send()
}

function unlock() {
  document.getElementById('inpFrnt').disabled = false
  document.getElementById('inpRear').disabled = false
  document.getElementById('inpStdB').disabled = false
  document.getElementById('inpBgTb').disabled = false
  document.getElementById('inpShBge').disabled = false
  document.getElementById('inpFwdBge').disabled = false
  document.getElementById('inpAftBge').disabled = false
  document.getElementById('inpFuel').disabled = false
  document.getElementById('inpBurn').disabled = false

  document.getElementById("unitTO").disabled = false
  document.getElementById("airpSelect").disabled = false

  document.getElementById("unitLDG").disabled = false
  document.getElementById("airpSelectArr").disabled = false
}

document.getElementById("aircraftSelect").addEventListener("change", updatePlane)
document.getElementById("aircraftSelect").addEventListener("change", unlock)
document.getElementById("inpBem").addEventListener("keyup", unlock)
document.getElementById("inpBem").addEventListener("keyup", maths)
document.getElementById("inpMom").addEventListener("keyup", unlock)
document.getElementById("inpMom").addEventListener("keyup", maths)
document.getElementById("inpFrnt").addEventListener("keyup", maths)
document.getElementById("inpRear").addEventListener("keyup", maths)
document.getElementById("inpStdB").addEventListener("keyup", maths)
document.getElementById("inpBgTb").addEventListener("keyup", maths)
document.getElementById("inpShBge").addEventListener("keyup", maths)
document.getElementById("inpFwdBge").addEventListener("keyup", maths)
document.getElementById("inpAftBge").addEventListener("keyup", maths)
document.getElementById("inpFuel").addEventListener("keyup", maths)
document.getElementById("inpBurn").addEventListener("keyup", maths)

function updatePlane() {

  if (document.getElementById("aircraftSelect").value != ""&&document.getElementById("aircraftSelect").value != "other") {
    document.getElementById("inpBem").value = aircraft[document.getElementById("aircraftSelect").value].mass
    document.getElementById("inpMom").value = aircraft[document.getElementById("aircraftSelect").value].moment
    document.getElementById("inpArm").value = aircraft[document.getElementById("aircraftSelect").value].arm
  } else {
    document.getElementById("inpBem").value = ""
    document.getElementById("inpMom").value = ""
    document.getElementById("inpArm").value = ""
  }

  maths()
}

function maths() {
  var bem = Number(document.getElementById("inpBem").value)
  var bemmom = Number(document.getElementById("inpMom").value)

  var frntMass = Number(document.getElementById("inpFrnt").value)
  var rearMass = Number(document.getElementById("inpRear").value)
  var stdBMass = Number(document.getElementById("inpStdB").value)
  var bgTbMass = Number(document.getElementById("inpBgTb").value)
  var shBgeMass = Number(document.getElementById("inpShBge").value)
  var fwdBgeMass = Number(document.getElementById("inpFwdBge").value)
  var aftBgeMass = Number(document.getElementById("inpAftBge").value)
  var fuelMass = Number(document.getElementById("inpFuel").value)
  var burnMass = Number(document.getElementById("inpBurn").value)

  var frntMom = frntMass * 2.3
  var rearMom = rearMass * 3.25

  var stdBMom = stdBMass * 3.65
  var bgTbMom = bgTbMass * 4.32
  var shBgeMom = shBgeMass * 3.97
  var fwdBgeMom = fwdBgeMass * 3.89
  var aftBgeMom = aftBgeMass * 4.54

  zfm = bem + frntMass + rearMass + stdBMass + bgTbMass + shBgeMass + fwdBgeMass + aftBgeMass
  var zfmMom = bemmom + frntMom + rearMom + stdBMom + bgTbMom + shBgeMom + fwdBgeMom + aftBgeMom
  zfmArm = zfmMom / zfm

  var fuelMom = fuelMass * 2.63

  tom = zfm + fuelMass
  var tomMom = zfmMom + fuelMom
  tomArm = tomMom / tom

  var burnMom = burnMass * -2.63

  lm = tom - burnMass
  var lmMom = tomMom + burnMom
  lmArm = lmMom / lm

  if (frntMom != 0) {
    document.getElementById("txtFrntMom").innerHTML = Intl.NumberFormat().format((frntMom).toFixed(1))
  } else {
    document.getElementById("txtFrntMom").innerHTML = ""
  }
  if (rearMom != 0) {
    document.getElementById("txtRearMom").innerHTML = Intl.NumberFormat().format((rearMom).toFixed(1))
  } else {
    document.getElementById("txtRearMom").innerHTML = ""
  }
  if (stdBMom != 0) {
    document.getElementById("txtStdBMom").innerHTML = Intl.NumberFormat().format((stdBMom).toFixed(1))
  } else {
    document.getElementById("txtStdBMom").innerHTML = ""
  }
  if (bgTbMom != 0) {
    document.getElementById("txtBgTbMom").innerHTML = Intl.NumberFormat().format((bgTbMom).toFixed(1))
  } else {
    document.getElementById("txtBgTbMom").innerHTML = ""
  }
  if (shBgeMom != 0) {
    document.getElementById("txtShBgeMom").innerHTML = Intl.NumberFormat().format((shBgeMom).toFixed(1))
  } else {
    document.getElementById("txtShBgeMom").innerHTML = ""
  }
  if (fwdBgeMom != 0) {
    document.getElementById("txtFwdBgeMom").innerHTML = Intl.NumberFormat().format((fwdBgeMom).toFixed(1))
  } else {
    document.getElementById("txtFwdBgeMom").innerHTML = ""
  }
  if (aftBgeMom != 0) {
    document.getElementById("txtAftBgeMom").innerHTML = Intl.NumberFormat().format((aftBgeMom).toFixed(1))
  } else {
    document.getElementById("txtAftBgeMom").innerHTML = ""
  }
  if (fuelMom != 0) {
    document.getElementById("txtFuelMom").innerHTML = Intl.NumberFormat().format((fuelMom).toFixed(1))
  } else {
    document.getElementById("txtFuelMom").innerHTML = ""
  }
  if (burnMom != 0) {
    document.getElementById("txtBurnMom").innerHTML = Intl.NumberFormat().format((burnMom).toFixed(1))
  } else {
    document.getElementById("txtBurnMom").innerHTML = ""
  }

  document.getElementById("txtZFMArm").innerHTML = zfmArm.toFixed(3)
  document.getElementById("txtZFM").innerHTML = Intl.NumberFormat().format(zfm)
  document.getElementById("txtZFMMom").innerHTML = Intl.NumberFormat().format((zfmMom).toFixed(1))

  document.getElementById("txtTOMArm").innerHTML = tomArm.toFixed(3)
  document.getElementById("txtTOM").innerHTML = Intl.NumberFormat().format(tom)
  document.getElementById("txtTOMMom").innerHTML = Intl.NumberFormat().format((tomMom).toFixed(1))

  document.getElementById("txtLMArm").innerHTML = lmArm.toFixed(3)
  document.getElementById("txtLM").innerHTML = Intl.NumberFormat().format(lm)
  document.getElementById("txtLMMom").innerHTML = Intl.NumberFormat().format((lmMom).toFixed(1))

  if (document.getElementById("airpSelect").value != "unavail") {
    perfTO()
  }
  if (document.getElementById("airpSelectArr").value != "unavail") {
    perfLDG()
  }
}

document.getElementById("unitTO").addEventListener("change", perfTO)
document.getElementById("airpSelect").addEventListener("change", SelectDepAirport)
document.getElementById("rwySelect").addEventListener("change", SelectDepRunway)
document.getElementById("intxSelect").addEventListener("change", perfTO)
document.getElementById("inpPressDep").addEventListener("keyup", perfTO)
document.getElementById("inpTempDep").addEventListener("keyup", perfTO)
document.getElementById("inpWindDep").addEventListener("keyup", perfTO)

document.getElementById("unitLDG").addEventListener("change", perfLDG)
document.getElementById("airpSelectArr").addEventListener("change", SelectArrAirport)
document.getElementById("rwySelectArr").addEventListener("change", SelectArrRunway)
document.getElementById("rwyCondArr").addEventListener("change", perfLDG)
document.getElementById("inpPressArr").addEventListener("keyup", perfLDG)
document.getElementById("inpTempArr").addEventListener("keyup", perfLDG)
document.getElementById("inpWindArr").addEventListener("keyup", perfLDG)

function perfTO() {
  var mass = tom || 1310
  
  if (document.getElementById("unitTO").checked == true) {
    unitTO = "met"
  } else {
    unitTO = "imp"
  }

  var elev = Number(selAirport.elevation) || 0
  var bearing = Number(selRunway.bearing) || 0

  var tora = Number(selRunway.tora)
  var toda = Number(selRunway.toda)
  var asda = Number(selRunway.asda)


  if (document.getElementById("intxSelect").value != "unavail"){
    var intxAdjust = Number(intx[document.getElementById("intxSelect").value]["adjust"])
  } else {
    var intxAdjust = 0
  }

  tora = tora - intxAdjust
  toda = toda - intxAdjust
  asda = asda - intxAdjust

  if (depMetar.data[0] != null) {
    var press = Number(Math.floor(depMetar.data[0].barometer.hpa))
    var temp = Number(depMetar.data[0].temperature.celsius)

    if (depMetar.data[0].wind != null) {
      var windDir = Number(depMetar.data[0].wind.degrees)
      var windSpd = Number(depMetar.data[0].wind.speed_kts)
    } else {
      var windDir = 0
      var windSpd = 0
    }


    var angle = windDir - bearing
    var crosswind = Math.abs(Math.floor((windSpd * Math.sin(angle * (Math.PI / 180))) + 0.5))
    var headwind = Math.floor((windSpd * Math.cos(angle * (Math.PI / 180))) + 0.5)
    var wind = Math.floor((headwind / 2) + 0.5)
  } else {
    var press = Number(document.getElementById("inpPressDep").value) || 1013
    var temp = Number(document.getElementById("inpTempDep").value) || 15

    var wind = Number(document.getElementById("inpWindDep").value) || 0
  }

  var pressAlt = ((1013 - press) * 30) + elev

  // Calculate raw Take off Distance(tod)
  if (mass > 1310) { 
    var tod = (6.04752 * Math.cos(0.110304 * temp)) + (3.44116 * temp) + 543.674 // 1310
  } else if (mass > 1280 && mass <= 1310) {
    let upper = (6.04752 * Math.cos(0.110304 * temp)) + (3.44116 * temp) + 543.674 // 1310
    let lower = (6.04752 * Math.cos(0.110304 * temp)) + (3.44116 * temp) + 533.674 // 1280

    var tod = lower + ((mass - 1280) * ((upper - lower) / 30))
  } else if (mass >= 1200 && mass <= 1280) {
    let upper = (6.04752 * Math.cos(0.110304 * temp)) + (3.44116 * temp) + 533.674 // 1280
    let lower = (6.02705 * Math.cos(0.132884 * temp)) + (2.98482 * temp) + 485.848 // 1200

    var tod = lower + ((mass - 1200) * ((upper - lower) / 80))
  } else if (mass >= 1100 && mass < 1200) {
    let upper = (6.02705 * Math.cos(0.132884 * temp)) + (2.98482 * temp) + 485.848 // 1200
    let lower = (8.36743 * Math.cos(0.123274 * temp)) + (2.61074 * temp) + 421.793 // 1100

    var tod = lower + ((mass - 1100) * ((upper - lower) / 100))
  } else if (mass < 1100) {
    var tod = (8.36743 * Math.cos(0.123274 * temp)) + (2.61074 * temp) + 421.793 // 1100
  }

  // Calculate wind variation(windVar) based on headwind or tailwind
  if (wind >= 0) {
    var windVar = -1 * (wind / 12)
  } else {
    var windVar = -1 * (wind / 2)
  }

  // Add 30m for no wheel fairings and wind correction (+-10% for each windVar)
  var todr = (Math.floor((tod + ((0.1 * tod) * windVar)) + 0.5)) + 30

  // Convert to feet if necessary
  if (unitTO == "imp") {
    todr = Math.floor((todr * 3.285) + 0.5)
  }

  // Display results
  document.getElementById("TOResults").style.display = "block"

  if ((todr * 1.25) < tora) {
    document.getElementById("toBalanced").style.display = "block"
    document.getElementById("toUnbalanced").style.display = "none"
  } else {
    document.getElementById("toUnbalanced").style.display = "block"
    document.getElementById("toBalanced").style.display = "none"
  }

  if (depMetar.data[0] != null) {
    document.getElementById("txtDepWindComp").style.display = "block"
    document.getElementById("txtDepWindComp").innerHTML = "Headwind: " + headwind + " kts Crosswind: " + crosswind + " kts"
  }

  document.getElementById("txtDepPressAlt").style.display = "block"
  document.getElementById("txtDepPressAlt").innerHTML = "Pressure Altitude: " + pressAlt + " ft"

  if (unitTO == "met") {
    document.getElementById("txtTODR").innerHTML = "<strong>" + Intl.NumberFormat().format(Number(todr)) + " m</strong>"
    document.getElementById("txtTODRU").innerHTML = "<strong>" + Intl.NumberFormat().format(Number(todr)) + " m </strong>≤ TORA " + Intl.NumberFormat().format(tora) + " m"
    document.getElementById("txtTODR125").innerHTML = "<strong>" + Intl.NumberFormat().format(Math.floor((todr * 1.25) + 0.5)) + " m </strong>≤ TORA " + Intl.NumberFormat().format(tora) + " m"
    document.getElementById("txtTODR115").innerHTML = "<strong>" + Intl.NumberFormat().format(Math.floor((todr * 1.15) + 0.5)) + " m </strong>≤ TODA " + Intl.NumberFormat().format(toda) + " m"
    document.getElementById("txtTODR130").innerHTML = "<strong>" + Intl.NumberFormat().format(Math.floor((todr * 1.30) + 0.5)) + " m </strong>≤ ASDA " + Intl.NumberFormat().format(asda) + " m"
  } else {
    document.getElementById("txtTODR").innerHTML = "<strong>" + Intl.NumberFormat().format(Number(todr)) + " ft"
    document.getElementById("txtTODRU").innerHTML = "<strong>" + Intl.NumberFormat().format(Number(todr)) + " ft </strong>≤ TORA " + Intl.NumberFormat().format(Math.floor((tora * 3.285) + 0.5)) + " ft"
    document.getElementById("txtTODR125").innerHTML = "<strong>" + Intl.NumberFormat().format(Math.floor((todr * 1.25) + 0.5)) + " ft </strong>≤ TORA " + Intl.NumberFormat().format(Math.floor((tora * 3.285) + 0.5)) + " ft"
    document.getElementById("txtTODR115").innerHTML = "<strong>" + Intl.NumberFormat().format(Math.floor((todr * 1.15) + 0.5)) + " ft </strong>≤ TODA " + Intl.NumberFormat().format(Math.floor((toda * 3.285) + 0.5)) + " ft"
    document.getElementById("txtTODR130").innerHTML = "<strong>" + Intl.NumberFormat().format(Math.floor((todr * 1.30) + 0.5)) + " ft </strong>≤ ASDA " + Intl.NumberFormat().format(Math.floor((asda * 3.285) + 0.5)) + " ft"
  }
}

function perfLDG() {

  if (document.getElementById("unitLDG").checked == true) {
    unitLDG = "met"
  } else {
    unitLDG = "imp"
  }
  var mass = lm || Number(type)

  var elev = Number(selArrAirport.elevation) || 0
  var bearing = Number(selArrRunway.bearing) || 0
  var slope = Number(selArrRunway.slope) || 0.0
  var rwyCond = document.getElementById("rwyCondArr").value

  var lda = Number(selArrRunway.lda)

  if (arrMetar.data[0] != null) {
    var press = Number(Math.floor(arrMetar.data[0].barometer.hpa))
    var temp = Number(arrMetar.data[0].temperature.celsius)
  
    if (arrMetar.data[0].wind != null) {
      var windDir = Number(arrMetar.data[0].wind.degrees)
      var windSpd = Number(arrMetar.data[0].wind.speed_kts)
    } else {
      var windDir = 0
      var windSpd = 0
    }

    var angle = windDir - bearing
    var crosswind = Math.abs(Math.floor((windSpd * Math.sin(angle * (Math.PI / 180))) + 0.5))
    var headwind = Math.floor((windSpd * Math.cos(angle * (Math.PI / 180))) + 0.5)
    var wind = Math.floor((headwind / 2) + 0.5)
  } else {
    var press = Number(document.getElementById("inpPressArr").value) || 1013
    var temp = Number(document.getElementById("inpTempArr").value) || 15

    var wind = Number(document.getElementById("inpWindArr").value) || 0
  }

  var pressAlt = ((1013 - press) * 30) + elev

  // Calculate raw Landing Distance(ld)
  if (mass > 1310) {
    var ld = (25.6735 * Math.cos(0.0806753 * temp)) + (3.64901 * temp) + 595.214 // 1310
  } else if (mass > 1280 && mass <= 1310) {
    let upper = (25.6735 * Math.cos(0.0806753 * temp)) + (3.64901 * temp) + 595.214 // 1310
    let lower = (12.095 * Math.cos(0.110304 * temp)) + (2.88233 * temp) + 597.347 // 1280

    var ld = lower + ((mass - 1280) * ((upper - lower) / 30))
  } else if (mass >= 1200 && mass <= 1280) {
    let upper = (12.095 * Math.cos(0.110304 * temp)) + (2.88233 * temp) + 597.347 // 1280
    let lower = (12.1214 * Math.cos(0.0966832 * temp)) + (2.82447 * temp) + 586.832 // 1200

    var ld = lower + ((mass - 1200) * ((upper - lower) / 80))
  } else if (mass >= 1100 && mass < 1200) {
    let upper = (12.1214 * Math.cos(0.0966832 * temp)) + (2.82447 * temp) + 586.832 // 1200
    let lower = (16.373 * Math.cos(0.0969015 * temp)) + (2.90098 * temp) + 573.5 // 1100

    var ld = lower + ((mass - 1100) * ((upper - lower) / 100))
  } else if (mass < 1100) {
    var ld = (16.373 * Math.cos(0.0969015 * temp)) + (2.90098 * temp) + 573.5 // 1100
  }

  // Calculate wind variation(windVar) based on headwind or tailwind
  if (wind >= 0) {
    var windVar = -1 * (wind / 20)
  } else {
    var windVar = -1 * (wind / 3)
  }

  // Add wind variation(windVar) and wet runway factor - 15%
  if (rwyCond == 0) {
    var ldr = Math.floor((ld + ((0.1 * ld) * windVar)) + 0.5)
  } else if (rwyCond == 1) {
    var ldr = Math.floor(((ld + ((0.1 * ld) * windVar)) * 1.15) + 0.5)
  }

  // Convert to feet if necessary
  if (unitLDG == "imp") {
    ldr = Math.floor((ldr * 3.285) + 0.5)
  } 

  // Display results
  document.getElementById("LDGResults").style.display = "block"
  if (arrMetar.data[0] != null) {
    document.getElementById("txtArrWindComp").style.display = "block"
    document.getElementById("txtArrWindComp").innerHTML = "Headwind: " + headwind + " kts Crosswind: " + crosswind + " kts"
  }

  document.getElementById("txtArrPressAlt").style.display = "block"
  document.getElementById("txtArrPressAlt").innerHTML = "Pressure Altitude: " + pressAlt + " ft"

  if (unitLDG == "met") {
    document.getElementById("txtLDR").innerHTML = "<strong>" + Intl.NumberFormat().format(ldr) + " m</strong>"
    document.getElementById("txtLDR143").innerHTML = "<strong>" + Intl.NumberFormat().format(Math.floor((ldr * 1.43) + 0.5)) + " m </strong>≤ LDA " + Intl.NumberFormat().format(lda) + " m"
  } else {
    document.getElementById("txtLDR").innerHTML = "<strong>" + Intl.NumberFormat().format(ldr) + " ft</strong>"
    document.getElementById("txtLDR143").innerHTML = "<strong>" + Intl.NumberFormat().format(Math.floor((ldr * 1.43) + 0.5)) + " ft </strong>≤ LDA " + Intl.NumberFormat().format(Math.floor((lda * 3.285) + 0.5)) + " ft"
  }
}