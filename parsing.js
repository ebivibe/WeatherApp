var piano = Synth.createInstrument('piano');

function Generate(loc, form) {
    document.getElementById("progress").style.width = "0%";
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
            var params = getParams(data2);
            var music = generateMusic(data2, params[0]);
            var bpm = params[1];
            for (var i = 0; i < music.length; i++) {
                if(music[i].substring(0, 1)=="0"){
                    eighth(music[i].substring(1, music[i].length-1),music[i].substring(music[i].length-1), bpm);
                }
                else if(music[i].substring(0, 1)=="1"){
                    quarter(music[i].substring(1, music[i].length-1),music[i].substring(music[i].length-1), bpm);
                } 
                else if(music[i].substring(0, 1)=="0"){
                    half(music[i].substring(1, music[i].length-1),music[i].substring(music[i].length-1), bpm);
                }
                else{
                    whole(music[i].substring(1, music[i].length-1),music[i].substring(music[i].length-1), bpm);
                }
            }
            
            document.getElementById("progress").style.width = "100%";
        }
        request2.send();

    }
    request.send();


}

// Accepts a hex digest of a sha512 hash and parses that into music information
function parseHash(data, notes) {
    var musicData = [];
    for (var i = 0; i < data.length-2; i+=3) {
        var lengths = parseInt(data.charAt(i), 16);
        var first_note = parseInt(data.charAt(i+1), 16);
        var second_note = parseInt(data.charAt(i+2), 16);
        var first_length = (lengths & 12) >> 2; // 12 = 1100
        var second_length = lengths & 3; // 3 = 0011
        musicData.push(first_length + notes[first_note]);
        musicData.push(second_length + notes[second_note]);
    }
    return musicData;
}

/*
* 
*/
function generateMusic(data, notes){
    
    var music = []
    for (var i = 0; i<data.length; i++){
        music = music.concat(parseHash(hash(data), notes));
    }
    return music;

}


function hash(msg, form){
    console.log(SHA512(msg));
    return SHA512(msg);
}

function whole(note, octave, bpm) {
    if(note!="PAUSE"){
        piano.play('C', octave, 240/bpm);
    }    
}

function half(note,octave, bpm){
    if(note!="PAUSE"){
        piano.play('C', octave, 120/bpm);
    }
}
function quarter(note, bpm){
    if(note!="PAUSE"){
        piano.play('C', octave, 60/bpm);
    }
}
function eighth(note, bpm){
    if(note!="PAUSE"){
        piano.play('C', octave, 30/bpm);
    }
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
       }
}


/*
* Returns [scale, bpm, file_name]
* Average min_temp <-10 C returns minor, else major
* BPM increases with the amount of rain
* 12 Scales
*/
function getParams(data){
    var scales=["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
    var scale = scales[random(0, 11)];

    var min_temp_sum = 0;
    var count_rain=0;
    for (var i = 0; i < data.length; i++) {
        min_temp_sum += data[i].main.temp_min;
        if(data[i].weather.main=="Rain"){
            count_rain +=1;
        }
    }
    var min_temp_avg = min_temp_sum/data.length;

    var scales = "";
    if(min_temp_avg<263.15){
        scales = minors;
    }
    else{
        scales = majors;
    }

    var notes = scales[scale];
    
    

    var bpm=0;
    if(count_rain>data.length/2){
        bpm = 140;
    }
    else{
        bpm = 100;
    }

    return[notes, bpm];
    

}


function random(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

//thanks to https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript/45035939
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var minors = {
    "A": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c",
        "mid_d",
        "mid_e",
        "mid_f",
        "mid_g",
        "high_a",
        "high_b",
        "high_c",
        "high_d",
        "high_e",
        "high_f",
        "high_g",
        "PAUSE"
    ],
    "A#": [
        "PAUSE",
        "mid_a_sharp",
        "mid_b_sharp",
        "mid_c_sharp",
        "mid_d_sharp",
        "mid_f",
        "mid_f_sharp",
        "mid_g_sharp",
        "high_a_sharp",
        "high_b_sharp",
        "high_c_sharp",
        "high_d_sharp",
        "high_f",
        "high_f_sharp",
        "high_g_sharp",
        "PAUSE"
    ],
    "B": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c_sharp",
        "mid_d",
        "mid_e",
        "mid_f_sharp",
        "mid_g",
        "high_a",
        "high_b",
        "high_c_sharp",
        "high_d",
        "high_e",
        "high_f_sharp",
        "high_g",
        "PAUSE"
    ],
    "C": [
        "PAUSE",
        "mid_a_sharp",
        "mid_c",
        "mid_d",
        "mid_d_sharp",
        "mid_f",
        "mid_g",
        "mid_g_sharp",
        "high_a_sharp",
        "high_c",
        "high_d",
        "high_d_sharp",
        "high_f",
        "high_g",
        "high_g_sharp",
        "PAUSE"
    ],
    "C#": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c_sharp",
        "mid_d_sharp",
        "mid_e",
        "mid_f_sharp",
        "mid_g_sharp",
        "high_a",
        "high_b",
        "high_c_sharp",
        "high_d_sharp",
        "high_e",
        "high_f_sharp",
        "high_g_sharp",
        "PAUSE"
    ],
    "D": [
        "PAUSE",
        "mid_a",
        "mid_a_sharp",
        "mid_c",
        "mid_d",
        "mid_e",
        "mid_f",
        "mid_g",
        "high_a",
        "high_a_sharp",
        "high_c",
        "high_d",
        "high_e",
        "high_f",
        "high_g",
        "PAUSE"
    ],
    "D#": [
        "PAUSE",
        "mid_a_sharp",
        "mid_b",
        "mid_c_sharp",
        "mid_d_sharp",
        "mid_e_sharp",
        "mid_f_sharp",
        "mid_g_sharp",
        "high_a_sharp",
        "high_b",
        "high_c_sharp",
        "high_d_sharp",
        "high_e_sharp",
        "high_f_sharp",
        "high_g_sharp",
        "PAUSE"
    ],
    "E": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c",
        "mid_d",
        "mid_e",
        "mid_f_sharp",
        "mid_g",
        "high_a",
        "high_b",
        "high_c",
        "high_d",
        "high_e",
        "high_f_sharp",
        "high_g",
        "PAUSE"
    ],
    "F": [
        "PAUSE",
        "mid_a_sharp",
        "mid_c",
        "mid_c_sharp",
        "mid_d_sharp",
        "mid_f",
        "mid_g",
        "mid_g_sharp",
        "high_a_sharp",
        "high_c",
        "high_c_sharp",
        "high_d_sharp",
        "high_f",
        "high_g",
        "high_g_sharp",
        "PAUSE"
    ],
    "F#": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c_sharp",
        "mid_d",
        "mid_e",
        "mid_f_sharp",
        "mid_g_sharp",
        "high_a",
        "high_b",
        "high_c_sharp",
        "high_d",
        "high_e",
        "high_f_sharp",
        "high_g_sharp",
        "PAUSE"
    ],
    "G": [
        "PAUSE",
        "mid_a",
        "mid_a_sharp",
        "mid_c",
        "mid_d",
        "mid_d_sharp",
        "mid_f",
        "mid_g",
        "high_a",
        "high_a_sharp",
        "high_c",
        "high_d",
        "high_d_sharp",
        "high_f",
        "high_g",
        "PAUSE"
    ],
    "G#": [
        "PAUSE",
        "mid_a_sharp",
        "mid_b",
        "mid_c_sharp",
        "mid_d_sharp",
        "mid_e",
        "mid_f_sharp",
        "mid_g_sharp",
        "high_a_sharp",
        "high_b",
        "high_c_sharp",
        "high_d_sharp",
        "high_e",
        "high_f_sharp",
        "high_g_sharp",
        "PAUSE"
    ]
}

var majors = {
    "A": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c_sharp",
        "mid_d_sharp",
        "mid_e",
        "mid_f",
        "mid_g_sharp",
        "high_a",
        "high_b",
        "high_c_sharp",
        "high_d_sharp",
        "high_e",
        "high_f",
        "high_g_sharp",
        "PAUSE"
    ],
    "A#": [
        "PAUSE",
        "mid_a",
        "mid_a_sharp",
        "mid_b_sharp",
        "mid_d",
        "mid_e",
        "mid_f",
        "mid_f_sharp",
        "high_a",
        "high_a_sharp",
        "high_b_sharp",
        "high_d",
        "high_e",
        "high_f",
        "high_f_sharp",
        "PAUSE"
    ],
    "B": [
        "PAUSE",
        "mid_a_sharp",
        "mid_b",
        "mid_c_sharp",
        "mid_d_sharp",
        "mid_e",
        "mid_f_sharp",
        "mid_g_sharp",
        "high_a_sharp",
        "high_b",
        "high_c_sharp",
        "high_d_sharp",
        "high_e",
        "high_f_sharp",
        "high_g_sharp",
        "PAUSE"
    ],
    "C": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c",
        "mid_d",
        "mid_e",
        "mid_f",
        "mid_g",
        "high_a",
        "high_b",
        "high_c",
        "high_d",
        "high_e",
        "high_f",
        "high_g",
        "PAUSE"
    ],
    "C#": [
        "PAUSE",
        "mid_a_sharp",
        "mid_c",
        "mid_c_sharp",
        "mid_d_sharp",
        "mid_f",
        "mid_f_sharp",
        "mid_g_sharp",
        "high_a_sharp",
        "high_c",
        "high_c_sharp",
        "high_d_sharp",
        "high_f",
        "high_f_sharp",
        "high_g_sharp",
        "PAUSE"
    ],
    "D": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c_sharp",
        "mid_d",
        "mid_e",
        "mid_f_sharp",
        "mid_g",
        "high_a",
        "high_b",
        "high_c_sharp",
        "high_d",
        "high_e",
        "high_f_sharp",
        "high_g",
        "PAUSE"
    ],
    "D#": [
        "PAUSE",
        "mid_a_sharp",
        "mid_b_sharp",
        "mid_d",
        "mid_d_sharp",
        "mid_f",
        "mid_g",
        "mid_g_sharp",
        "high_a_sharp",
        "high_b_sharp",
        "high_d",
        "high_d_sharp",
        "high_f",
        "high_g",
        "high_g_sharp",
        "PAUSE"
    ],
    "E": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c",
        "mid_d_sharp",
        "mid_e",
        "mid_f_sharp",
        "mid_g_sharp",
        "high_a",
        "high_b",
        "high_c",
        "high_d_sharp",
        "high_e",
        "high_f_sharp",
        "high_g_sharp",
        "PAUSE"
    ],
    "F": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c",
        "mid_c_sharp",
        "mid_e",
        "mid_f",
        "mid_g",
        "high_a",
        "high_b",
        "high_c",
        "high_c_sharp",
        "high_e",
        "high_f",
        "high_g",
        "PAUSE"
    ],
    "F#": [
        "PAUSE",
        "mid_a_sharp",
        "mid_c",
        "mid_c_sharp",
        "mid_d",
        "mid_f",
        "mid_f_sharp",
        "mid_g_sharp",
        "high_a_sharp",
        "high_c",
        "high_c_sharp",
        "high_d",
        "high_f",
        "high_f_sharp",
        "high_g_sharp",
        "PAUSE"
    ],
    "G": [
        "PAUSE",
        "mid_a",
        "mid_b",
        "mid_c_sharp",
        "mid_d",
        "mid_d_sharp",
        "mid_f_sharp",
        "mid_g",
        "high_a",
        "high_b",
        "high_c_sharp",
        "high_d",
        "high_d_sharp",
        "high_f_sharp",
        "high_g",
        "PAUSE"
    ],
    "G#": [
        "PAUSE",
        "mid_a_sharp",
        "mid_c",
        "mid_d",
        "mid_d_sharp",
        "mid_e",
        "mid_g",
        "mid_g_sharp",
        "high_a_sharp",
        "high_c",
        "high_d",
        "high_d_sharp",
        "high_e",
        "high_g",
        "high_g_sharp",
        "PAUSE"
    ]
}


