import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";

const { width } = Dimensions.get("window");
import Constants from "expo-constants";
import Header from "./components/BucketHeader";
import axios from "axios";
import { convertaz, get_image } from "../../../functions/standart/helper";

class InCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: true,
      datas: null,
      loadingExtraData: false,
      page: 1,
    };
  }

  async getInfo() {
    this.setState({
      refresh: true,
    });
    await axios
      .get(
        "customers/product/bycat/" +
          this.props.route.params.customer +
          "/" +
          this.props.route.params.catid +
          "?page=" +
          this.state.page
      )
      .then((e) => {
        console.log(e);
        var datas =
          this.state.page === 1
            ? e.data.data
            : [...this.state.datas, ...e.data.data];

        this.setState({
          datas: datas,
        });
      })
      .finally((e) => {
        this.setState({
          refresh: false,
        });
      });
  }

  componentDidMount() {
    this.getInfo();
  }

  addProduct(item) {
    var data = item;
    data.qyt = 1;
    this.props.addtoCard(data);
  }

  LoadMoreRandomData = () => {
    this.setState(
      {
        loadingExtraData: true,
        page: this.state.page + 1,
      },
      () => {
        axios
          .get(
            "customers/product/bycat/" +
              this.props.route.params.customer +
              "/" +
              this.props.route.params.catid +
              "?page=" +
              this.state.page
          )
          .then((e) => {
            var datas =
              this.state.page === 1
                ? e.data.data
                : [...this.state.datas, ...e.data.data];
            this.setState({
              datas: datas,
            });
          })
          .finally(() => {
            this.setState({ refresh: false, loadingExtraData: false });
          });
      }
    );
  };

  renderFooter = () => {
    if (this.state.loadingExtraData) {
      return (
        //Footer View with Load More button
        <View
          style={[
            styles.center,
            {
              flex: 1,
              marginTop: Constants.statusBarHeight,
            },
          ]}
        >
          <ActivityIndicator color="#5C0082" size="large" />
        </View>
      );
    } else {
      return (
        //Footer View with Load More button
        <View
          style={[
            styles.center,
            {
              flex: 1,
              marginTop: Constants.statusBarHeight,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.LoadMoreRandomData}
            //On Click of button load more data
            style={[
              styles.center,
              {
                backgroundColor: "#5C0082",
                flex: 1,
                width,
              },
            ]}
          >
            <Textpopins
              style={{
                fontSize: 20,
                color: "#fff",
              }}
            >
              Load More
            </Textpopins>
            {this.state.refresh ? (
              <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
            ) : null}
          </TouchableOpacity>
        </View>
      );
    }
  };

  renderFlatList({ item, index }) {
    return (
      <TouchableOpacity
        style={styles.product}
        key={index}
        onPress={() =>
          this.props.navigation.navigate("ProductInfo", {
            customer: this.props.route.params.customer,
            barcode: item.barcode,
          })
        }
      >
        <Image
          source={{
            uri: item.image
              ? get_image(item.image)
              : "https://micoedward.com/wp-content/uploads/2018/04/Love-your-product.png",
          }}
          style={{
            width: width / 2.5,
            height: width / 2.5,
            borderRadius: width / 2.5,
          }}
        />
        <Text style={[styles.productTitle, { color: "#5C0082" }]}>
          {item.name}
        </Text>
        <Text style={styles.productDescription}>
          {convertaz(item.home_cat)}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => this.addProduct(item)}
            style={styles.addToCart}
          >
            {this.props.bucketitems.find((element) => element.id == item.id) ? (
              <FontAwesome name="cart-arrow-down" size={24} color="black" />
            ) : (
              <AntDesign name="shoppingcart" size={24} color="black" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addToCart}
            onPress={() => this.props.addWishList(item)}
          >
            {this.props.wishitems.find((element) => element.id == item.id) ? (
              <AntDesign name="heart" size={23} color="black" />
            ) : (
              <AntDesign name="hearto" size={23} color="black" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.addToCart}>
            <Textpopins>{item.price} ₼</Textpopins>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  renderContent() {
    if (this.state.refresh) {
      return (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#5C0082" />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
          <Header
            button
            title={convertaz(this.props.route.params.catid)}
            {...this.props}
          />
          </View>

          <View style={[styles.content, { flex: 0.9 }]}>
            <View style={[styles.footer, { flex: 1 }]}>
              <ScrollView style={styles.productLists} vertical={true}>
                <FlatList
                  data={this.state.datas}
                  numColumns={2}
                  renderItem={this.renderFlatList.bind(this)}
                  keyExtractor={(item, index) => index.toString()}
                  onEndReachedThreshold={0.5}
                  onEndReached={() => this.LoadMoreRandomData()}
                  ListFooterComponent={this.renderFooter}
                  enableEmptySections={true}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fff" style="dark" />
        {this.renderContent()}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    wishitems: state.wishitems,
    bucketitems: state.bucketitems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addtoCard: (product) => dispatch({ type: "ADD_TO_CART", payload: product }),
    addWishList: (product) =>
      dispatch({ type: "ADD_TO_WISHLIST", payload: product }),
    removewishlist: (product) =>
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InCustomer);

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
  top: {
    flex: 0.1,
  },
  footer: {
    flex: 0.9,
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
  productLists: {
    flexDirection: "row",
    marginTop: 5,
  },
  product: {
    width: width / 1.9,
    height: width / 1.9,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: Constants.statusBarHeight,
  },
  productTitle: {
    fontSize: 14,
    color: "rgba(0,0,0,.8)",
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 13,
    color: "rgba(0,0,0,.6)",
  },
  actions: {
    position: "absolute",
    top: 0,
    left: 3,
    flexDirection: "column",
    flex: 1,
  },
  addToCart: {
    paddingHorizontal: Constants.statusBarHeight / 3,
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderRadius: Constants.statusBarHeight,
    marginVertical: 2,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  filterButton: {
    position: "absolute",
    right: -Constants.statusBarHeight / 2,
    top: "50%",
    backgroundColor: "#5C0082",
    padding: Constants.statusBarHeight / 2,
    paddingVertical: Constants.statusBarHeight / 3,
    zIndex: 9999999,
  },
});
