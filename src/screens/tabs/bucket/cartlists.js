import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  SafeAreaView,
} from "react-native";
import { t } from "../../../functions/lang";
import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Button,
  Thumbnail,
} from "native-base";
import { connect } from "react-redux";
import Constants from "expo-constants";
import Textpopins from "../../../functions/screenfunctions/text";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import NumericInput from "react-native-numeric-input";
import Header from "./components/BucketHeader";
import axios from "axios";
import { convertaz } from "../../../functions/standart/helper";

const { width, height } = Dimensions.get("window");

function CartList(props) {
  const [location_key, setLocation_key] = React.useState(null);
  const [customer, setCustomer] = React.useState(null);
  const [totalBalance, settotalBalance] = React.useState(0);
  const [card, setCard] = React.useState(null);

  React.useEffect((effect) => {
    getInf();
  }, []);

  async function getInf() {
    var cardid = null;
    await axios
      .get("actions/shops/" + props.route.params.checkid)
      .then((e) => {
        setLocation_key(e.data.info["location_key"]);
        setCustomer(e.data.customer);
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
              setCard(e.data);
            })
            .catch((e) => {
              console.log(e);
            });
        }
        priceCollect();
        renderContent();
        renderFooter();
      });
  }

  function pric_e(qyt, price) {
    if (location_key) {
      if (qyt * price[location_key] == 0) {
        return qyt * price["price"];
      } else {
        return qyt * price[location_key];
      }
    } else {
      return qyt * price["price"];
    }
  }

  async function next() {
    if (props.bucketitems.length > 0) {
      props.bucketitems.map(async (e) => {
        var formdata = new FormData();
        var price = pric_e(e.qyt, e.price);
        formdata.append("barcode", convertaz(e.barcode));
        formdata.append("pay_id", props.route.params.checkid);
        formdata.append("product_name", convertaz(e.name));
        formdata.append("product_qyt", e.qyt);
        formdata.append("price", price);
        formdata.append("product_edv", true);
        await axios.post(
          "actions/products/" + props.route.params.checkid + "/add_pay_item",
          formdata
        );
      });
      var formData = new FormData();
      formData.append("payed", true);
      await axios
        .put("actions/shops/" + props.route.params.checkid, formData)
        .then((e) => {
          props.navigation.navigate("PayThanks", {
            checkid: props.route.params.checkid,
          });
        });
    } else {
      alert("Məhsul yoxdur");
    }
  }

  function renderBucket({ item, index }) {
    return (
      <ListItem
        key={index}
        style={{
          width: width,
          height: 90,
          marginLeft: -Constants.statusBarHeight,
        }}
        onPress={() =>
          props.navigation.navigate("ProductInfo", {
            customer: customer,
            barcode: item.barcode,
          })
        }
      >
        <Left style={{ maxWidth: width / 6 }}>
          <Thumbnail
            source={{ uri: item.image ? get_image(item.image) : null }}
            style={{ maxWidth: "100%" }}
          />
        </Left>
        <Body style={{ maxWidth: width / 3 + 30 }}>
          <Textpopins
            style={{ fontSize: 14 }}
            children={convertaz(item.name)}
          />
          <Textpopins>{pric_e(item.qyt, item.price)} ₼</Textpopins>
        </Body>
        <Right style={{ flexDirection: "row" }}>
          <NumericInput
            value={item.qyt}
            onChange={(value) => {
              props.updateVal({ item, value });
              getInf();
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
              props.removeCart(item);
              getInf();
            }}
          >
            <EvilIcons name="trash" size={30} color="#BF360C" />
          </Button>
        </Right>
      </ListItem>
    );
  }

  function priceCollect() {
    var price = 0;
    props.bucketitems.map((e) => {
      var p = pric_e(e.qyt, e.price);
      price = parseFloat(price) + parseFloat(p);
    });
    settotalBalance(price);
  }

  function renderContent() {
    if (props.bucketitems && props.bucketitems.length > 0) {
      return (
        <List
          style={{
            width: width,
            height: "100%",
            margin: 0,
            padding: 0,
          }}
        >
          <Button
            style={[
              styles.center,
              {
                backgroundColor: "#5C0082",
                zIndex: 150,
                paddingHorizontal: Constants.statusBarHeight,
                position: "absolute",
                flexDirection: "row",
                bottom: "6%",
                right: 0,
                borderTopLeftRadius: Constants.statusBarHeight,
                borderTopRightRadius: Constants.statusBarHeight,
                borderBottomRightRadius: Constants.statusBarHeight,
                borderBottomLeftRadius: Constants.statusBarHeight,
                justifyContent: "space-around",
              },
            ]}
            onPress={() =>
              props.navigation.navigate("BeforeBuy", {
                checkid: checkid,
              })
            }
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

          <FlatList
            data={props.bucketitems}
            renderItem={renderBucket}
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

  function renderFooter() {
    return (
      <View style={{ flex: 1 }}>
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
            {Math.fround(totalBalance).toString().substring(0, 5)} ₼
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
            {Math.fround((((totalBalance * 18) / 100) * 10) / 100)
              .toString()
              .substring(0, 4)}{" "}
            ₼
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
            {t("barcode.paying.balance")}
          </Textpopins>
          <Textpopins
            style={{
              color: "rgba(255,255,255,.7)",
              fontSize: 20,
            }}
          >
            {card ? card.price : 0} ₼
          </Textpopins>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header
          button={true}
          title={t("bucket.header.cartlists.title")}
          {...props}
        />
      </View>

      <View style={styles.content}>{renderContent()}</View>
      <View style={styles.footer}>{renderFooter()}</View>
    </SafeAreaView>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeCart: (product) =>
      dispatch({ type: "REMOVE_FROM_CART", payload: product }),
    updateVal: (product, value) =>
      dispatch({ type: "UPDATE_CART", payload: product }),
  };
};

const mapStateToProps = (state) => {
  return {
    bucketitems: state.bucketitems,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartList);

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
    flex: 0.8,
    backgroundColor: "#ebecf0",
    borderTopLeftRadius: Constants.statusBarHeight,
    borderTopRightRadius: Constants.statusBarHeight,
  },
  footer: {
    flex: 0.15,
    backgroundColor: "#5C0082",
    borderTopLeftRadius: Constants.statusBarHeight,
    borderTopRightRadius: Constants.statusBarHeight,
    paddingHorizontal: Constants.statusBarHeight,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  noResult: {
    color: "#D50000",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  buttonstyle: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
