import React from "react";
import Constants from "expo-constants";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import Header from "./components/BucketHeader";
import { t } from "../../../functions/lang";
import { connect } from "react-redux";
import {
  Body,
  Button,
  Left,
  List,
  ListItem,
  Right,
  Thumbnail,
} from "native-base";
import Textpopins from "../../../functions/screenfunctions/text";
import NumericInput from "react-native-numeric-input";
import * as Permissions from "expo-permissions";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
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
      markers: null,
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
        var formdata = new FormData();
        var price = this.pric_e(e.qyt, e.price);
        formdata.append("barcode", convertaz(e.barcode));
        formdata.append("pay_id", this.props.route.params.checkid);
        formdata.append("product_name", e.name);
        formdata.append("product_qyt", e.qyt);
        formdata.append("price", price);
        formdata.append("product_edv", true);
        await axios.post(
          "actions/products/" +
            this.props.route.params.checkid +
            "/add_pay_item",
          formdata
        );
      });
      var formData = new FormData();
      formData.append("payed", true);
      formData.append("allprice", this.state.totalBalance);
      await axios
        .put("actions/shops/" + this.props.route.params.checkid, formData)
        .then((e) => {
          this.props.navigation.navigate("PayThanks", {
            checkid: this.props.route.params.checkid,
          });
        });
      axios.get("auth/me").then(async (e) => {
        var pinprice = (this.state.totalBalance * 10) / 100 + e.data.pin.price;
        var formDataLast = new FormData();
        formDataLast.append("price", pinprice);
        await axios
          .put("actions/cards/" + e.data.pin.id, formDataLast)
          .then((e) => {
            console.log(e.data);
          });
      });
    } else {
      alert("Məhsul yoxdur");
    }
  }

  async getInfo() {
    this.priceCollect();
    await axios.get("paygo/maps").then((e) => {
      this.setState({
        markers: e.data,
      });
    });
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
        this.renderLocs();
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
          height: 90,
          marginLeft: -3,
        }}
        onPress={() =>
          this.props.navigation.navigate("ProductInfo", {
            customer: this.state.customer,
            barcode: item.barcode,
          })
        }
      >
        <Left style={{ maxWidth: width / 6 }}>
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
          <Textpopins>
            {Math.fround(this.pric_e(item.qyt, item.price))
              .toString()
              .substring(0, 5)}{" "}
            ₼
          </Textpopins>
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

  renderLocs() {
    if (this.state.markers) {
      return this.state.markers.map((item) => {
        return (
          <ListItem style={{ flex: 1 }}>
            <Left style={{ flex: 0.2 }}>
              <Thumbnail source={{ uri: get_image(item.images[0]) }} />
            </Left>
            <Body style={{ flex: 0.7 }}>
              <Textpopins
                style={{
                  fontSize: 14,
                  color: "rgba(0,0,0,.8)",
                }}
              >
                {item.name["az_name"]}
              </Textpopins>
              <Textpopins
                style={{
                  fontSize: 15,
                  color: "rgba(0,0,0,.4)",
                }}
              >
                {item.get_customer.name["az_name"]}
              </Textpopins>
            </Body>
            <Right style={{ flex: 0.2 }}>
              <Textpopins
                style={{
                  fontSize: 15,
                  color: "rgba(124,157,50,.8)",
                }}
              >
                51516 m
              </Textpopins>
            </Right>
          </ListItem>
        );
      });
    } else {
      return <View />;
    }
  }

  renderFooter() {
    return (
      <View
        style={[
          styles.footer,
          {
            flex: this.state.card != null ? 0.8 : 0.4,
            borderTopLeftRadius: Constants.statusBarHeight,
            borderTopRightRadius: Constants.statusBarHeight,
            paddingHorizontal: Constants.statusBarHeight,
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
            {Math.fround(this.state.totalBalance).toString().substring(0, 5)} ₼
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
              .substring(0, 4)}{" "}
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
              position: "absolute",
              bottom: 0,
              right: 0,
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
          <View style={styles.top}>{this.renderContent()}</View>
          <View style={styles.footer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderTopWidth: 1,
                flex: 0.8,
                borderTopColor: "#5C0082",
              }}
            >
              <ScrollView
                style={{ marginTop: 0, flex: 1, backgroundColor: "#fff" }}
              >
                {this.renderLocs()}
              </ScrollView>
            </View>
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
    flex: 0.5,
  },
  footer: {
    flex: 0.5,
    flexDirection: "column",
    backgroundColor: "#5C0082",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
