import React from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator,Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import * as Permissions from "expo-permissions";
import firebase from "../../../../../functions/firebase/firebaseConfig";
import Textpopins from "../../../../../functions/screenfunctions/text";
import Constants from "expo-constants";

export default class TabMapsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      markers: null,
      markerCount: 0,
      ready: false,
    };
  }

  async getPerm() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);

    if (status !== "granted") {
      const response = await Permissions.askAsync(Permissions.LOCATION);
      this.setState({ ready: true });
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        this.setState({
          latitude: latitude,
          longitude: longitude,
          ready: true,
        }),
      (error) => console.log("Error:", error)
    );
  }

  async getInfo() {
    var datas = [];
    firebase
      .database()
      .ref("maps")
      .on("value", (data) => {
        data.forEach((data) => {
          datas.push(data.val());
        });
        this.setState({
          markers: datas,
          markerCount: data.numChildren(),
          ready: true,
        });
      });
  }

  componentDidMount() {
    this.getPerm();
    this.getInfo();
  }

  renderMarker() {
    return this.state.markers.map((element, index) => {
      const { lat, lng } = element.coords;
      return (
        <Marker
          key={index}
          title={element.name}
          coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(lng) }}
          description={element.address}
          image={require("../../../../../../assets/images/Map/marker.png")}
        >
          <Callout>
            <MyCustomCalloutView {...element} />
          </Callout>
        </Marker>
      );
    });
  }

  renderMap() {
    if (this.state.latitude != null || this.state.longitude != null) {
      return (
        <MapView
          style={styles.mapStyle}
          followsUserLocation={true}
          cacheEnabled={true}
          zoomEnabled={true}
          zoomControlEnabled={true}
          zoomTapEnabled={true}
          maxZoomLevel={150}
          minZoomLevel={15}
          showsScale={true}
          userLocationAnnotationTitle={"Eyvaz"}
          showsUserLocation={true}
          loadingEnabled={true}
          scrollEnabled={true}
          paddingAdjustmentBehavior="always"
          rotateEnabled={true}
          mapType="satellite"
          loadingIndicatorColor="#7c9d32"
          provider={PROVIDER_GOOGLE}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {this.state.markerCount > 0 ? this.renderMarker() : null}
        </MapView>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.ready ? (
          this.renderMap()
        ) : (
          <View style={styles.container}>
            <ActivityIndicator
              size="large"
              focusable={true}
              animating={true}
              color="#7c9d32"
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    marginTop: Constants.statusBarHeight * 4,
  },
});

class MyCustomCalloutView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Callout>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: "blue",
          }}
        >
          <Image
            source={{
              uri:
                "https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_1280.jpg",
            }}
            style={{
              width: 50,
              height: 50,
              backgroundColor: "red",
              resizeMode: "cover",
            }}
          />
          <Textpopins>hey</Textpopins>
        </View>
      </Callout>
    );
  }
}
