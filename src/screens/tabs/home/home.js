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
    };
  }

  componentDidMount() {
    this.getInfo();
  }

  async getInfo() {
    await axios.get("actions/cards").then((e) => {
      this.setState({
        cards: e.data,
        cardcount: e.data.length,
      });
      this.renderContent();
    });
  }

  renderContent() {
    return (
      <View style={styles.contentArena}>
        <SliderCards
          cards={this.state.cards}
          cardcount={this.state.cardcount}
          call={() => this.getInfo()}
          {...this.props}
        />
        <RecentOperations {...this.props} />
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
