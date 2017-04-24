
function initMap() {
   
    var coordY = 30.6035104, coordX =  50.338089;
    var zoom = 17;
    var scroll = 80000;
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: coordX, lng: coordY},
      zoom: zoom,
      styles: [
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-100"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 65
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": "50"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-100"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "lightness": "30"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
            {
                "lightness": "40"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffff00"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -97
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "lightness": -25
            },
            {
                "saturation": -100
            }
        ]
    }
]
});
var marker = new google.maps.Marker({
             position: {lat:  50.337789, lng: 30.6035304},
             title: "Map",
             icon: 'img/map-icon.png'
         });
    marker.setMap(map);
mOuter = document.getElementById('map-outer');

mOuter.addEventListener('mousedown', mapClick);
  
    function mapClick(e){
        mOuter.addEventListener('mousemove', mapMove);
        var mbeforeX = e.pageX;
        var mbeforeY = e.pageY;

        function mapMove(e){
            mCurrentX =  e.pageX - mbeforeX;
            mCurrentY =  e.pageY - mbeforeY;
            coordY = coordY -  (mCurrentX/scroll);
            coordX = coordX +  (mCurrentY/scroll);
            chicago = {lat: coordX, lng: coordY}
            // console.log(chicago)
            map.setCenter(chicago)
            mbeforeX = e.pageX;
            mbeforeY = e.pageY;
        }
        mOuter.addEventListener('mouseup', function(){
            mOuter.removeEventListener('mousemove', mapMove);
        }); 
        mOuter.addEventListener('mouseout', function(){
            mOuter.removeEventListener('mousemove', mapMove);
        });
       
    }
            function evetnScroll(){
                switch(zoom){
                    case 2: scroll = 5
                    break;
                    case 3: scroll = 10
                    break;
                    case 4: scroll = 30
                    break;
                    case 5: scroll = 50
                    break;
                    case 6: scroll = 80
                    break;
                    case 7: scroll = 100
                    break;
                    case 8: scroll = 150
                    break;
                    case 9: scroll = 250
                    break;
                    case 10: scroll = 400
                    break;
                    case 11: scroll = 1000
                    break;
                    case 12: scroll = 1800
                    break;
                    case 13: scroll = 4000
                    break;
                    case 14: scroll = 10000
                    break;
                    case 15: scroll = 13000
                    break;
                    case 16: scroll = 30000
                    break;
                    case 17: scroll = 80000
                    break;
                    case 18: scroll = 120000
                    break;
                    case 19: scroll = 190000
                    break;
                    case 20: scroll = 300000
                    break;

                }
            }
    document.querySelector('.plus-zoom').addEventListener('click', function(){
            zoom++
            if(zoom > 20){zoom = 20}
            evetnScroll()
            map.setZoom(zoom)
    })
    document.querySelector('.minus-zoom').addEventListener('click',  function(){
            zoom--
            if(zoom < 2){zoom = 2}
            evetnScroll();
            map.setZoom(zoom)
    })
}
