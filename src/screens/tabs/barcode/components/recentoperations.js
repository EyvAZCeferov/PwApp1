import React from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import firebase from "../../../../functions/firebase/firebaseConfig";
import { Body, Button, Left, List, ListItem, Right } from "native-base";
import { t } from "../../../../functions/lang";
import { AntDesign, Feather, Entypo } from "@expo/vector-icons";
import { hideNumb, makeid } from "../../../../functions/standart/helper";
import Textpopins from "../../../../functions/screenfunctions/text";

let lastPrice = null;
let pinprice = null;
const { width, height } = Dimensions.get("window");

export default class RecentOperations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checks: null,
      checksCount: 0,
      refresh: true,
      checkid: this.props.checkid,
    };
  }

  getInfo() {
    firebase.database().goOnline();
    this.setState({ refresh: true });
    let datas = [];
    firebase
      .database()
      .ref(
        "users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/checks/" +
          this.props.checkid +
          "/products"
      )
      .on("value", (data) => {
        if (data.numChildren() != 0) {
          data.forEach((data) => {
            datas.push(data.val());
          });
          this.setState({
            checks: datas,
            checksCount: data.numChildren(),
            refresh: false,
          });
        } else {
          this.setState({ checks: null, checksCount: 0, refresh: false });
        }
      });
    this.renderStateList();
  }

  componentWillMount() {
    this.getInfo();
    setInterval(() => {
      this.getInfo();
    }, 4000);
  }

  renderStateList() {
    if (this.state.refresh) {
      return (
        <View
          style={{
            width,
            height: height / 2.2,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            size="large"
            color="#7c9d32"
            focusable={true}
            animating={true}
          />
        </View>
      );
    } else {
      if (this.state.checks != null || this.state.checksCount != 0) {
        return this.renderFullList();
      } else {
        return this.renderNullList();
      }
    }
  }

  handleRefresh() {
    var that = this;
    that.setState({
      refresh: true,
    });
    that.getInfo();
  }

  renderNullList() {
    return (
      <List
        style={{
          width: width,
          height: height / 2,
          backgroundColor: "#fff",
          justifyContent: "space-around",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Textpopins
          style={styles.nullObject}
          children={t("actions.noResult")}
        />
        <View
          style={{
            backgroundColor: "#fff",
            width: width,
            height: 55,
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Buy", {
                  uid: this.state.checkid,
                })
              }
              style={[
                styles.buttonBarcode,
                {
                  backgroundColor: "#fff",
                  borderColor: "#7c9d32",
                  borderWidth: 2,
                  width: 50,
                  height: 50,
                },
              ]}
            >
              <Entypo name="camera" size={24} color="#7c9d32" />
            </TouchableOpacity>
          </View>
        </View>
      </List>
    );
  }

  callFullList() {
    return (
      <FlatList
        data={this.state.checks}
        renderItem={this.renderItems.bind(this)}
        keyExtractor={(item, index) => index.toString()}
        refreshing={this.state.refresh}
        onRefresh={this.handleRefresh.bind(this)}
      />
    );
  }

  goNext() {
    Alert.alert(
      t("addCard"),
      "",
      [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("addCard"),
          onPress: () => this.go(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }

  price() {
    if (this.state.checks != null && this.state.checksCount > 0) {
      this.state.checks.map((element) => {
        var elementPrice = parseFloat(element.price);
        lastPrice = lastPrice + elementPrice;
      });
    }
    return parseFloat(lastPrice);
  }

  updateShopping(d) {
    firebase.database().goOnline();
    firebase
      .database()
      .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/checks/" + this.state.checkid)
      .update({
        date: d,
      });
    var rums = 0;
    let resultSummary = this.price();
    var havePin = false;
    firebase
      .database()
      .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/pinArena/1")
      .on("value", (data) => {
        var jsonDat = JSON.stringify(data.toJSON());
        var jsonParse = JSON.parse(jsonDat);
        if (data.exists()) {
          havePin = true;
        }
        if (havePin) {
          pinprice = parseFloat(jsonParse.cardInfo.price);
          rums = data.numChildren();
        } else {
          pinprice = 0;
          rums = 0;
        }
      });
    if (havePin) {
      if (rums > 0) {
        var pice = parseFloat(pinprice) + parseFloat(resultSummary / 10);
        firebase
          .database()
          .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/pinArena/1/cardInfo")
          .update({
            price: pice,
          });
        var date = Date.now();
        firebase
          .database()
          .ref(
            "users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/pinArena/1/shoppings/" +
              this.state.checkid
          )
          .set({
            checks: this.state.checks,
            checkId: this.props.checkid,
            price: resultSummary,
            bonuse: resultSummary / 10,
            date: date.toLocaleString(),
          });
      }
    } else {
      var cardNumb = makeid(16, "number");
      var stripedNumb = this.toCardStr(cardNumb);
      firebase
        .database()
        .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/pinArena/1")
        .set({
          cardInfo: {
            price: 0,
            number: stripedNumb,
            type: "Pin",
            expiry: "∞/∞",
          },
          cardId: 1,
        })
        .then(() => {
          firebase
            .database()
            .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/pinArena/1")
            .on("value", (data) => {
              var datas = data.toJSON();
              if (datas !== null) {
                havePin = true;
              }
              pinprice = parseFloat(datas.cardInfo.price);
              rums = data.numChildren();
            });
        });
    }
  }

  toCardStr(e) {
    var v = e.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    var matches = v.match(/\d{4,16}/g);
    var match = (matches && matches[0]) || "";
    var parts = [];
    for (var i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return e;
    }
  }

  go() {
    if (this.state.checks != null) {
      var date = Date.now();
      this.updateShopping(date.toLocaleString());
      this.props.navigation.navigate("PayThanks", {
        checkid: this.state.checkid,
      });
    }
  }

  renderFullList() {
    return (
      <List
        style={{
          width: width,
          position: "relative",
          height: height / 2,
          backgroundColor: "#fff",
          justifyContent: "space-around",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        {this.callFullList()}
        <View
          style={{
            position: "absolute",
            backgroundColor: "transparent",
            width: width,
            bottom: 55,
            height: 55,
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Buy", {
                  uid: this.state.checkid,
                })
              }
              style={[
                styles.buttonBarcode,
                {
                  backgroundColor: "#fff",
                  borderColor: "#7c9d32",
                  borderWidth: 2,
                  width: 50,
                  height: 50,
                },
              ]}
            >
              <Entypo name="camera" size={24} color="#7c9d32" />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => this.goNext()}
              style={[
                styles.buttonBarcode,
                {
                  backgroundColor: "#fff",
                  borderColor: "#7c9d32",
                  borderWidth: 2,
                  width: 50,
                  height: 50,
                },
              ]}
            >
              <AntDesign name="check" size={24} color="#7c9d32" />
            </TouchableOpacity>
          </View>
        </View>
      </List>
    );
  }

  renderItems({ item, index }) {
    var that = this;

    function deleteItem(index) {
      Alert.alert(
        t("wantDelete"),
        t("neverRecover"),
        [
          {
            text: t("cancel"),
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: t("delete"),
            onPress: () => deleteYes(index),
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }

    function deleteYes(index) {
      var user = firebase.auth().currentUser;
      that.setState({ refresh: true });
      firebase
        .database()
        .ref(
          "users/" +
            user.uid +
            "/checks/" +
            that.state.checkid +
            "/products/" +
            index
        )
        .remove()
        .then(
          () => {
            this.dropDownAlertRef.alertWithType("info", t("deleted"));
            that.handleRefresh.bind(that);
          },
          (err) => {
            alert(err.message);
          }
        );
    }

    return (
      <ListItem thumbnail key={index} style={styles.listItem}>
        <Left style={{ borderColor: "transparent" }}>
          <AntDesign
            name="shoppingcart"
            style={{ paddingLeft: 10 }}
            size={24}
            color="#7c9d32"
          />
        </Left>
        <Body style={{ borderColor: "transparent" }}>
          <View style={styles.listNameCount}>
            <Textpopins style={styles.listTitle} children={item.name} />
            <Textpopins
              style={styles.listSubtitle}
              children={"  " + t("qty") + "  "}
            />
            <Textpopins
              style={styles.listSubtitle}
              children={item.qty ? item.qty : 1}
            />
          </View>
          <Textpopins
            textColor="rgba(0,0,0,.6)"
            children={item.price + " Azn"}
          />
        </Body>
        <Right style={{ borderColor: "transparent" }}>
          <Button transparent onPress={() => deleteItem(item.barcode)}>
            <Feather name="trash-2" size={24} color="#BF360C" />
          </Button>
        </Right>
      </ListItem>
    );
  }

  render() {
    return (
      <View style={{ backgroundColor: "#fff", height: height }}>
        {this.renderStateList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textmargin: {
    marginBottom: 0,
    maxHeight: 120,
    minHeight: 80,
    textAlign: "center",
    marginHorizontal: 0,
    paddingTop: 1,
  },
  btn: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 30,
  },
  btnText: {
    color: "#7c9d32",
    fontSize: 17,
    padding: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#6d7587",
    fontWeight: "bold",
    textAlign: "center",
  },
  w100: {
    width: width,
    margin: 0,
    padding: 0,
  },
  seperatorText: {
    fontSize: 15,
    color: "#7c9d32",
    marginTop: 0,
    marginBottom: 0,
    fontWeight: "bold",
  },
  listItem: {
    margin: 0,
    marginLeft: 0,
    padding: 0,
    width: width,
    height: 65,
    borderColor: "rgba(0,0,0,.5)",
    borderBottomWidth: 3,
  },
  listNameCount: {
    width: width,
    height: 20,
    flexDirection: "row",
  },
  listTitle: {
    paddingLeft: 0,
    marginLeft: 0,
    textAlign: "left",
    fontSize: 16,
    color: "#6d7587",
  },
  listSubtitle: {
    fontSize: 13,
    color: "#6d7587",
  },
  nullObject: {
    color: "#D50000",
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    fontSize: 20,
    marginTop: 5,
    fontWeight: "bold",
  },
  listHeader: {
    flexDirection: "row",
    width: width - 10,
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "center",
  },
  buttonBarcode: {
    borderRadius: 40,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    shadowColor: "#7c9d32",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.38,
    shadowRadius: 9.2,
    elevation: 8,
  },
});
