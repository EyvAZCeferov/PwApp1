import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Left, Right, Body, Button, List, ListItem, Picker } from "native-base";
import HeaderDrawer from "./components/header";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");
import { t } from "../../../functions/lang";
import Textpopins from "../../../functions/screenfunctions/text";
import axios from "axios";

export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checks: null,
      allMarkets: null,
      firstDate: null,
      lastDate: null,
      selectedMarket: null,
      refresh: true,
      disableFirst: false,
      disableLast: false,
      disableMarket: false,
    };
  }

  async getInfo(marketName = null, firstDate = null, lastDate = null) {
    this.getcustomers();
    await axios
      .get(
        "actions/shops/search/" + marketName + "/" + firstDate + "/" + lastDate
      )
      .then((e) => {
        console.log(e.data);
        if (e.data.length > 0) {
          console.log(e.data)
          // this.setState({
          //   checks: e.data,
          // });
          this.setState({
            checks: null,
          });
        } else {
          
          this.setState({
            checks: null,
          });
        }
        console.log(this.state.checks);
      });
    this.setState({ refresh: false });
    this.renderContentArena();
    this.dateTm();
  }

  async getcustomers() {
    await axios.get("customers/customers").then((json) => {
      this.setState({ allMarkets: json.data, refresh: false });
    });
  }

  componentDidMount() {
    this.getInfo();
  }

  dateTm() {
    const appointmentDate = Date.now();
    this.setState({ firstDate: new Date(appointmentDate) });
    this.setState({ lastDate: new Date(appointmentDate) });
    console.log(this.state.firstDate);
  }

  valChang(val, type) {
    if (type === "market") {
      this.setState({
        disableFirst: !this.state.disableFirst,
        disableLast: !this.state.disableLast,
        selectedMarket: val,
      });
      this.getInfo();
    } else {
      this.setState({ disableMarket: !this.state.disableMarket });
      if (type === "first") {
        this.setState({ firstDate: val });
      } else if (type == "last") {
        this.setState({ lastDate: val });
      }
      this.getInfo(
        this.state.selectedMarket,
        this.state.firstDate,
        this.state.lastDate
      );
    }
  }

  renderList({ item, index }) {
    function marketTypeFunc(item) {
      switch (item.get_customer.name["az_name"]) {
        case "Bazar Store":
          return <FontAwesome name="cc-visa" size={30} color="#AF0045" />;
          break;
        case "Araz":
          return <FontAwesome name="cc-mastercard" size={30} color="#AF0045" />;
          break;
        default:
          return <FontAwesome name="credit-card" size={30} color="#AF0045" />;
      }
    }

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

    function priceCollector(items) {
      var price = 0;
      items.map((e) => {
        var p = parseFloat(e.price * e.qyt);
        price = parseFloat(price) + parseFloat(p);
      });
      return price;
    }

    return (
      <ListItem style={styles.firstList} thumbnail key={index}>
        <Left>{marketTypeFunc(item)}</Left>
        <Body>
          <Textpopins
            style={styles.listtitle}
            children={item.get_customer.name["az_name"]}
          />
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Textpopins
              style={{ fontSize: 14 }}
              children={priceCollector(item.pay_items) + " AZN "}
            />
            <Textpopins
              style={{ fontSize: 14 }}
              children={convertStampDate(new Date(item.created_at))}
            />
          </View>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() => {
              props.navigation.navigate("OneCheck", {
                checkid: item.id,
              });
            }}
          >
            <AntDesign name="eyeo" size={24} color="#AF0045" />
          </Button>
        </Right>
      </ListItem>
    );
  }

  renderContentArena() {
    if (this.state.refresh) {
      return (
        <View
          style={{
            flex: 1,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#AF0045" />
        </View>
      );
    } else {
      if (this.state.checks != null) {
        return (
          <View style={{ height: height - height / 8, width: width }}>
            <ScrollView>
              <List style={styles.w100}>
                <FlatList
                  data={this.state.checks}
                  keyExtractor={(index, item) => index.toString()}
                  renderItem={this.renderList.bind(this)}
                  refreshing={this.state.refresh}
                  onRefresh={this.getInfo}
                  style={{
                    marginBottom: Constants.statusBarHeight * 2,
                  }}
                  showsVerticalScrollIndicator
                  scrollEnabled
                />
              </List>
            </ScrollView>
          </View>
        );
      } else {
        return (
          <View
            style={{
              flex: 1,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Textpopins
              children={t("actions.noResult")}
              style={styles.nullObject}
            />
          </View>
        );
      }
    }
  }

  renderMarkets() {
    if (this.state.allMarkets != null) {
      return this.state.allMarkets.map((market) => {
        return (
          <Picker.Item
            label={market.name}
            value={market.name}
            color="#AF0045"
          />
        );
      });
    }
  }

  render() {
    return (
      <View style={styles.f1}>
        <HeaderDrawer {...this.props} name={t("drawer.history")} />
        <View
          style={[
            styles.f1,
            {
              flexDirection: "column",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={{
              height: height / 8,
              flexDirection: "column",
              justifyContent: "space-around",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.contentHeader}>
              <View style={styles.contentHeaderColumn}>
                <MaterialIcons name="date-range" size={24} color="#AF0045" />
                {/* <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.firstDate}
                  mode="date"
                  is24Hour={true}
                  display="compact"
                  onChange={(lastDate) => this.valChang(lastDate, "first")}
                /> */}
              </View>
              <View style={styles.contentHeaderColumn}>
                <MaterialIcons name="date-range" size={24} color="#AF0045" />
                {/* <DatePicker
                  androidMode="calendar"
                  locale="az"
                  placeHolderText={t("history.endtime")}
                  placeHolderTextStyle={{ color: "#AF0045" }}
                  textStyle={{ color: "#AF0045", fontSize: 20 }}
                  animationType="fade"
                  modalTransparent={true}
                  disabled={this.state.disableLast}
                  onDateChange={(lastDate) => this.valChang(lastDate, "last")}
                  value={this.state.lastDate}
                /> */}
              </View>
            </View>
            <View style={styles.contentHeader}>
              <View style={styles.contentHeaderColumn}>
                <Picker
                  mode="dialog"
                  placeholderStyle={{ color: "#AF0045" }}
                  style={{
                    color: "#AF0045",
                    width: 150,
                    height: 50,
                  }}
                  selectedValue={this.state.selectedMarket}
                  disabled={false}
                  onValueChange={(selectedMarket) =>
                    this.valChang(selectedMarket, "market")
                  }
                >
                  <Picker.Item
                    label={t("history.marketName")}
                    color="#AF0045"
                    value={null}
                  />
                  {this.renderMarkets()}
                </Picker>
              </View>
            </View>
          </View>
          {this.renderContentArena()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  f1: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentHeader: {
    width: width,
    height: "35%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  contentHeaderColumn: {
    backgroundColor: "transparent",
    paddingHorizontal: 15,
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  listtitle: {
    color: "#6d7587",
    fontWeight: "bold",
  },
  w100: {
    width: width,
  },
  firstList: {
    marginTop: 15,
  },
  thumbImage: {
    borderRadius: 100,
  },
  timEPickerText: {
    color: "#6d7587",
    fontSize: 15,
    marginTop: 7,
    marginLeft: -15,
    paddingLeft: 0,
  },
  nullObject: {
    color: "#D50000",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
});
