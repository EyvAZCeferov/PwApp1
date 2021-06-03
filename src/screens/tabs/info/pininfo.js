import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Thumbnail, List, ListItem } from "native-base";
import { t } from "../../../functions/lang";
import { AntDesign } from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";
import axios from "axios";
const { width, height } = Dimensions.get("window");
import { get_image } from "../../../functions/standart/helper";

const pinIcon = require("../../../../assets/images/Pin/pin.png");

export default class Pininfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      pinData: null,
      userData: null,
      checks: null,
    };
  }

  componentDidMount() {
    this.setState({ refresh: true });
    this.getInfo();
  }

  getInfo() {
    axios.get("auth/me").then((e) => {
      this.setState({
        userData: e.data,
      });
    });
    axios
      .get("actions/cards/" + this.props.route.params.pinid)
      .then((e) => {
        this.setState({
          pinData: e.data,
        });
      })
      .finally(() => {
        this.setState({
          refresh: false,
        });
      });
  }

  renderFlatListDatas({ item, index }) {
    function convertStampDate(unixtimestamp) {
      var months_arr = [
        "Yanvar",
        "Fevral",
        "Mart",
        "Aprel",
        "May",
        "İyun",
        "İyul",
        "Avqust",
        "Sentyabr",
        "Oktyabr",
        "Noyabr",
        "Dekabr",
      ];

      var date = new Date(unixtimestamp * 1);

      var year = date.getFullYear();

      var month = months_arr[date.getMonth()];

      var day = date.getDate();

      var hours = date.getHours();

      var minutes = "0" + date.getMinutes();

      var seconds = "0" + date.getSeconds();

      var fulldate =
        day + " " + month + " " + year + " " + hours + ":" + minutes.substr(-2);

      return fulldate;
    }

    return (
      <ListItem
        onPress={() =>
          this.props.navigation.navigate("OtherPages", {
            screen: "OneCheck",
            params: {
              checkid: item.checkId,
            },
          })
        }
        key={index}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <View>
          <AntDesign name="shoppingcart" color="#5C0082" size={24} />
        </View>
        <View>
          <Textpopins
            children={convertStampDate(item.date)}
            style={{ textAlign: "left" }}
          />
        </View>
        <View>
          <Textpopins
            textColor="#5C0082"
            style={{ fontWeight: "bold" }}
            children={"+ " + item.price / 10}
          />
        </View>
      </ListItem>
    );
  }

  onHandleRefresh() {
    var that = this;
    that.setState({ refresh: true });
    that.getInfo();
  }

  renderFlatList() {
    if (this.state.checks != null) {
      return (
        <List>
          <FlatList
            data={this.state.checks}
            renderItem={this.renderFlatListDatas.bind(this)}
            refreshing={this.state.refresh}
            onRefresh={this.onHandleRefresh.bind(this)}
          />
        </List>
      );
    } else {
      return (
        <View style={styles.alignCenter}>
          <Textpopins
            style={styles.nullObject}
            children={t("actions.noResult")}
          />
        </View>
      );
    }
  }

  renderImage(usDatas) {
    if (this.state.refresh) {
      return (
        <View style={{ width: "100%", height: "100%" }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    } else {
      return (
        <Thumbnail
          source={
            usDatas
              ? usDatas.image != null
                ? { uri: usDatas.image }
                : pinIcon
              : pinIcon
          }
          large
          circular
        />
      );
    }
  }

  renderContent() {
    if (this.state.refresh) {
      return (
        <View style={[styles.container, styles.alignCenter]}>
          <StatusBar backgroundColor="#5C0082" style="light" />
          <ActivityIndicator size="large" color="#5C0082" />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#5C0082" style="light" />
          <View style={styles.header}>
            <View
              style={[styles.alignCenter, { height: "100%", paddingTop: 20 }]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: width,
                }}
              >
                <TouchableOpacity
                  style={{ paddingLeft: width / 23 }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <AntDesign name="left" size={25} color="#fff" />
                </TouchableOpacity>
                {this.renderImage(this.state.userData)}
                <View style={{ width: width / 9 }} />
              </View>
              <Textpopins
                children={this.state.userData ? this.state.userData.name : null}
                style={{
                  fontWeight: "bold",
                  marginVertical: 15,
                  color: "#fff",
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <Textpopins
                  style={{ fontWeight: "bold", color: "#fff" }}
                  children={t("pin.pincount")}
                />
                <Textpopins
                  style={{ fontSize: 22, color: "#fff" }}
                  children={this.state.pinData ? this.state.pinData.price : 0.0}
                />
              </View>
            </View>
          </View>
          <View style={styles.content}>{this.renderFlatList()}</View>
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
  },
  header: {
    width: width,
    height: height / 2 - 80,
    textAlign: "center",
    backgroundColor: "#5C0082",
  },
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    alignContent: "center",
    height: "100%",
  },
  nullObject: {
    color: "#D50000",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    width: width,
    height: height / 2 + 80,
  },
});
