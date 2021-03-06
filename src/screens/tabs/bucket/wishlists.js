import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  SafeAreaView,
  Image,
} from "react-native";
import Header from "./components/BucketHeader";
import { t } from "../../../functions/lang";
import {
  List,
  ListItem,
  Left,
  Right,
  Body,
  Button,
  Thumbnail,
} from "native-base";
import { connect } from "react-redux";
import Constants from "expo-constants";
import Textpopins from "../../../functions/screenfunctions/text";

const { width, height } = Dimensions.get("window");
import { Ionicons, EvilIcons } from "@expo/vector-icons";

function WishList(props) {
  const [customer, setCustomer] = React.useState(null);

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
        priceCollect();
      });
  }

  function pric_e(qyt, price) {
    return qyt * price;
  }

  function renderBucket({ item, index }) {
    return (
      <ListItem
        key={index}
        style={{
          width: width,
          height: 90,
        }}
        onPress={() =>
          props.navigation.navigate("ProductInfo", {
            customer: customer,
            barcode: item.barcode,
          })
        }
      >
        <Left style={{ maxWidth: width / 4 }}>
          <Image
            source={{
              uri: item.image
                ? get_image(item.image)
                : "https://micoedward.com/wp-content/uploads/2018/04/Love-your-product.png",
            }}
            style={{
              width: width / 5,
              height: width / 5,
              borderRadius: width / 5,
            }}
          />
        </Left>
        <Body style={{ maxWidth: width / 3 + 30 }}>
          <Textpopins style={{ fontSize: 14 }} children={item.name} />
          <Textpopins>{pric_e(item.qyt, item.price)} ₼</Textpopins>
        </Body>
        <Right style={{ flexDirection: "row" }}>
          <Button
            transparent
            style={styles.buttonStyle}
            onPress={() => props.addtoCard(item)}
          >
            <Ionicons name="add" size={30} color="#5C0082" />
          </Button>
          <Button
            transparent
            style={styles.buttonStyle}
            onPress={() => props.removewishlist(item)}
          >
            <EvilIcons name="trash" size={30} color="#BF360C" />
          </Button>
        </Right>
      </ListItem>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header button={true} title={t("bucket.header.wishList.title")} />
      </View>

      <View style={styles.content}>
        {props.wishitems && props.wishitems.length > 0 ? (
          <List
            style={{
              width: width,
              height: "100%",
            }}
          >
            <FlatList
              data={props.wishitems}
              renderItem={renderBucket}
              keyExtractor={(item, index) => index.toString()}
            />
          </List>
        ) : (
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
        )}
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => {
  return {
    wishitems: state.wishitems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addtoCard: (product) => dispatch({ type: "ADD_TO_CART", payload: product }),
    removewishlist: (product) =>
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product }),
    addWishList: (product) =>
      dispatch({ type: "ADD_TO_WISHLIST", payload: product }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WishList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center",
  },
  content: {
    flex: 8,
    backgroundColor: "#ebecf0",
    borderTopLeftRadius: Constants.statusBarHeight,
    borderTopRightRadius: Constants.statusBarHeight,
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
});
