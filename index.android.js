import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  AppRegistry,
  ListView,
  Image
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView from 'react-native-maps';
import flagBlueImg from './assets/flag-blue.png';
import flagPinkImg from './assets/flag-pink.png';
import pb from './assets/pb.png';

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 17.462210;
const LONGITUDE = 78.356849;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class AwesomeProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentLat:0,
      currentLong:0,
      offers: [],
      dataSource: ds.cloneWithRows([]),
      loading:true
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

    fetch('http://54.67.44.199/api/Offers?filter={"include":"offerProvider"}')
      .then((response) => response.json())
      .then((offers) => {
        this.setState({offers,dataSource: ds.cloneWithRows(offers),loading:false})
      })
      .catch((error) => {
        console.error(error);
      });
     
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {


    if(this.state.loading){
        return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.loading} />
      </View>
    );
    }else
    
      return (
       

          <ScrollableTabView
      style={{marginTop: 20, }}
      renderTabBar={() => <DefaultTabBar />}>

      <ListView
        tabLabel="List"
        dataSource={this.state.dataSource}
        renderRow={(data) => 
          <View style={styles.listViewItemContainer}>
           <Image source={{ uri: 'http://smilz.net/wp-content/uploads/2013/08/Offers.jpg'}} style={styles.photo} />
            <Text style={styles.text} key={data.id}>{data.OfferName}</Text>
          </View>
        }
        enableEmptySections={true} />


    <View style={styles.container} tabLabel="Map">
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={{
            latitude: this.state.currentLat,
            longitude: this.state.currentLong,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          fitToElements={true}
        >
        {this.state.offers.map(offer => (
          <MapView.Marker
            onPress={() => this.setState({ marker1: !this.state.marker1 })}
            coordinate={{
              latitude: offer.offerProvider.Lat,
              longitude: offer.offerProvider.Lang,
            }}
            
            

            title={offer.offerProvider.Name}
            key={offer.id}
          >
            <MapView.Callout style={styles.plainView}>

              <View>
                <Text>{offer.OfferName}-{offer.offerProvider.Name}{offer.offerProvider.Address} </Text>
              </View>
            </MapView.Callout>
          </MapView.Marker>
        ))}
        </MapView>
      </View>



      </ScrollableTabView>
        )
    
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
  listViewItemContainer :{
    flex: 1,
    padding: 12,
    flexDirection: 'row',
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
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  plainView: {
    width: 200,
  }
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
