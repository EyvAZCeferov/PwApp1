import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import HeaderDrawer from "./components/header";
import { t } from "../../../functions/lang";
import Constants from "expo-constants";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Permissions from "expo-permissions";
import Textpopins from "../../../functions/screenfunctions/text";
import { Body, Left, ListItem, Right, Thumbnail } from "native-base";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { get_image } from "../../../functions/standart/helper";
import axios from "axios";
const { width } = Dimensions.get("screen");

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      markers: null,
      markerCount: 0,
      refresh: true,
      user: null,
    };
  }

  async getPerm() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);

    if (status !== "granted") {
      const response = await Permissions.askAsync(Permissions.LOCATION);
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        this.setState({
          latitude: latitude,
          longitude: longitude,
          refresh: false,
        }),
      (error) => console.log("Error:", error)
    );
  }

  getInfo() {
    this.setState({ refresh: true });
    axios.get("auth/me").then((e) => {
      this.setState({ user: e.data });
    });

    axios
      .get("paygo/maps")
      .then((e) => {
        this.setState({
          markers: e.data,
          markerCount: e.data.length,
        });
      })
      .finally(() => {
        this.setState({ refresh: false });
      });
  }

  componentDidMount() {
    this.getPerm();
    this.getInfo();
  }

  renderMarker() {
    return this.state.markers.map((element, index) => {
      const { latitude, longitude } = element.geometry;
      return (
        <Marker
          key={index}
          title={element.name["az_name"]}
          coordinate={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }}
          image={require("../../../../assets/images/Map/marker.png")}
        >
          <Callout>
            <TouchableOpacity>
              <Text style={{ color: "#AF0045", fontSize: 15, marginTop: 2 }}>
                {element.name["az_name"]}
              </Text>
            </TouchableOpacity>
          </Callout>
          <MapViewDirections
            origin={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
            destination={{
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }}
            apikey="AIzaSyDvX734iG3u_7t-AENTvvBNYNmy0kfgltg"
            strokeWidth={3}
            strokeColor="hotpink"
          />
        </Marker>
      );
    });
  }

  toLoc(item) {
    return (
      <MapViewDirections
        origin={{
          latitude: latitude,
          longitude: longitude,
        }}
        destination={item.geometry}
        apikey="AIzaSyDvX734iG3u_7t-AENTvvBNYNmy0kfgltg"
        strokeWidth={3}
        strokeColor="hotpink"
      />
    );
  }

  renderList({ item, index }) {
    var that = this;

    function getKilom(latis, longis, valToDeg = true, resultAsMiles = true) {
      let C_RADIUS_EARTH_KM = 6371.1;
      let C_RADIUS_EARTH_MI = 3958.82;
      let C_PI = 3.141;
      let X = 1;
      if (valToDeg) {
        X = 1;
      } else {
        X = 24;
      }

      // convert to decimal degrees
      let Lat1 = that.state.latitude * X;
      let Long1 = that.state.longitude * X;
      let Lat2 = latis * X;
      let Long2 = longis * X;

      Lat1 = (Lat1 / 180) * C_PI;
      Lat2 = (Lat2 / 180) * C_PI;
      Long1 = (Long1 / 180) * C_PI;
      Long2 = (Long2 / 180) * C_PI;
      let Delta = null;
      if (Lat1 > Lat2 || Long1 > Long2) {
        Delta =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin((Lat1 - Lat2) / 2), 2) +
                Math.cos(Lat1) *
                  Math.cos(Lat2) *
                  Math.pow(Math.sin((Long1 - Long2) / 2), 2)
            )
          );
      } else {
        Delta =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin((Lat2 - Lat1) / 2), 2) +
                Math.cos(Lat1) *
                  Math.cos(Lat2) *
                  Math.pow(Math.sin((Long2 - Long1) / 2), 2)
            )
          );
      }
      let lastLoc = "";
      if (resultAsMiles) {
        lastLoc = Delta * C_RADIUS_EARTH_MI;
      } else {
        lastLoc = Delta * C_RADIUS_EARTH_KM;
      }
      let loc = lastLoc.toString();
      let mOrKm = resultAsMiles ? "M" : "KM";
      return loc.substr(0, 5) + " " + mOrKm;
    }

    return (
      <ListItem
        key={index}
        style={{ flex: 1 }}
        onPress={() => this.toLoc(item)}
      >
        <Left style={{ flex: 0.2 }}>
          <Thumbnail
            source={{ uri: get_image(item.images[0]) }}
            style={{
              marginRight: Constants.statusBarHeight,
            }}
          />
        </Left>
        <Body style={{ flex: 0.8 }}>
          <Textpopins
            style={{
              fontSize: 13,
              color: "rgb(0,0,0)",
            }}
          >
            {item.name["az_name"]}
          </Textpopins>
          <Textpopins
            style={{
              fontSize: 15,
              color: "rgba(0,0,0,.4)",
            }}
          >
            {item.get_customer.name["az_name"]}
          </Textpopins>
        </Body>
        <Right style={{ flex: 0.2 }}>
          <Textpopins
            style={{
              fontSize: 13,
              color: "#5C0082",
            }}
          >
            {getKilom(
              item.geometry.latitude,
              item.geometry.longitude,
              true,
              false
            )}
          </Textpopins>
        </Right>
      </ListItem>
    );
  }

  renderBody() {
    if (this.state.refresh) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <ActivityIndicator color="#5C0082" size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.content}>
          <View style={styles.top}>
            <MapView
              style={styles.mapStyle}
              followsUserLocation={true}
              cacheEnabled={true}
              zoomEnabled={true}
              zoomControlEnabled={true}
              zoomTapEnabled={true}
              maxZoomLevel={50}
              minZoomLevel={5}
              showsScale={true}
              userLocationAnnotationTitle={
                this.state.user
                  ? this.state.user.name != null
                    ? this.state.user.name
                    : t("loginregister.programlock.namesurname")
                  : t("loginregister.programlock.namesurname")
              }
              showsUserLocation={true}
              loadingEnabled={true}
              scrollEnabled={true}
              paddingAdjustmentBehavior="always"
              rotateEnabled={true}
              mapType="hybrid"
              loadingIndicatorColor="#5C0082"
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
          </View>
          <View style={styles.footer}>
            <View
              style={[
                styles.top,
                {
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  marginTop: Constants.statusBarHeight,
                  flex: 0.2,
                },
              ]}
            >
              <GooglePlacesAutocomplete
                placeholder={t("bucket.header.search")}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(data, details);
                  console.log(data);
                }}
                query={{
                  key: "AIzaSyDvX734iG3u_7t-AENTvvBNYNmy0kfgltg",
                  language: "az",
                }}
                currentLocation
                currentLocationLabel={t("maps.currentLoc")}
                minLength={2}
                autoFocus={false}
                returnKeyType={"default"}
                fetchDetails={true}
                styles={{
                  textInputContainer: {
                    backgroundColor: "transparent",
                  },
                  textInput: {
                    height: 42,
                    backgroundColor: "transparent",
                    borderBottomColor: "#5C0082",
                    borderBottomWidth: 2,
                    fontSize: 17,
                    color: "rgba(0,0,0,.8)",
                  },
                  poweredContainer: {
                    justifyContent: "flex-end",
                    alignItems: "center",
                    borderBottomRightRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderColor: "#c8c7cc",
                    borderTopWidth: 0.5,
                  },
                  powered: {},
                  listView: {},
                  row: {
                    backgroundColor: "#FFFFFF",
                    padding: 13,
                    height: 44,
                    flexDirection: "row",
                  },
                  separator: {
                    height: 0.5,
                    backgroundColor: "#c8c7cc",
                  },
                  description: {},
                  loader: {
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    height: 20,
                  },
                }}
                requestUrl={{
                  useOnPlatform: "all", // or "all"
                  url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api", // or any proxy server that hits https://maps.googleapis.com/maps/api
                }}
              />
            </View>
            <ScrollView style={[styles.footer, { marginTop: 0, flex: 0.8 }]}>
              <FlatList
                data={this.state.markers}
                renderItem={this.renderList.bind(this)}
                keyExtractor={(item, index) => index.toString()}
              />
            </ScrollView>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderDrawer {...this.props} name={t("drawer.map")} />
        {this.renderBody()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#ebecf0",
    borderTopLeftRadius: Constants.statusBarHeight,
    borderTopRightRadius: Constants.statusBarHeight,
  },
  top: {
    flex: 0.5,
  },
  mapStyle: {
    width: width,
    height: width - Constants.statusBarHeight * 2,
  },
  footer: {
    flex: 0.5,
    marginTop: 5,
    flexDirection: "column",
  },
});
