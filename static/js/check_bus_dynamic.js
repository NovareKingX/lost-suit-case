
// Global variables
var map;
var circle;
var bus_markers = [];
var bus_located = [];
var victor_location = {lat:41.980262, lng: -87.668452};

// Google map initialization
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: victor_location,
    zoom: 14
    });
          
    circle = new google.maps.Circle({
        strokeColor : '#2BFF3C',
        strokeOpacity : 0.8,
        strokeWeight : 2,
        map : map,
        center : victor_location,
        fillColor : '#2BFF3C',
        fillOpacity : 0.35,
        radius : 1000
    });

    var victor_marker = new google.maps.Marker({
        position : victor_location,
        map : map,
        title : 'Victor'
    });
}

// Function for bus tracking
function locate_bus(){

    var bus, lat, lon, dis;

    $.ajax({
        url : '/check_bus/',
        type : 'GET',
        contentType: 'application/json;charset=UTF-8',
        data : {
            'bus' : bus,
            'lat' : lat,
            'lon' : lon,
            'dis' : dis,
         },

        success : function(data){

            if(data.bus.length == 0){
                $.notify("There is no buses", "error")
                
            }else{
                for (var i = 0; i < data.bus.length; i++){
                    bus_located.push([data.bus[i], data.lat[i], data.lon[i]]);

                    // Run the following functions
                    clear_markers();
                    store_markers();
                    set_markers(map);
                }
                // Run reset_array function
                reset_array();

                // If bus is within 1km change the circle color to red else green
                if(data.dis.some(distance)){
                    circle.setOptions({ fillColor : "#FF0000", strokeColor : "#FF0000" })
                    $.notify("Bus is coming!", "error", { globalPosition : "middle"} );
                } else {
                    circle.setOptions({ fillColor : "#2BFF3C", strokeColor : "#2BFF3C" })
                    $.notify("Bus is not within 1 kilometer", "info", { globalPosition : "middle"} );
                }
            }
        },
    });
}

// Check bus within 1km
var distance = function(element){
    return element <= 1;
}

// Reset the bus location
function reset_array(){
    bus_located = []
}

// Store all possible markers in bus markers array
function store_markers(){
    var image = {
        url : 'http://maps.google.com/mapfiles/kml/shapes/bus.png',
        scaledSize: new google.maps.Size(20, 20),
    };

    for (var i = 0; i < bus_located.length; i++){
        var bus = bus_located[i];
        var marker = new google.maps.Marker({
            position : {lat:bus[1], lng:bus[2]},
            icon : image,
            title : bus[0]
        });
        bus_markers.push(marker);
    }
}

// Set an array of bus markers on map
function set_markers(map){
    for (var i = 0; i < bus_markers.length; i++){
        bus_markers[i].setMap(map);
    }
}

// Clear bus markers on map
function clear_markers(){
    set_markers(null);
    bus_markers = []
}

// Run continuosly the function locate_bus (5s interval)
window.setInterval(function(){
    locate_bus()
}, 5000);