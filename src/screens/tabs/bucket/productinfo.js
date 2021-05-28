import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";
import { t } from "../../../functions/lang";
import { Left, Body, Right, Button } from "native-base";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";
import Header from "./components/BucketHeader";

const { width, height } = Dimensions.get("window");
import Constants from "expo-constants";

export default class ProductInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: true,
      datas: null,
      product: null,
    };
  }

  getInfo() {
    this.setState({ refresh: true });
    // const params = this.props.route.params;
    // const { uid } = params;
    fetch("http://admin.paygo.az/api/customers/products/1/1_4607154694763")
      .then((response) => response.json()) 
      .then((json) => {
        console.log(json);
        this.setState({
          product: json,
        });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ refresh: false });
      });
  }

  componentDidMount() {
    this.getInfo();
  }

  content() {
    const header = (image) => {
      return (
        <ImageBackground
          resizeMode="contain"
          source={{
            uri:
              image ??
              "https://micoedward.com/wp-content/uploads/2018/04/Love-your-product.png",
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <View
            style={{
              width,
              flexDirection: "row",
              height: 25,
              position: "absolute",
              bottom: Constants.statusBarHeight / 2,
              left: 0,
              right: 0,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.addtoCard(this.state.product)}
              style={styles.addToCart}
            >
              <AntDesign name="shoppingcart" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addToCart}
              onPress={() => this.props.addWishList(this.state.product)}
            >
              {/* {this.props.wishitems.find(
                (element) => element.id == this.state.product.id
              ) ? (
                <AntDesign name="heart" size={24} color="black" />
              ) : (
                <AntDesign name="hearto" size={24} color="black" />
              )} */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.addToCart}>
              <Textpopins>{this.state.product.price} ₼</Textpopins>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      );
    };

    const contentArena = (product) => (
      <ScrollView style={{ flexDirection: "column" }}>
        <Textpopins
          style={{
            margin: Constants.statusBarHeight,
            fontSize: 30,
            fontWeight: "bold",
            color: "#5C0082",
          }}
        >
          {product.title}
        </Textpopins>
        <Textpopins
          style={{
            fontSize: 15,
            color: "rgba(0,0,0,.6)",
            marginHorizontal: Constants.statusBarHeight / 2,
            marginBottom: Constants.statusBarHeight,
          }}
        >
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
          qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
          dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
          quia non numquam eius modi tempora incidunt ut labore et dolore magnam
          aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
          exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
          ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
          ea voluptate velit esse quam nihil molestiae consequatur, vel illum
          qui dolorem eum fugiat quo voluptas nulla pariatur?" "Sed ut
          perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
          inventore veritatis et quasi architecto beatae vitae dicta sunt
          explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
          odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
          voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
          quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
          eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
          voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem
          ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
          consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate
          velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum
          fugiat quo voluptas nulla pariatur?"
        </Textpopins>
      </ScrollView>
    );

    if (this.state.refresh) {
      return (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#5C0082" />
        </View>
      );
    } else {
      if (this.state.product || this.state.product != null) {
        return (
          <View style={styles.container}>
            <View style={styles.header}>
              {/* <Header button={true} title={this.state.product.title} /> */}
            </View>
            <View style={styles.content}>
              <View style={styles.top}>{header(this.state.product.image)}</View>
              <View style={styles.footer}>
                {contentArena(this.state.product)}
              </View>
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <View style={styles.header}>
              {/* <Header button={true} title={t("actions.noResult")} /> */}
            </View>
            <View style={styles.content}>
              <Textpopins
                children={t("actions.noResult")}
                style={styles.noResult}
              />
            </View>
          </View>
        );
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fff" style="dark" />
        {this.content()}
      </SafeAreaView>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     wishitems: state.wishitems,
//     bucketitems: state.bucketitems,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     addtoCard: (product) => dispatch({ type: "ADD_TO_CART", payload: product }),
//     removewishlist: (product) =>
//       dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product }),
//     addWishList: (product) =>
//       dispatch({ type: "ADD_TO_WISHLIST", payload: product }),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ProductInfo);

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
  top: {
    flex: 1,
  },
  footer: {
    flex: 4,
    marginTop: 5,
    flexDirection: "column",
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
  addToCart: {
    paddingHorizontal: Constants.statusBarHeight,
    paddingTop: 6,
    paddingBottom: 30,
    backgroundColor: "#fff",
    borderRadius: Constants.statusBarHeight,
    marginRight: 3,
  },
});
