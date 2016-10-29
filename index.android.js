import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  AppRegistry
} from 'react-native';
import MapView from 'react-native-maps';
import flagBlueImg from './assets/flag-blue.png';
import flagPinkImg from './assets/flag-pink.png';
import pb from './assets/pb.png';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 17.462210;
const LONGITUDE = 78.356849;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

export default class AwesomeProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marker1: true,
      marker2: true,
      markers:[  
        {latlang : {latitude:17.462210, longitude:78.356849}},
        {latlang : {latitude:17.460605, longitude:78.353548}},
        {latlang : {latitude:17.469795, longitude:78.359106}},       
      ],
      currentLat:0,
      currentLong:0,
      offers: [
              
            ]
    };
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        
        var initialPosition = position;
        this.setState({currentLat : position.coords.latitude, currentLong: position.coords.longitude});
        //console.log(this.state.initialPosition.coords)
      },
      (error) => alert(JSON.stringify(error))
      
    );

    fetch('http://54.67.44.199:3000/api/Offers?filter={"include":"offerProvider"}')
      .then((response) => response.json())
      .then((offers) => {
        this.setState({offers})
      })
      .catch((error) => {
        console.error(error);
      });
     
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View style={styles.container}>


        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={{
            latitude: this.state.currentLat,
            longitude: this.state.currentLong,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
        {this.state.offers.map(offer => (
          <MapView.Marker
            onPress={() => this.setState({ marker1: !this.state.marker1 })}
            coordinate={{
              latitude: offer.offerProvider.Lat,
              longitude: offer.offerProvider.Lang,
            }}
            centerOffset={{ x: -18, y: -60 }}
            anchor={{ x: 0.69, y: 1 }}
            image={flagBlueImg}
            title={offer.offerProvider.Name}
          >
            
          </MapView.Marker>
        ))}
        </MapView>
      </View>
    );
  }
}

AwesomeProject.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    marginLeft: 46,
    marginTop: 33,
    fontWeight: 'bold',
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
