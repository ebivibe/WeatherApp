function Generate(lat, lon, form){
             request = new XMLHttpRequest();
            // Open a new connection, using the GET request on the URL endpoint
            var x='http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&APPID=0849d2b7e2fadff537a5e0e8d2eff1c8';
            ;
            request.open('GET', x , true);
            request.onload = function () {
                
                var data = JSON.parse(this.response).list;
                
                console.log(data);
                play("mid_c");
                
            }
            request.send();
}

function play(note){
    document.getElementById(note).play();
    wait(1000)
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
      document.getElementById("progress").style.width = document.getElementById("progress").style.width+100/ms+"%";
        console.log(document.getElementById("progress").style.width);
    }
   document.getElementById("progress").style.width = "100%";
 }