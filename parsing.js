function Generate(loc, form) {
    request = new XMLHttpRequest();
    var req = 'https://us1.locationiq.com/v1/search.php?key=2be3ee39b1a582&q='+ loc + '&format=json';
    request.open('GET', req, true);
    request.onload = function () {

        var data = JSON.parse(this.response);
        lon = data[0].lon;
        lat = data[0].lat;
        request2 = new XMLHttpRequest();
        // Open a new connection, using the GET request on the URL endpoint
        var x = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&APPID=0849d2b7e2fadff537a5e0e8d2eff1c8';
        request2.open('GET', x, true);
        request2.onload = function () {
            var data2 = JSON.parse(this.response).list;
            alert(data2[0].weather[0].description);
            //TO DO: add actual parsing here 
        }
        request2.send();

    }
    request.send();


}

function play(note) {
    document.getElementById(note).play();
    wait(1000)
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
        document.getElementById("progress").style.width = document.getElementById("progress").style.width + 100 / ms + "%";
        console.log(document.getElementById("progress").style.width);
    }
    document.getElementById("progress").style.width = "100%";
}