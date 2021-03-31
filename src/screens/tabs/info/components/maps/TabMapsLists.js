import * as React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  Button,
  List,
  ListItem,
  Thumbnail,
  Left,
  Right,
  Body,
} from "native-base";
import * as Permissions from "expo-permissions";
import Constants from 'expo-constants';
const { width, height } = Dimensions.get("window");
import firebase from "../../../../../functions/firebase/firebaseConfig";
import Textpopins from "../../../../../functions/screenfunctions/text";

export default class TabMapsLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      maps: null,
      refreshing: true,
    };
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
          maps: datas,
          refreshing: false,
        });
      });
  }

  componentDidMount() {
    this.getInfo();
    this.getPerm();
  }

  async getPerm() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);

    if (status !== "granted") {
      const response = await Permissions.askAsync(Permissions.LOCATION);
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        this.setState({ latitude, longitude }),
      (error) => console.log("Error:", error)
    );
  }

  renderLoc({ item, index }) {
    var that = this;

    function getKilom(latis, longis, valToDeg = true, resultAsMiles = true) {
      let C_RADIUS_EARTH_KM = 6371.1;
      let C_RADIUS_EARTH_MI = 3958.82;
      let C_PI = 3.14159265358979;
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
      <ListItem style={styles.firstList} thumbnail key={index}>
        <Left>
          <Thumbnail
            square
            source={{
              uri: item.image_url,
            }}
            style={styles.thumbImage}
          />
        </Left>
        <Body>
          <Text children={item.name} />
          <Text children={item.address} />
        </Body>
        <Right>
          <Button transparent>
            <Text
              children={getKilom(item.coords.lat, item.coords.lng, true, false)}
            />
          </Button>
        </Right>
      </ListItem>
    );
  }

  async handleRefresh() {
    this.setState(
        {
            refreshing: true,
        },
        () => {
            this.getInfo();
        }
    );
}

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <List style={{ width: width ,height:"100%"}}>
          {this.state.refreshing ? (
            <View
              style={{
                flex: 1,
                marginTop:8*Constants.statusBarHeight,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#7c9d32" />
            </View>
          ) : (
            <FlatList
              style={{ flex:1 }}
              data={this.state.maps}
              renderItem={this.renderLoc.bind(this)}
              keyExtractor={(item, index) => index.toString()}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          )}
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  firstList: {
    marginTop: 15,
  },
  thumbImage: {
    borderRadius: 100,
  },
});
