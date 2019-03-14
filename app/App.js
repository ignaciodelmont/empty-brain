import React, { Component } from 'react';
import { MapView, Location, Permissions } from 'expo';
import { View, Button, TouchableOpacity, StyleSheet, AppRegistry, Text, Image } from 'react-native';

export default class App extends Component {    
    
    constructor(props) {
	super(props);
	this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
	this._getLocationAsync = this._getLocationAsync.bind(this);
	this.state = {
	    region: {latitude: 37.78825,
		     longitude: -122.4324,
		     latitudeDelta: 0.0922,
		     longitudeDelta: 0.0421},
	    locationResult: null,
	    location: {coords: { latitude: 37.78825, longitude: -122.4324 }},
	};
    }

    onRegionChangeComplete(region) {
	this.setState({ region });
	console.log("Changed region to: ",region); 
    }

    async _getLocationAsync () {
//	const { Permissions } = Expo;
	let { status } = await Permissions.askAsync(Permissions.LOCATION);
	if (status !== 'granted') {
	    alert("Enable location!");
	}
	let location = await  Location.getCurrentPositionAsync({});
	console.log(location);
	let region = {};
	region.latitude = location.coords.latitude;
	region.longitude = location.coords.longitude;
	region.latitudeDelta = this.state.region.latitudeDelta;
	region.longitudeDelta = this.state.region.longitudeDelta;
	this.setState({ region });
    }; 

    
    render() {
	return (
	    <View style = {{ flex: 1 }}>
                <MapView
                    style = {{ flex: 1 }}
                    provider = { MapView.PROVIDER_GOOGLE }
                    region={ this.state.region }
                    onRegionChangeComplete={ this.onRegionChangeComplete }
                    customMapStyle = { generatedMapStyle }
	        />
                <TouchableOpacity
                    underlayColor='red'
                    style={{ alignItems: 'center', padding: 2}} 
                    onPress={this._getLocationAsync}                 
                >
                    <Image
                        style={{ width: 50, height: 50}}
                        source={require('./assets/location.png')}
                    />
                </TouchableOpacity>
	    </View>

	);
    }
} 

let region = {latitude: 37.78825,
	      longitude: -122.4324,
	      latitudeDelta: 0.0922,
	      longitudeDelta: 0.0421};


const generatedMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];
