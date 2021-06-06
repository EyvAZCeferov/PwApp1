import React from "react";
import Constants from "expo-constants";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  Image,
  Picker,
} from "react-native";
import Header from "./components/BucketHeader";
import { t } from "../../../functions/lang";
import { connect } from "react-redux";
import {
  Body,
  Button,
  DatePicker,
  Left,
  List,
  ListItem,
  Right,
  Thumbnail,
} from "native-base";
import Textpopins from "../../../functions/screenfunctions/text";
import NumericInput from "react-native-numeric-input";
import * as Permissions from "expo-permissions";
import {
  EvilIcons,
  AntDesign,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { convertaz, get_image } from "../../../functions/standart/helper";

const { width, height } = Dimensions.get("screen");

class Beforebuy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location_key: null,
      customer: null,
      card: null,
      totalBalance: 0,
      latitude: null,
      longitude: null,
      emnov: null,
      myLoc: {
        latitude: null,
        longitude: null,
      },
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
        }),
      (error) => console.log("Error:", error)
    );
  }

  pric_e(qyt, price) {
    return qyt * price;
  }

  componentDidMount() {
    this.getPerm();
    this.getInfo();
  }

  async next() {
    if (this.props.bucketitems.length > 0) {
      if (this.state.card != null) {
        if (this.state.totalBalance > this.state.card.price) {
          alert("Məbləğ aşıldı");
        }
      }
      this.props.bucketitems.map(async (e) => {
        var formdata1 = new FormData();
        var price = this.pric_e(e.qyt, e.price);
        formdata1.append("barcode", convertaz(e.barcode));
        formdata1.append("pay_id", this.props.route.params.checkid);
        formdata1.append("product_name", e.name);
        formdata1.append("image", e.image);
        formdata1.append("product_qyt", e.qyt);
        formdata1.append("price", price);
        formdata1.append("product_edv", true);
        await axios.post(
          "actions/products/" +
            this.props.route.params.checkid +
            "/add_pay_item",
          formdata1
        );
      });

      var formdata2 = new FormData();
      formdata2.append("payed", true);
      formdata2.append("allprice", this.state.totalBalance);
      if (this.state.myLoc.latitude != null && this.state.myLoc != null) {
        formdata2.append("geometry", this.state.myLoc);
      }
      await axios
        .put("actions/shops/" + this.props.route.params.checkid, formdata2)
        .then((e) => {
          this.props.navigation.navigate("PayThanks", {
            checkid: this.props.route.params.checkid,
          });
        });

      if (this.state.card != null) {
        var price = 0;
        axios.get("actions/cards/" + this.state.card.id).then((e) => {
          price = e.data.price;
        });

        var formdataz = new FormData();
        var lastprice = parseFloat(price) - parseFloat(this.state.totalBalance);

        formdataz.append("price", lastprice);

        await axios.post(
          "actions/cards/updatecart/" + this.state.card.id,
          formdataz
        );
      }

      axios.get("auth/me").then(async (e) => {
        var pinprice = this.state.totalBalance / 100 + e.data.pin.price;
        var formdata3 = new FormData();
        formdata3.append("price", pinprice);
        await axios.post(
          "actions/cards/updatecart/" + e.data.pin.id,
          formdata3
        );
      });
    } else {
      alert(t("barcode.paying.productnotfound"));
    }
  }

  async getInfo() {
    this.priceCollect();
    var cardid = null;
    await axios
      .get("actions/shops/" + this.props.route.params.checkid)
      .then((e) => {
        this.setState({
          location_key: e.data.info["location_key"] ?? null,
          customer: e.data.customer,
        });
        cardid = e.data.pay_card ?? null;
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(async (e) => {
        if (cardid) {
          await axios
            .get("actions/cards/" + cardid)
            .then((e) => {
              this.setState({
                card: e.data,
              });
            })
            .catch((e) => {
              console.log(e);
            });
        }
        this.renderContent();
        this.renderLocArena();
        this.renderFooter();
      });
  }

  priceCollect() {
    var price = 0;
    this.props.bucketitems.map((e) => {
      var p = this.pric_e(e.qyt, e.price);
      price = parseFloat(price) + parseFloat(p);
    });
    this.setState({
      totalBalance: price,
    });
  }

  renderBucket({ item, index }) {
    return (
      <ListItem
        key={index}
        style={{
          width: width,
          height: 100,
          marginLeft: -3,
        }}
        onPress={() =>
          this.props.navigation.navigate("ProductInfo", {
            customer: this.state.customer,
            barcode: item.barcode,
          })
        }
      >
        <Left style={{ maxWidth: width / 6, marginRight: 8 }}>
          <Image
            source={{
              uri: item.image
                ? get_image(item.image)
                : "https://micoedward.com/wp-content/uploads/2018/04/Love-your-product.png",
            }}
            style={{
              width: width / 6,
              height: width / 6,
              borderRadius: width / 6,
            }}
          />
        </Left>
        <Body style={{ maxWidth: width / 3 + 30 }}>
          <Textpopins style={{ fontSize: 13 }} children={item.name} />
          <Textpopins>{this.pric_e(item.qyt, item.price)}₼</Textpopins>
        </Body>
        <Right style={{ flexDirection: "row" }}>
          <NumericInput
            value={item.qyt}
            onChange={(value) => {
              this.props.updateVal({ item, value });
              this.getInfo();
            }}
            onLimitReached={(isMax, msg) => alert(t("cards.minimal"))}
            totalWidth={width / 3}
            totalHeight={50}
            iconSize={25}
            step={1}
            minValue={1}
            maxValue={100}
            valueType="integer"
            rounded
            textColor="#5C0082"
            iconStyle={{ color: "white" }}
            rightButtonBackgroundColor="#5C0082"
            leftButtonBackgroundColor="#E56B70"
          />

          <Button
            transparent
            style={styles.buttonStyle}
            onPress={() => {
              this.props.removeCart(item);
              getInfo();
            }}
          >
            <EvilIcons name="trash" size={30} color="#BF360C" />
          </Button>
        </Right>
      </ListItem>
    );
  }

  renderContent() {
    if (this.props.bucketitems && this.props.bucketitems.length > 0) {
      return (
        <List
          style={{
            width: width,
            height: "100%",
            margin: 0,
            padding: 0,
          }}
        >
          <FlatList
            data={this.props.bucketitems}
            renderItem={this.renderBucket.bind(this)}
            keyExtractor={(item, index) => index.toString()}
          />
        </List>
      );
    } else {
      return (
        <List
          style={{
            width: width,
            height: "100%",
            marginTop: Constants.statusBarHeight,
            padding: 0,
          }}
        >
          <Textpopins
            children={t("actions.noResult")}
            style={styles.noResult}
          />
        </List>
      );
    }
  }

  renderLocArena() {
    return (
      <ScrollView
        style={{ flex: 1, paddingHorizontal: Constants.statusBarHeight }}
      >
        <Textpopins style={styles.center}>Çatdırılma</Textpopins>
        <Picker
          enabled
          mode="dropdown"
          selectedValue={this.state.emnov}
          onValueChange={(val) => this.setState({ emnov: val })}
          style={{ width: width / 1.2, zIndex: 9999 }}
        >
          <Picker.Item value="" label="Əməliyyat növü" />
          <Picker.Item value="reach" label="Çatdırılma" />
          <Picker.Item value="take" label="Götürəcəm" />
        </Picker>
        {this.state.emnov != null || this.state.emnov !== null ? (
          this.state.emnov == "reach" ? (
            <List style={[styles.center, { flex: 1 }]}>
              <ListItem
                style={{
                  borderWidth: 0,
                  borderColor: "transparent",
                }}
              >
                <Textpopins>Vaxtı təyin et</Textpopins>
                <DatePicker
                  androidMode="calendar"
                  animationType="slide"
                  defaultDate={new Date()}
                  is24Hour={true}
                  display="compact"
                />
              </ListItem>
              <ListItem
                style={{
                  borderWidth: 0,
                  borderColor: "transparent",
                }}
              >
                <Textpopins>Çatdırılma məkanı</Textpopins>
              </ListItem>
              <ListItem
                style={{
                  borderWidth: 0,
                  borderColor: "transparent",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "100%",
                }}
                onPress={() => {
                  this.setState({
                    myLoc: {
                      latitude: this.state.latitude,
                      longitude: this.state.longitude,
                    },
                  });
                }}
              >
                {this.state.myLoc.latitude != null &&
                this.state.myLoc.longitude != null ? (
                  <MaterialIcons
                    name="add-location-alt"
                    size={24}
                    color="#5C0082"
                    style={{
                      marginRight: Constants.statusBarHeight,
                    }}
                  />
                ) : (
                  <Ionicons
                    name="locate-sharp"
                    size={24}
                    color="#2196f3"
                    style={{
                      marginRight: Constants.statusBarHeight,
                    }}
                  />
                )}

                <Textpopins>Your loc</Textpopins>
              </ListItem>
            </List>
          ) : (
            <List style={[styles.center, { flex: 1 }]}>
              <ListItem
                style={{
                  borderWidth: 0,
                  borderColor: "transparent",
                }}
              >
                <Textpopins>Vaxtı təyin et</Textpopins>
                <DatePicker
                  androidMode="calendar"
                  animationType="slide"
                  defaultDate={new Date()}
                  is24Hour={true}
                  display="compact"
                />
              </ListItem>
            </List>
          )
        ) : null}
      </ScrollView>
    );
  }

  renderFooter() {
    return (
      <View
        style={[
          styles.footer,
          {
            flex: 1,
            borderTopLeftRadius: Constants.statusBarHeight,
            borderTopRightRadius: Constants.statusBarHeight,
            paddingHorizontal: Constants.statusBarHeight,
            // position: "relative",
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Textpopins
            style={{
              color: "rgba(255,255,255,.7)",
              fontSize: 22,
            }}
          >
            {t("barcode.paying.totalBalance")}
          </Textpopins>
          <Textpopins
            style={{
              color: "rgba(255,255,255,.7)",
              fontSize: 22,
            }}
          >
            {this.state.totalBalance} ₼
          </Textpopins>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Textpopins
            style={{
              color: "rgba(255,255,255,.7)",
              fontSize: 20,
            }}
          >
            {t("barcode.paying.edv") + " 18%"}
          </Textpopins>
          <Textpopins
            style={{
              color: "rgba(255,255,255,.7)",
              fontSize: 20,
            }}
          >
            {Math.fround((((this.state.totalBalance * 18) / 100) * 10) / 100)
              .toString()
              .substring(0, 4)}
            ₼
          </Textpopins>
        </View>
        {this.state.card ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Textpopins
              style={{
                color: "rgba(255,255,255,.7)",
                fontSize: 20,
              }}
            >
              {t("barcode.paying.cardBalance")}
            </Textpopins>
            <Textpopins
              style={{
                color: "rgba(255,255,255,.7)",
                fontSize: 20,
              }}
            >
              {this.state.card ? this.state.card.price : 0} ₼
            </Textpopins>
          </View>
        ) : null}
        <Button
          style={[
            styles.center,
            {
              backgroundColor: "#5C0082",
              zIndex: 150,
              paddingHorizontal: Constants.statusBarHeight,
              flexDirection: "row",
              borderTopLeftRadius: Constants.statusBarHeight,
              borderTopRightRadius: Constants.statusBarHeight,
              borderBottomRightRadius: Constants.statusBarHeight,
              borderBottomLeftRadius: Constants.statusBarHeight,
              justifyContent: "space-around",
              borderColor: "#FFF",
              borderWidth: 2,
            },
          ]}
          onPress={() => this.next()}
        >
          <Textpopins
            style={{
              color: "#fff",
              textAlign: "center",
            }}
          >
            {t("bucket.header.cartlists.finishpayment")}
          </Textpopins>
          <AntDesign
            style={{ marginLeft: 10 }}
            name="check"
            size={24}
            color="#fff"
          />
        </Button>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header button title={t("bucket.header.beforeorder")} />
        </View>
        <View style={styles.content}>
          <View
            style={[
              styles.top,
              this.state.card ? { flex: 0.5 } : { flex: 0.5 },
            ]}
          >
            {this.renderContent()}
          </View>
          <View
            style={[
              styles.top,
              this.state.card ? { flex: 0.35 } : { flex: 0.325 },
            ]}
          >
            {this.renderLocArena()}
          </View>
          <View
            style={[
              styles.footer,
              this.state.card ? { flex: 0.25 } : { flex: 0.175 },
            ]}
          >
            {this.renderFooter()}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bucketitems: state.bucketitems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeCart: (product) =>
      dispatch({ type: "REMOVE_FROM_CART", payload: product }),
    updateVal: (product, value) =>
      dispatch({ type: "UPDATE_CART", payload: product }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Beforebuy);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flex: 0.1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center",
  },
  content: {
    flex: 0.9,
    backgroundColor: "#ebecf0",
    borderTopLeftRadius: Constants.statusBarHeight,
    borderTopRightRadius: Constants.statusBarHeight,
  },
  top: {
    flex: 0.8,
  },
  footer: {
    flex: 0.2,
    flexDirection: "column",
    backgroundColor: "#5C0082",
    borderTopLeftRadius: Constants.statusBarHeight,
    borderTopRightRadius: Constants.statusBarHeight,
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
