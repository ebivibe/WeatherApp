import requests
import json
import hashlib


def request_data(url):
    url = url+"&APPID=" + api_key
    r = requests.get(url)
    r = r.json()
    with open("data_to_parse", "w") as f:
        json.dump(r, f)

def read_from_file(file):
    with open(file, "r") as f:
        data = json.load(f)
    
    return data

def dump_data(data, file):
    with open(file, "w") as f:
        json.dump(data, f)

def make_hash(data):
    m = hashlib.sha512()
    m.update(data)
    return m.hexdigest()

def make_full_scale(data):
    return data + data[1:-1]

def get_first_a(data):
    for i in range(len(data)):
        if data[i][0] == "A":
            return i

api_key = "0849d2b7e2fadff537a5e0e8d2eff1c8"

beat_enc = {
    0 : "8",
    1 : "4",
    2 : "2",
    3 : "1"
}


notes = read_from_file("major_scales.json")['D#']
notes.insert(0, "PAUSE")
notes.append("PAUSE")

if __name__ == "__main__":
    files = read_from_file("data_to_parse.json")

    for data in range(len(files['list'][:1])):
        data = json.dumps(data).encode('utf-8')
        data = make_hash(data)[:-2]

        for i in range(0, len(data), 3):
            lengths = int(data[i], 16)
            first_note = notes[int(data[i+1], 16)]
            second_note = notes[int(data[i+2], 16)]
            length_1 = (lengths & 0b1100) >> 2
            length_2 = (lengths & 0b11)
            print ("%s%s %s%s " % (length_1, first_note, length_2, second_note), end="")

    print()