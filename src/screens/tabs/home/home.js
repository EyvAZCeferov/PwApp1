import React from "react";
import {
  View,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Button, Thumbnail } from "native-base";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");
import { Ionicons } from "@expo/vector-icons";
import RecentOperations from "./Components/Home/RecentOperations";
import SliderCards from "./Components/Home/SliderCards";
import axios from "axios";
const icon = require("../../../../assets/adaptive-icon.png");
import { Snackbar } from "react-native-paper";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: null,
      refresh: true,
      user: null,
      visible: false,
    };
  }

  componentDidMount() {
    this.getInfo();
    setInterval(() => {
      this.getInfo();
      this.setState({ visible: true });
    }, 10000);
  }

  async getInfo() {
    this.setState({
      refresh: true,
    });
    await axios.get("actions/cards").then((e) => {
      this.setState({
        cards: e.data,
        refresh: false,
      });
    });
    await axios.get("auth/me").then((e) => {
      this.setState({
        user: e.data,
      });
    });
    this.renderContent.bind(this);
  }

  renderContent() {
    return (
      <View style={styles.contentArena}>
        <View
          style={{
            width: width,
            height: 201,
            backgroundColor: "#fff",
          }}
        >
          {this.state.refresh == true ? (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <ActivityIndicator
                color="#AF0045"
                animating={true}
                size="large"
              />
            </View>
          ) : (
            <SliderCards
              cards={this.state.cards.length > 0 ? this.state.cards : null}
              user={this.state.user}
              refreshing={this.state.refresh}
              call={() => this.getInfo.bind(this)}
              {...this.props}
            />
          )}
        </View>
        <RecentOperations {...this.props} />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Snackbar visible={this.state.visible}>
          Hey there! I'm a Snackbar.
        </Snackbar>
        <View style={styles.header}>
          <Button
            transparent
            onPress={() => this.props.navigation.toggleDrawer()}
          >
            <Ionicons name="menu" size={30} color="#AF0045" />
          </Button>
          <Thumbnail source={icon} style={styles.icon} />
          <Button
            transparent
            onPress={() => this.props.navigation.navigate("Notifications")}
          >
            <Ionicons name="ios-notifications" size={24} color="#AF0045" />
          </Button>
        </View>
        {this.renderContent()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    width: width,
    paddingBottom: 2,
    borderBottomColor: "#AF0045",
    borderBottomWidth: 1,
    marginTop: Constants.statusBarHeight,
  },
  icon: {
    width: "25%",
    height: "100%",
  },
  contentArena: {
    width: width,
  },
});
