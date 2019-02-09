import requests
import json

api_key = "0849d2b7e2fadff537a5e0e8d2eff1c8"

scales = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

dic = {}


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


def convert_to_id(data):
    dic = {}
    for key in data:
        dic[key] = []
        for i in range(len(data[key])):
            note = data[key][i]
            note = note.lower()
            if note[-1] == "#":
                note = note[:-1] + "_sharp"
            if i < 7:
                note = "mid_" + note
            else:
                note = "high_" + note
            dic[key].append(note)
    dump_data(dic, "scales_and_notes_by_id.json")



if __name__ == "__main__":
    data = read_from_file("scales_and_notes.json")
    convert_to_id(data)