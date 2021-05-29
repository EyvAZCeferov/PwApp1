import React from "react";
import { View, Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { Button, Thumbnail } from "native-base";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");
import { Ionicons } from "@expo/vector-icons";
import RecentOperations from "./Components/Home/RecentOperations";
import SliderCards from "./Components/Home/SliderCards";
import axios from "axios";
const icon = require("../../../../assets/adaptive-icon.png");

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: null,
      cardcount: 0,
      shops: null,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.getInfo();
    }, 5000);
  }

  async getInfo() {
    await axios.get("auth/me").then((e) => {
      this.setState({
        // cards: e.data.cards,
        // cardcount: e.data.cards.length,
        // shops: e.data.shops,
      });
      this.renderContent();
    });
  }

  renderContent() {
    return (
      <View style={styles.contentArena}>
        {/* <SliderCards
          {...this.props}
          cards={this.state.cards}
          cardcount={this.state.cardcount}
        /> */}
        {/* <RecentOperations {...this.props} shops={this.state.shops} /> */}
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
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
    borderBottomWidth: 2,
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
