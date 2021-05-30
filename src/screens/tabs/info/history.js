import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  Left,
  Right,
  Body,
  Button,
  List,
  ListItem,
  DatePicker,
  Picker,
} from "native-base";
import HeaderDrawer from "./components/header";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
import { t } from "../../../functions/lang";
import firebase from "../../../functions/firebase/firebaseConfig";
import Textpopins from "../../../functions/screenfunctions/text";

let allPrice = 0;

export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checks: null,
      allMarkets: [
        { name: "Araz", id: 1 },
        { name: "Bazar Store", id: 2 },
        { name: "Bravo", id: 3 },
      ],
      firstDate: null,
      lastDate: null,
      selectedMarket: null,
      refresh: true,
      disableFirst: false,
      disableLast: false,
      disableMarket: false,
    };
  }

  async getInfo(marketName = null, firstDate = null, lastDate) {
    var checks = [];
    var checkCount = 0;
    if (marketName != null && firstDate == null && lastDate == null) {
      await axios.get("actions/shops").then((e) => {
        if (e.data.length > 0) {
          this.setState({
            checks: e.data,
          });
        } else {
          this.setState({
            checks: null,
          });
        }
      });
    } else if (marketName == null && firstDate != null && lastDate != null) {
      firebase
        .database()
        .ref("users/K3YfovctoSaJiS6xeQxvXKYIQMi1/checks")
        .orderByChild("date")
        .startAt(firstDate)
        .endAt(lastDate)
        .limitToFirst(50)
        .on("value", (data) => {
          data.forEach((data) => {
            checks.push(data.val());
          });
          checkCount = data.numChildren();
          if (checkCount > 0) {
            this.setState({
              checks,
            });
          } else {
            this.setState({
              checks: null,
            });
          }
        });
    } else if (marketName == null && firstDate != null && lastDate == null) {
      firebase
        .database()
        .ref("users/K3YfovctoSaJiS6xeQxvXKYIQMi1/checks")
        .orderByChild("date")
        .startAt(firstDate)
        .limitToFirst(50)
        .on("value", (data) => {
          data.forEach((data) => {
            checks.push(data.val());
          });
          checkCount = data.numChildren();
          if (checkCount > 0) {
            this.setState({
              checks,
            });
          } else {
            this.setState({
              checks: null,
            });
          }
        });
    } else {
      firebase
        .database()
        .ref("users/K3YfovctoSaJiS6xeQxvXKYIQMi1/checks")
        .on("value", (data) => {
          data.forEach((data) => {
            checks.push(data.val());
          });
          checkCount = data.numChildren();
          if (checkCount > 0) {
            this.setState({
              checks,
            });
          } else {
            this.setState({
              checks: null,
            });
          }
        });
    }
    this.setState({ refresh: false });
    this.renderContentArena();
  }

  componentDidMount() {
    this.getInfo();
    this.dateTm();
  }

  dateTm() {
    const appointmentDate = new Date();
    this.setState({ firstDate: appointmentDate });
    this.setState({ lastDate: appointmentDate });
  }

  search(market = null) {
    this.setState({ refresh: true });
    if (market != null) {
      this.getInfo(market, null, null);
    } else {
      if (
        this.state.selectedMarket === null &&
        this.state.firstDate != null &&
        this.state.lastDate != null
      ) {
        var firstDate = new Date(this.state.firstDate).getTime() / 1;
        var lastDate = new Date(this.state.lastDate).getTime() / 1;
        this.getInfo(null, firstDate, lastDate);
      } else if (
        this.state.selectedMarket === null &&
        this.state.firstDate != null &&
        this.state.lastDate == null
      ) {
        var firstDate = new Date(this.state.firstDate).getTime() / 1;
        this.getInfo(null, firstDate, null);
      } else if (
        this.state.selectedMarket != null &&
        this.state.firstDate != null &&
        this.state.lastDate != null
      ) {
        this.dropDownAlertRef.alertWithType("info", "Market Ve ya Tarix Secin");
      } else {
        this.getInfo(null, null, null);
      }
    }
  }

  valChang(val, type) {
    if (type === "market") {
      this.setState({
        disableFirst: !this.state.disableFirst,
        disableLast: !this.state.disableLast,
        selectedMarket: val,
      });
      this.search(val);
    } else {
      this.setState({ disableMarket: !this.state.disableMarket });
      if (type === "first") {
        this.setState({ firstDate: val });
      } else if (type == "last") {
        this.setState({ lastDate: val });
      }
      this.search();
    }
  }

  renderList(props) {
    function marketTypeFunc(item) {
      switch (item.market) {
        case "Bazar Store":
          return <FontAwesome name="cc-visa" size={30} color="#7c9d32" />;
          break;
        case "Araz":
          return <FontAwesome name="cc-mastercard" size={30} color="#7c9d32" />;
          break;
        default:
          return <FontAwesome name="credit-card" size={30} color="#7c9d32" />;
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

    function priceCollector(id) {
      // var user = firebase.auth().currentUser;
      // if (user) {
      var datas = [];
      firebase
        .database()
        .ref("users/K3YfovctoSaJiS6xeQxvXKYIQMi1/checks/" + id + "/products")
        .on("value", (data) => {
          if (data.numChildren() > 0 && data != null) {
            data.forEach((data) => {
              datas.push(data.val());
            });
          }
        });
      return datas;
      // }
    }

    function sumPrice(checkId) {
      if (checkId != null) {
        allPrice = 0;
        var checkProducts = priceCollector(checkId);
        checkProducts.map((element) => {
          allPrice = allPrice + parseFloat(element.price);
        });
      }
      return Math.ceil(parseFloat(allPrice));
    }

    if (this.state.checks !== null) {
      return this.state.checks.map((element, index) => {
        return (
          <ListItem style={styles.firstList} thumbnail key={index}>
            <Left>{marketTypeFunc(element)}</Left>
            <Body>
              <Textpopins style={styles.listtitle} children={element.market} />
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
                  children={sumPrice(element.id) + " AZN "}
                />
                <Textpopins
                  style={{ fontSize: 14 }}
                  children={convertStampDate(element.date)}
                />
              </View>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() =>
                  props.navigate("OneCheck", {
                    checkid: element.id,
                  })
                }
              >
                <AntDesign name="eyeo" size={24} color="#7c9d32" />
              </Button>
            </Right>
          </ListItem>
        );
      });
    }
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
          <ActivityIndicator size="large" color="#7c9d32" />
        </View>
      );
    } else {
      if (this.state.checks != null) {
        return (
          <View style={{ height: height - height / 8, width: width }}>
            <ScrollView>
              <List style={styles.w100}>
                {this.renderList(this.props.navigation)}
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
            color="#7c9d32"
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
                <MaterialIcons name="date-range" size={24} color="#7c9d32" />
                <DatePicker
                  androidMode="calendar"
                  locale="az"
                  placeHolderText={t("history.starttime")}
                  placeHolderTextStyle={{ color: "#7c9d32" }}
                  textStyle={{ color: "#7c9d32", fontSize: 20 }}
                  animationType="fade"
                  modalTransparent={true}
                  disabled={this.state.disableFirst}
                  onDateChange={(firstDate) =>
                    this.valChang(firstDate, "first")
                  }
                  value={this.state.firstDate}
                />
              </View>
              <View style={styles.contentHeaderColumn}>
                <MaterialIcons name="date-range" size={24} color="#7c9d32" />
                <DatePicker
                  androidMode="calendar"
                  locale="az"
                  placeHolderText={t("history.endtime")}
                  placeHolderTextStyle={{ color: "#7c9d32" }}
                  textStyle={{ color: "#7c9d32", fontSize: 20 }}
                  animationType="fade"
                  modalTransparent={true}
                  disabled={this.state.disableLast}
                  onDateChange={(lastDate) => this.valChang(lastDate, "last")}
                  value={this.state.lastDate}
                />
              </View>
            </View>
            <View style={styles.contentHeader}>
              <View style={styles.contentHeaderColumn}>
                <Picker
                  mode="dialog"
                  placeholderStyle={{ color: "#7c9d32" }}
                  style={{
                    color: "#7c9d32",
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
                    color="#7c9d32"
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
