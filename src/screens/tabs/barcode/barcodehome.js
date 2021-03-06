import * as React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import Constants from "expo-constants";
import {
  Body,
  Button,
  Left,
  List,
  ListItem,
  Right,
  Thumbnail,
} from "native-base";
import { Camera } from "expo-camera";
import BarcodeMask from "react-native-barcode-mask";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("screen");
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { t } from "../../../functions/lang";
import { connect } from "react-redux";
import Textpopins from "../../../functions/screenfunctions/text";
import NoBarcode from "./components/noBarcode";
import axios from "axios";
import FormData from "form-data";
import NumericInput from "react-native-numeric-input";
import { convertaz } from "../../../functions/standart/helper";
import { Audio } from "expo-av";

class BarcodeHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: true,
      hasPermission: null,
      card: null,
      price: 0,
      customer: 0,
      active: false,
    };
  }

  async getInfo() {
    var cardid = null;
    await axios
      .get("actions/shops/" + this.props.route.params.checkid)
      .then((e) => {
        this.setState({
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
        this.setState({
          refresh: false,
        });
        this.handleRefresh();
      });
  }

  async callSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../../assets/sounds/barcode_scanned.mp3")
    );
    await sound.playAsync();
  }

  async barcodeScanned(data) {
    console.log(data);
    this.callSound();
    this.setState({ refresh: true });
    if (data) {
      await axios
        .get(
          "customers/product/" +
            this.state.customer +
            "/" +
            this.state.customer +
            "_" +
            data
        )
        .then((e) => {
          console.log(e.data);
          if (e.data.id != null) {
            var data = e.data;
            data.qyt = 1;
            this.props.addtoCard(data);
            this.handleRefresh();
            this.setState({ refresh: false });
          } else {
            this.setState({ refresh: false });
            alert(t("barcode.paying.productnotfound"));
          }
        });
    } else {
      this.setState({ refresh: false });
      alert(t("barcode.paying.productnotfound"));
    }
  }

  price(qyt, price) {
    return qyt * price;
  }

  renderItems({ item, index }) {
    var that = this;

    return (
      <ListItem
        key={index}
        style={{
          width: width,
          height: 100,
          marginLeft: -Constants.statusBarHeight,
        }}
        onPress={() =>
          props.navigation.navigate("ProductInfo", {
            customer: this.state.customer,
            barcode: item.barcode,
          })
        }
      >
        <Left style={{ maxWidth: width / 6, marginRight: 8 }}>
          <Thumbnail
            source={{ uri: item.image ? get_image(item.image) : null }}
            style={{ maxWidth: "100%" }}
          />
        </Left>
        <Body style={{ maxWidth: width / 3 + 30 }}>
          <Textpopins children={item.name} />
          <Textpopins>{this.price(item.qyt, item.price)} ₼</Textpopins>
        </Body>
        <Right style={{ flexDirection: "row" }}>
          <NumericInput
            value={item.qyt}
            onChange={(value) => {
              that.callSound();
              that.props.updateVal({ item, value });
              that.handleRefresh();
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
              that.props.deleteCard(item);
              that.getInfo();
            }}
          >
            <EvilIcons name="trash" size={30} color="#BF360C" />
          </Button>
        </Right>
      </ListItem>
    );
  }

  handleRefresh() {
    this.setState({ refresh: true });
    this.priceCollect();
    this.renderContent();
    this.setState({ refresh: false });
  }

  async getPerm() {
    this.setState({ refresh: true });
    const { status } = await Camera.requestPermissionsAsync();
  }

  priceCollect() {
    var price = 0;
    this.props.bucketitems.map((e) => {
      var p = this.price(e.qyt, e.price);
      price = parseFloat(price) + parseFloat(p);
    });
    this.setState({
      price: price,
    });
  }

  componentDidMount() {
    this.getPerm();
    this.getInfo();
  }

  renderContent() {
    if (this.state.refresh) {
      return (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator
            size="large"
            color="#5C0082"
            focusable={true}
            animating={true}
          />
        </View>
      );
    } else {
      if (this.props.bucketitems.length == 0) {
        return (
          <View style={[styles.container, styles.center]}>
            <Textpopins style={styles.nullObject}>
              {t("actions.noResult")}
            </Textpopins>
          </View>
        );
      } else {
        return (
          <FlatList
            data={this.props.bucketitems}
            renderItem={this.renderItems.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            refreshing={this.state.refresh}
            onRefresh={this.handleRefresh.bind(this)}
          />
        );
      }
    }
  }

  async next() {
    if (this.props.bucketitems.length > 0) {
      if (this.state.card != null) {
        if (this.state.price > this.state.card.price) {
          alert("Məbləğ aşıldı");
        }
      }
      this.props.bucketitems.map(async (e) => {
        var formdata1 = new FormData();
        var price = this.price(e.qyt, e.price);
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

      var formData2 = new FormData();
      formData2.append("payed", true);
      formData2.append("allprice", this.state.price);

      await axios
        .put("actions/shops/" + this.props.route.params.checkid, formData2)
        .then((e) => {
          this.props.navigation.navigate("PayThanks", {
            checkid: this.props.route.params.checkid,
          });
        });

      if (this.state.card != null) {
        var price = 0;
        await axios.get("actions/cards/" + this.state.card.id).then((e) => {
          price = e.data.price;
        });

        var formdata = new FormData();
        var lastprice = parseFloat(price) - parseFloat(this.state.price);

        formdata.append("price", lastprice);

        await axios.post(
          "actions/cards/updatecart/" + this.state.card.id,
          formdata
        );
      }

      await axios.get("auth/me").then(async (e) => {
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

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: "#ecf0f1",
            paddingTop: Constants.statusBarHeight,
          },
        ]}
      >
        {this.state.active ? (
          <NoBarcode
            {...this.props}
            bar={(e) => this.barcodeScanned(e)}
            togMod={() => this.setState({ active: !this.state.active })}
          />
        ) : (
          <View style={styles.container}>
            <StatusBar backgroundColor="#5C0082" style="light" />
            {this.state.refresh ? (
              <View
                style={[
                  styles.container,
                  styles.center,
                  { backgroundColor: "transparent", zIndex: 5 },
                ]}
              >
                <ActivityIndicator
                  size="large"
                  color="#5C0082"
                  focusable={true}
                  animating={true}
                />
              </View>
            ) : (
              <View style={styles.container}>
                <View style={styles.footer}>
                  <View
                    style={{
                      top: 0,
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#AF0045",
                          borderTopLeftRadius: Constants.statusBarHeight,
                          borderTopRightRadius: Constants.statusBarHeight,
                          borderBottomRightRadius: Constants.statusBarHeight,
                          borderBottomLeftRadius: Constants.statusBarHeight,
                        }}
                        onPress={() => this.props.navigation.pop()}
                      >
                        <AntDesign
                          name="arrowleft"
                          size={24}
                          color="#fff"
                          style={{
                            fontSize: 18,
                            padding: Constants.statusBarHeight / 4,
                            paddingHorizontal: Constants.statusBarHeight / 3,
                          }}
                        />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Textpopins
                        style={{
                          color: "rgba(255,255,255,.7)",
                          fontSize: 22,
                        }}
                      >
                        {this.state.price} ₼
                      </Textpopins>
                      <Textpopins
                        style={{
                          color: "rgba(255,255,255,.7)",
                          fontSize: 14,
                        }}
                      >
                        {t("barcode.paying.totalBalance")}
                      </Textpopins>
                    </View>
                    {this.state.card != null ? (
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Textpopins
                          style={{
                            color: "rgba(255,255,255,.7)",
                            fontSize: 20,
                          }}
                        >
                          {this.state.card.price} ₼
                        </Textpopins>
                        <Textpopins
                          style={{
                            color: "rgba(255,255,255,.7)",
                            fontSize: 14,
                          }}
                        >
                          {t("barcode.paying.cardBalance")}
                        </Textpopins>
                      </View>
                    ) : null}

                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#AF0045",
                          borderTopLeftRadius: Constants.statusBarHeight,
                          borderTopRightRadius: Constants.statusBarHeight,
                          borderBottomRightRadius: Constants.statusBarHeight,
                          borderBottomLeftRadius: Constants.statusBarHeight,
                        }}
                        onPress={() => this.next()}
                      >
                        <Textpopins
                          style={{
                            color: "rgba(255,255,255,.7)",
                            fontSize: 14,
                            padding: Constants.statusBarHeight / 4,
                            paddingHorizontal: Constants.statusBarHeight / 3,
                          }}
                        >
                          {t("bucket.header.cartlists.finishpayment")}
                        </Textpopins>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={[styles.header, styles.center]}>
                  <Camera
                    style={{
                      width: width / 1,
                      height: "100%",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                    type="back"
                    focusable={true}
                    onBarCodeScanned={(item) => {
                      this.barcodeScanned(item.data);
                    }}
                    autoFocus={true}
                    focusDepth={10}
                    videoStabilizationMode={500}
                  >
                    <BarcodeMask
                      outerMaskOpacity={0.6}
                      edgeBorderWidth={3}
                      edgeColor={"#C90052"}
                      animatedLineColor="#DD2C00"
                      animatedLineHeight={2}
                      showAnimatedLine={true}
                      animated={true}
                      animatedLineWidth={"90%"}
                      lineAnimationDuration={1400}
                      useNativeDriver={true}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        textAlign: "center",
                        margin: "auto",
                        padding: "auto",
                      }}
                      width={width / 1.5}
                      height={width / 2.7}
                    />
                  </Camera>
                </View>
                <View style={styles.content}>
                  <View
                    style={{
                      backgroundColor: "#AF0045",
                      width: width,
                      height: 40,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: Constants.statusBarHeight,
                        paddingVertical: Constants.statusBarHeight / 4,
                        flexDirection: "column",
                        zIndex: 10,
                      }}
                    >
                      <Textpopins
                        style={{
                          color: "#fff",
                        }}
                      >
                        {t("barcode.paying.productCount")} &nbsp;
                        {this.props.bucketitems.length}
                      </Textpopins>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: Constants.statusBarHeight / 3,
                        paddingVertical: Constants.statusBarHeight / 3,
                        flexDirection: "column",
                      }}
                      onPress={() => this.setState({ active: true })}
                    >
                      <AntDesign
                        name="edit"
                        size={24}
                        style={{ marginRight: Constants.statusBarHeight / 4 }}
                        color="#ffffff"
                      />
                    </TouchableOpacity>
                  </View>

                  <List style={[styles.container, styles.center]}>
                    {this.renderContent()}
                  </List>
                </View>
              </View>
            )}
          </View>
        )}
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
    addtoCard: (product) => dispatch({ type: "ADD_TO_CART", payload: product }),
    updateVal: (product, value) =>
      dispatch({ type: "UPDATE_CART", payload: product }),
    deleteCard: (product) =>
      dispatch({ type: "REMOVE_FROM_CART", payload: product }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BarcodeHome);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.3,
    backgroundColor: "#5C0082",
  },
  content: {
    flex: 0.6,
  },
  footer: {
    flex: 0.1,
    backgroundColor: "#5C0082",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
