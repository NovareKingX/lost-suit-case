// Function for bus tracking
function locate_bus(){

    var bus, lat, lon, dis, index_lowest_dis;

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
                index_lowest_dis = find_smallest_distance(data.dis)             
                document.getElementById("static_map").src="https://maps.googleapis.com/maps/api/staticmap?&zoom=13&size=1000x2000&maptype=roadmap&markers=color:blue%7Clabel:B%7C"+data.lat[index_lowest_dis]+","+data.lon[index_lowest_dis]+"&markers=color:red%7Clabel:V%7C41.980262,-87.668452&key=AIzaSyAJrIDD1eplkghw2M3MEj1E5whTHzWRuOM"
                $.notify("The bus "+data.bus[index_lowest_dis]+" is located at latitude: "+data.lat[index_lowest_dis]+" & longitude: "+data.lon[index_lowest_dis]+" with a distance: "+Math.ceil(data.dis[index_lowest_dis])+" kilometers")
            }
        },
    });
}

// Check bus within 1km
var distance = function(element){
    return element <= 1;
}

function find_smallest_distance(distance){
    var lowest = 0;
    for(var i = 1; i < distance.length; i++){
        if(distance[i] < distance[lowest]) lowest = i;
    }
    return lowest;
}

// Run continuosly the function locate_bus (5s interval)
window.setInterval(function(){
    locate_bus()
}, 5000);