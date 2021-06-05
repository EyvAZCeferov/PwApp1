import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Thumbnail, Left, Body, Header, Right } from "native-base";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";
import axios from "axios";
import { Constants } from "expo-camera";
const { width, height } = Dimensions.get("window");

export default class NotificationOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notify: null,
      refresh: true,
    };
  }

  componentDidMount() {
    this.getInfo();
  }

  async getInfo() {
    this.setState({ refresh: true });
    await axios
      .get("actions/notifications/" + this.props.route.params.notifyid)
      .then((e) => {
        console.log(e.data);
        this.setState({
          notify: e.data,
        });
      });
    this.setState({ refresh: false });
    this.renderContent();
  }

  renderContent() {
    if (this.state.refresh) {
      return (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#5C0082" focusable={true} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Header
              transparent={true}
              translucent={true}
              hasSegment={true}
              hasTabs={false}
              hasSubtitle={false}
              androidStatusBarColor="transparent"
              noShadow={true}
              span={false}
              style={{ width: width }}
            >
              <StatusBar backgroundColor="#5C0082" style="light" />
              <Left style={styles.center}>
                <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                  <AntDesign name="left" size={24} color="#fff" />
                </TouchableOpacity>
              </Left>
              <Body />
              <Right />
            </Header>
            <View style={[styles.headerBottom, styles.center]}>
              <View
                style={[
                  styles.center,
                  { flexDirection: "column", width: width / 1.4 },
                ]}
              >
                <Thumbnail
                  source={{
                    uri: this.state.notify.image,
                  }}
                  large
                  circular
                  resizeMode="cover"
                />
                <Textpopins
                  style={[
                    styles.center,
                    { marginTop: 20, fontWeight: "bold", color: "#fff" },
                  ]}
                  children={this.state.notify.name}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.content,
              styles.center,
              { padding: 1, paddingBottom: 0 },
            ]}
          >
            <ScrollView
              scrollEventThrottle={30}
              showsVerticalScrollIndicator={false}
              collapsable={true}
              focusable={true}
              bounces={false}
              nestedScrollEnabled={true}
            >
              <Textpopins
                style={{ textAlign: "justify" }}
                children={this.state.notify.description}
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
        <StatusBar backgroundColor="#5C0082" style="light" />
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
  body: {
    flex: 0.7,
  },
  header: {
    flex: 0.3,
    backgroundColor: "#5C0082",
  },
});
