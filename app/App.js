import React, { Component } from 'react';
import { MapView, Location, Permissions } from 'expo';
import { Platform, SafeAreaView, View, Button, TouchableOpacity, StyleSheet, AppRegistry, Text, Image, Alert } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Marker } from 'react-native-maps';


class OSWrapper extends Component {
  //Permite distinguir entre android y ios para usar el safearea
  constructor(props){
    super(props);

  }
  render(){
    return  Platform.select({
      ios: (<SafeAreaView style={this.props.style}>{ this.props.children }</SafeAreaView>),
      android: (<View style={this.props.style}>{ this.props.children }</View>)
    });
  };

}

class EventSearchBox extends Component {
  constructor(props){
    super(props);
    this.onChangeText = this.onChangeText.bind(this)
    this.state  = { search: '', resultsBoxVisibility: 'none'};

  }

  onChangeText(search) {
     this.setState({ search });
     if(search == '')
       this.setState({ resultsBoxVisibility: 'none'});
     else
       this.setState({ resultsBoxVisibility: 'visible'});
  }

  /*onClear(){
    this.setState({ search:'' });
    this.setState({ resultsBoxVisibility: 'none'});
  }*/

  render(){
    return (
      <View style={{
        alignSelf: 'center',
        width: '100%',
        backgroundColor: 'transparent',
        zIndex:5
      }}>
          <SearchBar
              round
              style={{backgroundColor: 'red'}}
              placeholder="Search tags"
              onChangeText={ this.onChangeText }
              value = {this.state.search}
          />
          <View style={{display: this.state.resultsBoxVisibility, postion:'absolute', backgroundColor:'white', width:'100%', height:'100%'}}>
            <Text>Hola</Text>
          </View>
      </View>
    )
  }


}

class RightTools extends Component
{
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (

    <View style={{
      position: 'absolute',
      bottom: '5%',
      right: '5%' }}>
        <View >

            <TouchableOpacity onPress={this._getLocationAsync}>
          <Image style={{height: 60, width: 60}} source={require('./assets/add.png')}/></TouchableOpacity>
          </View>


          <View style={{marginTop:10}}>
      <TouchableOpacity onPress={this._getLocationAsync}>
        <Image style={{height: 60, width: 60}} source={require('./assets/location.png')}/></TouchableOpacity>
      </View>
    </View>
    );
    }
}

export default class App extends Component {

    constructor(props) {
	     super(props);
	     this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
	     this._getLocationAsync = this._getLocationAsync.bind(this);


	     this.state = {
	         region: {latitude: 37.788250000001,
		       longitude: -122.4324,
		       latitudeDelta: 0.0922,
		       longitudeDelta: 0.0421},
	         locationResult: null,
	         location: {coords: { latitude: 37.78825, longitude: -122.4324 }},
	         userLocation: null,
	         search:''
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
	      this.setState({ region:region });
	      let userLocation = {};

	      userLocation.title = "Location";
	      userLocation.description = "userLocation";
	      userLocation.latlng = {latitude:region.latitude , longitude:region.longitude };
        this.setState({ userLocation });
    };


    render() {

	    return (
        <OSWrapper style={{ flex: 1}}>
                <EventSearchBox />
                <View style={{flex:1}}>
                <MapView
                    style = {{ flex: 1, flexDirection:'column' }}
                    //provider = { MapView.PROVIDER_GOOGLE }
                    region={ this.state.region }
                    onRegionChangeComplete={ this.onRegionChangeComplete }
                    customMapStyle = { generatedMapStyle } >

                    {this.state.userLocation && <MapView.Marker
                        coordinate={this.state.userLocation.latlng}
                        title={this.state.userLocation.title}
                        description={this.state.userLocation.description}
                     />}
		            </MapView>
                <RightTools />
                </View>

	    </OSWrapper>


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
