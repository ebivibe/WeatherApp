var piano = Synth.createInstrument('piano');
var __audioSynth = new AudioSynth();

function Generate(loc, form) {
    document.getElementById("progress").style.width = "0%";
    request = new XMLHttpRequest();
    var req = 'https://us1.locationiq.com/v1/search.php?key=2be3ee39b1a582&q=' + loc + '&format=json';
    request.open('GET', req, true);
    request.onload = function () {
        var data = JSON.parse(this.response);
        lon = data[0].lon;
        lat = data[0].lat;
        request2 = new XMLHttpRequest();
        // Open a new connection, using the GET request on the URL endpoint
        var x = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&APPID=insertApiKeyHere';
        request2.open('GET', x, true);
        request2.onload = function () {
            var data2 = JSON.parse(this.response).list;
            var params = getParams(data2);
            var music = generateMusic(data2, params[0]);
            var bpm = params[1];
            var lastdur = 0;
            document.getElementById("notes").innerHTML="<ul class=\"list-group\" id=\"music\"></ul>";
            for (var i = 0; i < music.length; i++) {
                dur = 0
                if (music[i].substring(0, 1) == "0") {
                    eighth(music[i].substring(1, music[i].length - 1), parseInt(music[i].substring(music[i].length - 1)), bpm, lastdur);
                    document.getElementById("music").innerHTML+= "<li class=\"list-group-item\">Note: "+music[i].substring(1)+" Type: Eighth note  </li>";
                    dur = 30*(1/bpm)*1000;
                }
                else if (music[i].substring(0, 1) == "1") {
                    quarter(music[i].substring(1, music[i].length - 1), parseInt(music[i].substring(music[i].length - 1)), bpm, lastdur);
                    dur = 60*(1/bpm)*1000;
                    document.getElementById("music").innerHTML+= "<li class=\"list-group-item\">Note: "+music[i].substring(1)+" Type: Quarter note  </li>";
                }
                else if (music[i].substring(0, 1) == "0") {
                    half(music[i].substring(1, music[i].length - 1), parseInt(music[i].substring(music[i].length - 1)), bpm, lastdur);
                    dur = 120*(1/bpm)*1000;
                    document.getElementById("music").innerHTML+= "<li class=\"list-group-item\">Note: "+music[i].substring(1)+" Type: Half note  </li>";
                }
                else {
                    whole(music[i].substring(1, music[i].length - 1), parseInt(music[i].substring(music[i].length - 1)), bpm, lastdur);
                    dur = 240/bpm*1000;
                    document.getElementById("music").innerHTML+= "<li class=\"list-group-item\">Note: "+music[i].substring(1)+" Type: Whole note  </li>";
                }
                lastdur += dur;

                
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
    for (var i = 0; i < data.length - 2; i += 3) {
        var lengths = parseInt(data.charAt(i), 16);
        var first_note = parseInt(data.charAt(i + 1), 16);
        var second_note = parseInt(data.charAt(i + 2), 16);
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
function generateMusic(data, notes) {

    var music = []
    for (var i = 0; i < 1; i++) {
        music = music.concat(parseHash(hash(data), notes));
    }
    return music;

}


function hash(msg, form) {
    return SHA512(msg);
}

function playNote(note, octave, bpm, time, timeout) {
    if (note != "PAUS") {
        setTimeout(piano.play(note, octave, time/bpm), timeout);
    } else {
        setTimeout(function() {}, timeout)
    }
}

function whole(note, octave, bpm, timeout) {
    playNote(note, octave, bpm, 240, timeout);
}

function half(note, octave, bpm, timeout) {
    playNote(note, octave, bpm, 120, timeout);
}

function quarter(note, octave, bpm, timeout) {
    playNote(note, octave, bpm, 60, timeout);
}
function eighth(note, octave, bpm, timeout) {
    playNote(note, octave, bpm, 30, timeout);
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
function getParams(data) {
    var scales = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
    var scale = scales[random(0, 11)];

    var min_temp_sum = 0;
    var count_rain = 0;
    for (var i = 0; i < data.length; i++) {
        min_temp_sum += data[i].main.temp_min;
        if (data[i].weather.main == "Rain") {
            count_rain += 1;
        }
    }
    var min_temp_avg = min_temp_sum / data.length;

    var scales = "";
    if (min_temp_avg < 273.15) {
        scales = minors;
    }
    else {
        scales = majors;
    }

    var notes = scales[scale];



    var bpm = 0;
    if (count_rain > data.length / 2) {
        bpm = 140;
    }
    else {
        bpm = 100;
    }

    return [notes, bpm];


}


function random(min, max) // min and max included
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//thanks to https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript/45035939
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var minors = {
    "A": [
        "A3",
        "B3",
        "C4",
        "D4",
        "E4",
        "F4",
        "G4",
        "A4",
        "B4",
        "C5",
        "D5",
        "E5",
        "F5",
        "G5",
        "A5",
        "PAUSE"
    ],
    "A#": [
        "A#3",
        "C4",
        "C#4",
        "D#4",
        "F4",
        "F#4",
        "G#4",
        "A#4",
        "C5",
        "C#5",
        "D#5",
        "F5",
        "F#5",
        "G#5",
        "A#5",
        "PAUSE"
    ],
    "B": [
        "B3",
        "C#4",
        "D4",
        "E4",
        "F#4",
        "G4",
        "A4",
        "B4",
        "C#5",
        "D5",
        "E5",
        "F#5",
        "G5",
        "A5",
        "B5",
        "PAUSE"
    ],
    "C": [
        "C4",
        "D4",
        "D#4",
        "F4",
        "G4",
        "G#4",
        "A#4",
        "C5",
        "D5",
        "D#5",
        "F5",
        "G5",
        "G#5",
        "A#5",
        "C6",
        "PAUSE"
    ],
    "C#": [
        "C#3",
        "D#3",
        "E3",
        "F#3",
        "G#3",
        "A3",
        "B3",
        "C#4",
        "D#4",
        "E4",
        "F#4",
        "G#4",
        "A4",
        "B4",
        "C#5",
        "PAUSE"
    ],
    "D": [
        "D3",
        "E3",
        "F3",
        "G3",
        "A3",
        "A#3",
        "C4",
        "D4",
        "E4",
        "F4",
        "G4",
        "A4",
        "A#4",
        "C5",
        "D5",
        "PAUSE"
    ],
    "D#": [
        "D#3",
        "F3",
        "F#3",
        "G#3",
        "A#3",
        "B3",
        "C#4",
        "D#4",
        "F4",
        "F#4",
        "G#4",
        "A#4",
        "B4",
        "C#5",
        "D#5",
        "PAUSE"
    ],
    "E": [
        "E3",
        "F#3",
        "G3",
        "A3",
        "B3",
        "C4",
        "D4",
        "E4",
        "F#4",
        "G4",
        "A4",
        "B4",
        "C5",
        "D5",
        "E5",
        "PAUSE"
    ],
    "F": [
        "F3",
        "G3",
        "G#3",
        "A#3",
        "C4",
        "C#5",
        "D#5",
        "F5",
        "G5",
        "G#5",
        "A#5",
        "C6",
        "C#7",
        "D#7",
        "F7",
        "PAUSE"
    ],
    "F#": [
        "F#3",
        "G#3",
        "A3",
        "B3",
        "C#4",
        "D4",
        "E4",
        "F#4",
        "G#4",
        "A4",
        "B4",
        "C#5",
        "D5",
        "E5",
        "F#5",
        "PAUSE"
    ],
    "G": [
        "G3",
        "A3",
        "A#3",
        "C4",
        "D4",
        "D#4",
        "F4",
        "G4",
        "A4",
        "A#4",
        "C5",
        "D5",
        "D#5",
        "F5",
        "G5",
        "PAUSE"
    ],
    "G#": [
        "G#3",
        "A#3",
        "B3",
        "C#4",
        "D#4",
        "E4",
        "F#4",
        "G#4",
        "A#4",
        "B4",
        "C#5",
        "D#5",
        "E5",
        "F#5",
        "G#5",
        "PAUSE"
    ]
};

var majors = {
    "C": [
        "C4",
        "D4",
        "E4",
        "F4",
        "G4",
        "A4",
        "B4",
        "C5",
        "D5",
        "E5",
        "F5",
        "G5",
        "A5",
        "B5",
        "C6",
        "PAUSE"
    ],
    "C#": [
        "C#4",
        "D#4",
        "F4",
        "F#4",
        "G#4",
        "A#4",
        "C5",
        "C#5",
        "D#5",
        "F5",
        "F#5",
        "G#5",
        "A#5",
        "C6",
        "C#6",
        "PAUSE"
    ],
    "D": [
        "D3",
        "E3",
        "F#3",
        "G3",
        "A3",
        "B3",
        "C#4",
        "D4",
        "E4",
        "F#4",
        "G4",
        "A4",
        "B4",
        "C#5",
        "D5",
        "PAUSE"
    ],
    "D#": [
        "D#3",
        "F3",
        "G3",
        "G#3",
        "A#3",
        "C4",
        "D4",
        "D#4",
        "F4",
        "G4",
        "G#4",
        "A#4",
        "C5",
        "D5",
        "D#5",
        "PAUSE"
    ],
    "E": [
        "E3",
        "F#3",
        "G#3",
        "A3",
        "B3",
        "C#4",
        "D#4",
        "E4",
        "F#4",
        "G#4",
        "A4",
        "B4",
        "C#5",
        "D#5",
        "E5",
        "PAUSE"
    ],
    "F": [
        "F3",
        "G3",
        "A3",
        "A#3",
        "C4",
        "D4",
        "E4",
        "F4",
        "G4",
        "A4",
        "A#4",
        "C5",
        "D5",
        "E5",
        "F5",
        "PAUSE"
    ],
    "F#": [
        "F#3",
        "G#3",
        "A#3",
        "B3",
        "C#4",
        "D#4",
        "F4",
        "F#4",
        "G#4",
        "A#4",
        "B4",
        "C#5",
        "D#5",
        "F5",
        "F#5",
        "PAUSE"
    ],
    "G": [
        "G3",
        "A3",
        "B3",
        "C4",
        "D4",
        "E4",
        "F#4",
        "G4",
        "A4",
        "B4",
        "C5",
        "D5",
        "E5",
        "F#5",
        "G5",
        "PAUSE"
    ],
    "G#": [
        "G#3",
        "A#3",
        "C4",
        "C#4",
        "D#4",
        "F4",
        "G4",
        "G#4",
        "A#4",
        "C5",
        "C#5",
        "D#5",
        "F5",
        "G5",
        "G#5",
        "PAUSE"
    ],
    "A": [
        "A3",
        "B3",
        "C#4",
        "D4",
        "E4",
        "F#4",
        "G#4",
        "A4",
        "B4",
        "C#5",
        "D5",
        "E5",
        "F#5",
        "G#5",
        "A5",
        "PAUSE"
    ],
    "A#": [
        "A#3",
        "C4",
        "D4",
        "D#4",
        "F4",
        "G4",
        "A4",
        "A#4",
        "C5",
        "D5",
        "D#5",
        "F5",
        "G5",
        "A5",
        "A#5",
        "PAUSE"
    ],
    "B": [
        "B3",
        "C#4",
        "D#4",
        "E4",
        "F#4",
        "G#4",
        "A#4",
        "B4",
        "C#5",
        "D#5",
        "E5",
        "F#5",
        "G#5",
        "A#5",
        "B5",
        "PAUSE"
    ]
};


