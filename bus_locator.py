from flask import Flask, render_template, jsonify
from math import sin, cos, sqrt, atan2, radians
import urllib
import webbrowser
import time
from urllib.request import urlopen
from xml.etree.ElementTree import parse

app = Flask(__name__)

def distance(lat1, lat2, lon1, lon2):

    # Earth radius
    R = 6373.0

    # Initiate longitude and latitude of two points
    lat1 = radians(lat1)
    lat2 = radians(lat2)
    lon1 = radians(lon1)
    lon2 = radians(lon2)

    # Get both the difference of latitude and longitude 
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    
    # Calculate distance using Haversine formula
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2)* sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    distance = R*c

    return distance

@app.route('/test')
def test_app():
    return render_template('test.html')

if __name__ == 'main':
    app.run(host='0.0.0.0', debug=True, port=5000)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check_bus/dynamic/')
def open_map():
    return render_template('dynamic_map.html')

@app.route('/check_bus/', methods=['GET'])
def check_bus():

    # Set victor location
    victor_lat = 41.980262
    victor_lon = -87.668452

    # Direct to and read xml file
    with urlopen("http://ctabustracker.com/bustime/map/getBusesForRoute.jsp?route=22") as conn:
        data = conn.read()
    
    # Save the xml file
    with open("bus_data.xml", "wb") as f:
        f.write(data)
        f.close()
    
    # Parse xml file
    bus_list = parse("bus_data.xml")
    buses = []
    latitudes= []
    longitudes = []
    distances = []
    data = {}

    # Check all buses
    for bus in bus_list.findall("bus"):
        print("Bus ID: %s \tVictor lat : %s \tBus lat: %s \tDirection: %s" %(bus.findtext("id"), victor_lat, bus.findtext("lat"), bus.findtext("d")))

        # Get the following important data
        latitude = float(bus.findtext("lat"))
        longitude = float(bus.findtext("lon"))
        bus_id = bus.findtext("id")
        direction = bus.findtext("d")
        north_buses = [[bus_id, latitude, longitude]]

        # If bus arriving at north direction
        if direction.startswith("North"):
            for bus in north_buses:
                    
                # Calculate distance for each northbound buses
                bus_distance = distance(float(latitude), float(victor_lat), float(longitude), float(victor_lon))

                # If bus is within 50km
                if bus_distance <= 50:
                        
                    buses.append(bus_id)
                    latitudes.append(latitude)
                    longitudes.append(longitude)
                    distances.append(bus_distance)

    data["bus"] = buses
    data["lat"] = latitudes
    data["lon"] = longitudes
    data["dis"] = distances
    print(distances)

    return jsonify(data)

@app.route('/check_bus/static/')
def check_bus_static():

    return render_template('static_map.html')