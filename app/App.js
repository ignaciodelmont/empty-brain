import React, { Component } from 'react';
import { MapView, Location, Permissions } from 'expo';
import { Platform, TextInput, ScrollView, SafeAreaView, View, Button, TouchableOpacity, StyleSheet, AppRegistry, Text, Image, Alert } from 'react-native';
import { SearchBar, CheckBox } from 'react-native-elements';
import { Marker } from 'react-native-maps';
import { Styles, generatedMapStyle } from './js/style.js';

const uri = '192.168.0.103:3000';
const username = "Gandalf";
const defaultImage = require('./assets/defaultResultImage.png');
const defaultMarker = require('./assets/locationMarker.png');
class OSWrapper extends Component {
  //Permite distinguir entre android y ios para usar el safearea
  constructor(props){
    super(props);

  }
  render(){
    return  Platform.select({
      ios: (<SafeAreaView style={this.props.style}>{ this.props.children }</SafeAreaView>),
      android: (<View style={[this.props.style, {margin:0, paddingTop:'6%', paddingBottom:'0%'}]}>{ this.props.children }</View>)
    });
  };

}

class Result extends Component {
  constructor(props){
    super(props);
    this.state = {
      eventName: props.eventName,
      eventState: props.eventState,
      eventDesc: props.eventDesc,
      imageURI: props.imageURI,
      image: null
    }

    if (props.imageURI == null)
      this.state.image = defaultImage;
    else {
    }

  }


  render(){
    return (
      <TouchableOpacity onPress={ this.props.onPress } style={Styles.result}>
        <Image style={Styles.resultImage} source={{uri: this.props.imageURI }}
        />
        <Text style={Styles.eventName}>{this.state.eventName}</Text>
        <Text style={Styles.eventState}>{this.state.eventState}</Text>
      </TouchableOpacity>
    );

  }
}

class EventSearchBox extends Component {
  constructor(props){
    super(props);
    this.onChangeText = this.onChangeText.bind(this)
    this.state  = { search: '', resultsBoxActive: 'no', events: []};

  }

  onChangeText(search) {
     this.setState({ search });
     if(search == ''){
       this.setState({ resultsBoxActive: 'no'});
     }else{
       fetch(`http://${uri}/events/${search}`)
        .then((response) => {
          response = JSON.parse(response._bodyInit);
          let arr = [];
          response.forEach(
            (res) => {
              arr.push(res);
            }
          )
          this.setState({ events: arr});
          console.log("search",search, "arr", arr);
        })
        .catch(e => console.log(e));

        this.setState({ resultsBoxActive: 'yes'});

     }
  }

  /*onClear(){
    this.setState({ search:'' });
    this.setState({ resultsBoxVisibility: 'none'});
  }*/

  render(){
    if(this.state.resultsBoxActive == 'no'){
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
      </View>
      );
  }
  else {
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


            <ScrollView style={{backgroundColor:'white', width:'100%', height:'100%'}}>
            {this.state.events.map((eve) => {
              return(<Result onPress={ () => this.props.updateCurrentEvent(eve)} eventName={eve.title} eventState={eve.state} imageURI={"http://"+uri+"/"+eve.img} />);
            })}
            </ScrollView>
          </View>
      );
    }
  };

}

class CustomMarker extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

    render(){
      return (<MapView.Marker
        coordinate={this.props.latlng}
        title={this.props.e.title}
        description={this.props.e.description}
        onPress={ ()=> this.props.updateCurrentEvent(this.props.e) }
        ><Image style={{height:50,width:50}} source={defaultMarker} /></MapView.Marker>);
    }

}


export default class App extends Component {

    constructor(props) {
	     super(props);
	     this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
	     this._getLocationAsync = this._getLocationAsync.bind(this);
       this.getCloseEvents = this.getCloseEvents.bind(this);
       this.switchToEventView = this.switchToEventView.bind(this);
       this.switchToMainView = this.switchToMainView.bind(this);
       this.updateCurrentEvent = this.updateCurrentEvent.bind(this);
       this.switchToAddView = this.switchToAddView.bind(this);
       this.changeCheckedState = this.changeCheckedState.bind(this);
       this.getCloseEvents = this.getCloseEvents.bind(this);
       this.joinEvent = this.joinEvent.bind(this);
       this.createEvent = this.createEvent.bind(this);

	     this.state = {
           url:uri,
	         region: {latitude: 37.788250000001,
		       longitude: -122.4324,
		       latitudeDelta: 0.0922,
		       longitudeDelta: 0.0421},
	         locationResult: null,
	         location: {coords: { latitude: 37.78825, longitude: -122.4324 }},
	         userLocation: null,
	         search:'',
           events: [{latlng:{ latitude:  -34.59195739239957 , longitude: -58.37424902707264}, description:'asdf', title:'adsj'}],
           viewRadio: 5,
           currentView: 1,
           peopleCanEdit: false,
           selectedEvent: {eventName: 'Evento 1', eventDesc: 'Este es un evento re loco.', eventImage: './assets/wallpaperExample.jpeg'},
           newEventName: '',
           newEventDesc: '',
           newEventStartDate: '',
           newEventStartHourMin: '',
           newEventEndDate: '',
           newEventEndHourMin: '',
           events: []
	        };
        this._getLocationAsync();


      }

    onRegionChangeComplete(region) {
        let maxLimit = Math.max(this.state.region.latitudeDelta, this.state.region.longitudeDelta);
        let R = 6371;
        // maxLimit =
        //   Math.sin()
        // maxLimit = maxLimit * Math.PI/180;
        // maxLimit = 2 * Math.atan2(Math.sqrt(maxLimit), Math.sqrt(1 - maxLimit));
        // maxLimit = R * maxLimit;
        maxLimit = Math.sin(Math.PI * maxLimit / 180) * R;
	      this.setState({ region, viewRadio:maxLimit });
	      console.log("Changed region to: ",region, "maxLimit:", maxLimit);
    }

    getCloseEvents(userLocation, radio) {
     fetch(`http://${this.state.url}/events/100/${this.state.userLocation.latlng.latitude}/${this.state.userLocation.latlng.longitude}`)
      .then((response) => {

        response = JSON.parse(response._bodyInit);
        let arr = []
        response.forEach(
          (res) => {
            arr.push(res);
          }
        )
        this.setState({ events: arr});

      })
      .catch(e => console.log(e));

    }
    async _getLocationAsync () {
	     let { status } = await Permissions.askAsync(Permissions.LOCATION);
	     if (status !== 'granted') {
	        alert("Enable location!");
	      }

	     let location = await  Location.getCurrentPositionAsync({});
	     console.log("asyncLocation", location);

	      let region = {};

	      region.latitude = location.coords.latitude;
	      region.longitude = location.coords.longitude;
	      region.latitudeDelta = this.state.region.latitudeDelta;
	      region.longitudeDelta = this.state.region.longitudeDelta;

        this.setState({ region:region });
        console.log('que pasa aca');
	      let userLocation = {};

	      userLocation.title = "Location";
	      userLocation.description = "userLocation";
	      userLocation.latlng = {latitude:region.latitude , longitude:region.longitude };
        this.setState({ userLocation });

        this.getCloseEvents("response", this.state.userLocation);
    };
    createEvent() {
      let startingDate = this.state.newEventStartDate.split('/');
      let endingDate = this.state.newEventEndDate.split('/');
      let startingTime = this.state.newEventStartHourMin.split(':');
      let endingTime = this.state.newEventStartHourMin.split(':');
      fetch(`http://${uri}/events`,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "title": this.state.newEventName,
          "description": this.state.newEventDesc,
          "incident": !this.state.peopleCanEdit,
          "startTime": `${startingDate[2]}-${startingDate[1]}-${startingDate[0]}T${startingTime[0]}:${startingTime[1]}:00.000-03:00`,
          "endTime": `${endingDate[2]}-${endingDate[1]}-${endingDate[0]}T${endingTime[0]}:${endingTime[1]}:00.000-03:00`,
          "location": {
            "lat": this.state.userLocation.latlng.latitude,
            "long": this.state.userLocation.latlng.longitude
          },
          "creatorContact": username
        })
      }).then(Alert.alert("Event created Successfully!"));
      this.switchToMainView();
    }
    joinEvent(event) {
      fetch(`http://${uri}/events`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "id":event._id,
          "name": username
        })
      }).then(Alert.alert("You Joined Successfully!"));
      this.switchToMainView();

    }
    switchToEventView(){
      this.setState({currentView: 2})
    }
    switchToMainView(){
      this.setState({currentView: 1})
    }
    switchToAddView(){
      this.setState({currentView:3});
    }

    changeCheckedState(){
      let newState = !this.state.peopleCanEdit;
      this.setState({peopleCanEdit: newState});
    }

    updateCurrentEvent(eventObj){
      this.setState({selectedEvent: eventObj});
      console.log('laa', eventObj);
      console.log(this.state.selectedEvent);
      this.switchToEventView();
    }

    render() {
      let counter = 0;


      if (this.state.currentView == 1){
	    return (
        <OSWrapper style={{ flex: 1, backgroundColor: '#282A2F'}}>
                <EventSearchBox events={this.state.events} updateCurrentEvent={ this.updateCurrentEvent } switchToEventView={ this.switchToEventView } />
                <MapView
                    style = {{ flex: 1, flexDirection:'column' }}
                    //provider = { MapView.PROVIDER_GOOGLE }
                    region={ this.state.region }
                    initialRegion = {this.state.region}
                    onRegionChangeComplete={ this.onRegionChangeComplete }
                    customMapStyle = { generatedMapStyle } >

                    {this.state.userLocation && < MapView.Marker
                        coordinate={this.state.userLocation.latlng}
                        title={this.state.userLocation.title}
                        description={this.state.userLocation.description}
                     />}

                     {
                       this.state.events.map((e)=> {
                        console.log('carlitos', e);
                        let latlng ={latitude: e.location[0], longitude:e.location[1]};
                        return (<CustomMarker e={e} key={e._id} updateCurrentEvent={this.updateCurrentEvent}  latlng={latlng} />);
                      })}
		            </MapView>
                <View style={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '5%' }}>
                    <View>
                      <TouchableOpacity onPress={ this.switchToAddView }>
                      <Image style={{height: 60, width: 60}} source={require('./assets/add.png')}/></TouchableOpacity>
                    </View>
                    <View style={{marginTop:10}}>
                      <TouchableOpacity onPress={ this._getLocationAsync }>
                       <Image style={{height: 60, width: 60}} source={require('./assets/location.png')}/>
                      </TouchableOpacity>
                    </View>
                </View>
	    </OSWrapper>


	   );
   }
   else if (this.state.currentView == 2){
     let startingDate = new Date(this.state.selectedEvent.startTime);
     let endingDate = new Date(this.state.selectedEvent.endTime);
     console.log("http://"+uri+"/"+this.state.selectedEvent.img );
     return (<OSWrapper style={{ flex: 1, backgroundColor: 'white'}}>
        <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
          <View style={{height:70, flexDirection:'column', justifyContent:'flex-end'}}><Text style={Styles.title}>{this.state.selectedEvent.title}</Text></View>
          <TouchableOpacity onPress={ this.switchToMainView }><Text style={Styles.close}>X</Text></TouchableOpacity>
        </View>

        <View style={{backgroundColor: 'white'}}>
        <View style={{flexDirection:'row', marginTop:30, justifyContent:'center'}}>
          <Image style={{minHeight:170, minWidth:170}} source={{uri: "http://"+uri+"/"+this.state.selectedEvent.img }} />
        </View>
        <Text style={[Styles.bodyText, {minHeight: 200, marginTop:20}]}>{this.state.selectedEvent.description}</Text>
        <View style={[Styles.bodyText, {flexDirection:'row', minHeight: 40, marginTop:55}]}>
        <Text style={{fontSize:18, color:'#454545' }}>Time: Today</Text>
        {<Text style={{fontSize:20, marginLeft:5 }}>{`${startingDate.getHours()} - ${endingDate.getHours()}`} hs</Text>
        }</View>
        <View style={{height:'100%', flexDirection:'column', backgroundColor:'#65b0ff'}}>
        {!this.state.selectedEvent.incident && <View style={{flexDirection: 'row', marginTop:60, justifyContent:'center'}}><TouchableOpacity onPress={() => { this.joinEvent(this.state.selectedEvent)}}style={[Styles.confirmButton, {borderWidth:2,  borderColor:'#2565ff', borderRadius:25}]}><Text style={{ padding:10, color:'#2560ff', fontSize:35}}>Join!</Text></TouchableOpacity></View>}
        </View>
        </View>
      </OSWrapper>);

   }
   else if (this.state.currentView == 3) {
     return (<View style={{ flex: 1, backgroundColor: 'white', paddingTop:45 }}>
     <View style={Styles.addForm}>
         <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={[Styles.title,{width:'85%'}]}>Hey, what are your plans?</Text>
          <TouchableOpacity onPress={ this.switchToMainView }><Text style={Styles.close}>X</Text></TouchableOpacity>
        </View>
        <View style={{ marginTop:45, flex:1, flexDirection:'column', justifyContents:'space-between', alignItems:'center'}}>
          <TextInput
          style={{height: 50, fontSize:16, borderWidth:1, padding:4, borderRadius:4, width:'85%', borderColor:'#65afff'}}
          placeholder="Type Event Name! "
          onChangeText={(newEventName) => this.setState({newEventName})}
          />
          <View style={{width:'85%', marginTop: 10}}>
          <Text>Description </Text>
          <TextInput
          multiline={true}
          style={{height: 50, fontSize:16, borderWidth:1, padding:4, borderRadius:4, borderColor:'#65afff'}}
          placeholder="What's your event about? "
          onChangeText={(newEventDesc) => this.setState({newEventDesc})}
          />
          </View>
          <View style={{width:'85%', marginTop: 15}}>
          <Text>Starts </Text>
          <View style={{flexDirection:'row' }} >
          <TextInput
          style={{height: 50, width:90, fontSize:16, borderWidth:1, padding:4, borderRadius:4, borderColor:'#65afff'}}
          placeholder="dd/mm/yy"
          onChangeText={(newEventStartDate) => this.setState({newEventStartDate})}
          />
          <TextInput
          style={{height: 50, width:90, marginLeft:5, fontSize:16, borderWidth:1, padding:4, borderRadius:4, borderColor:'#65afff'}}
          placeholder="hh:min"
          onChangeText={(newEventStartHourMin) => this.setState({newEventStartHourMin})}
          /></View>
          </View>

          <View style={{width:'85%', marginTop: 15}}>
          <Text>Ends </Text>
          <View style={{flexDirection:'row' }} >
          <TextInput
          style={{height: 50, width:90, fontSize:16, borderWidth:1, padding:4, borderRadius:4, borderColor:'#65afff'}}
          placeholder="dd/mm/yy"
          onChangeText={(newEventEndDate) => this.setState({newEventEndDate})}
          />
          <TextInput
          style={{height: 50, width:90, marginLeft:5, fontSize:16, borderWidth:1, padding:4, borderRadius:4, borderColor:'#65afff'}}
          placeholder="hh:min"
          onChangeText={(newEventEndHourMin) => this.setState({newEventEndHourMin})}
          /></View>
          </View>

          <View style={{marginTop:15}}><CheckBox title='People can join this event.' checked={ this.state.peopleCanEdit } onPress={ this.changeCheckedState } /></View>

        </View>
        </View>
        <View style={{height:150, backgroundColor:'#65b0ff', flexDirection:'row', justifyContent:'center'}}>
          <TouchableOpacity onPress={() => {this.createEvent()}}style={Styles.confirmButton}>
            <Text style={Styles.confirmButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>);
   }

  }
}

let region = {latitude: 37.78825,
	      longitude: -122.4324,
	      latitudeDelta: 0.0922,
	      longitudeDelta: 0.0421};
