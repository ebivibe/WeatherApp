function Generate(lat, lon, form){
    alert("working");
    form.coordinates.value="("+lat+", "+lon+")";
            var request = new XMLHttpRequest();
            // Open a new connection, using the GET request on the URL endpoint
            var x='http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&APPID='+keynums;
            request.open('GET', x , true);
            request.onload = function () {
                
                var data = JSON.parse(this.response);
                
                form.location.value=data.name;

                form.temp.value=String(parseFloat(data.main.temp)-273.15);
    
                form.forecast.value=data.weather[0].description;
                
            }
            request.send();
}