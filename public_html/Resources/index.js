window.onload = getMetar()
window.onload = getEGTCTaf()
window.onload = getEGSCTaf()
window.onload = getEGTKTaf()
window.onload = getEGBJTaf()

function getMetar() {
    var egtcMetar = new XMLHttpRequest()
    egtcMetar.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText);

            document.getElementById('txtEGBJMetar').innerHTML = "METAR " + result.data[0]
            document.getElementById('txtEGSCMetar').innerHTML = "METAR " + result.data[1]
            document.getElementById('txtEGTCMetar').innerHTML = "METAR " + result.data[2]
            document.getElementById('txtEGTKMetar').innerHTML = "METAR " + result.data[3]
        }
    };
    egtcMetar.open("GET", "https://api.checkwx.com/metar/EGTC,EGSC,EGBJ,EGTK", true)
    egtcMetar.setRequestHeader('X-API-Key', '6f5de2372b0543bc9959c51695')
    egtcMetar.send()
}

function getEGTCTaf() {
    var egtcTaf = new XMLHttpRequest()
    egtcTaf.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText);
            document.getElementById('txtEGTCTaf').innerHTML = "TAF " + result.raw
        }
    };
    egtcTaf.open("GET", "https://avwx.rest/api/taf/EGTC", true)
    egtcTaf.setRequestHeader('Authorization', 'vTzmtdwxOfCF21hIR6YeeL9WF-JVSKTZHBBgv5boIBc')
    egtcTaf.send()
}
function getEGSCTaf() {
    var xlmhttp = new XMLHttpRequest()
    xlmhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText);
            document.getElementById('txtEGSCTaf').innerHTML = "TAF " + result.raw
        }
    };
    xlmhttp.open("GET", "https://avwx.rest/api/taf/EGSC", true)
    xlmhttp.setRequestHeader('Authorization', 'vTzmtdwxOfCF21hIR6YeeL9WF-JVSKTZHBBgv5boIBc')
    xlmhttp.send()
}
function getEGTKTaf() {
    var xlmhttp = new XMLHttpRequest()
    xlmhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText);
            document.getElementById('txtEGTKTaf').innerHTML = "TAF " + result.raw
        }
    };
    xlmhttp.open("GET", "https://avwx.rest/api/taf/EGTK", true)
    xlmhttp.setRequestHeader('Authorization', 'vTzmtdwxOfCF21hIR6YeeL9WF-JVSKTZHBBgv5boIBc')
    xlmhttp.send()
}
function getEGBJTaf() {
    var xlmhttp = new XMLHttpRequest()
    xlmhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText);
            document.getElementById('txtEGBJTaf').innerHTML = "TAF " + result.raw
        }
    };
    xlmhttp.open("GET", "https://avwx.rest/api/taf/EGBJ", true)
    xlmhttp.setRequestHeader('Authorization', 'vTzmtdwxOfCF21hIR6YeeL9WF-JVSKTZHBBgv5boIBc')
    xlmhttp.send()
}