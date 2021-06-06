import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import Header from "./components/BucketHeader";
const { width, height } = Dimensions.get("screen");
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { t } from "../../../functions/lang";
import { connect } from "react-redux";
import Textpopins from "../../../functions/screenfunctions/text";
import { Button } from "native-base";
import Filter from "./components/filter";
import axios from "axios";
import {
  convertaz,
  get_image,
  string_to_slug,
} from "../../../functions/standart/helper";

class BucketHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: null,
      activeFilter: false,
      brands: null,
      refresh: true,
      customer: 0,
      active: false,
      loadingExtraData: false,
      page: 1,
    };
  }

  componentDidMount() {
    this.setState({ refresh: true });
    this.getInfo();
  }

  async getInfo() {
    await axios
      .get("actions/shops/" + this.props.route.params.checkid)
      .then((e) => {
        this.setState({
          customer: e.data.customer,
        });
      })
      .catch((e) => {
        console.log(e);
      });
    var cat = [];

    await axios
      .get(
        "customers/products/" + this.state.customer + "?page=" + this.state.page
      )
      .then((e) => {
        var datas =
          this.state.page === 1
            ? e.data.data
            : [...this.state.datas, ...e.data.data];

        datas.map((es) => {
          var found = cat.find(
            (element) => element.slug == string_to_slug(es.home_cat)
          );

          if (!found) {
            var d = {
              label: es.home_cat,
              slug: string_to_slug(es.home_cat),
            };
            cat.push(d);
          }
        });

        this.setState({
          datas: datas,
          brands: cat,
        });
      })
      .finally(() => {
        this.setState({ refresh: false });
      });
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
            "customers/products/" +
              this.state.customer +
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

  addProduct(item) {
    var data = item;
    data.qyt = 1;
    this.props.addtoCard(data);
  }

  renderHorizontalList() {
    return this.state.brands.map((e) => {
      return (
        <TouchableOpacity
          style={styles.topListsProduct}
          onPress={() =>
            this.props.navigation.navigate("InCustomer", {
              catid: e.label,
              customer: this.state.customer,
            })
          }
        >
          <Text style={styles.productTitle}>{convertaz(e.label)}</Text>
        </TouchableOpacity>
      );
    });
  }

  renderFlatList({ item, index }) {
    return (
      <TouchableOpacity
        style={styles.product}
        key={index}
        onPress={() =>
          this.props.navigation.navigate("ProductInfo", {
            customer: this.state.customer,
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
            <Textpopins>{item.price}₼</Textpopins>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Header
            button
            title={t("bucket.header.tabtitle")}
            checkid={this.props.route.params.checkid}
            {...this.props}
          />
        </View>
        <View style={[styles.content, { flex: 0.9 }]}>
          <View style={styles.top}>
            <ScrollView
              style={styles.topLists}
              alwaysBounceVertical={true}
              horizontal={true}
            >
              {this.state.brands != null ? this.renderHorizontalList() : null}
            </ScrollView>
          </View>
          <Button
            large
            style={[
              styles.filterButton,
              {
                right: this.state.activeFilter
                  ? 0
                  : -Constants.statusBarHeight / 2,
              },
            ]}
            onPress={() =>
              this.setState({ activeFilter: !this.state.activeFilter })
            }
          >
            <Feather name="filter" size={24} color="#fff" />
          </Button>
          <View style={styles.footer}>
            {this.state.refresh ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  textAlign: "center",
                }}
              >
                <ActivityIndicator
                  color="#5C0082"
                  animating={true}
                  size="large"
                />
              </View>
            ) : (
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
            )}
          </View>
          {this.state.activeFilter ? (
            <Filter
              active={this.state.activeFilter}
              closeModal={() =>
                this.setState({ activeFilter: !this.state.activeFilter })
              }
              searchFilter={() =>
                this.setState({ activeFilter: !this.state.activeFilter })
              }
              brands={this.state.brands}
            />
          ) : null}
        </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(BucketHome);

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
    flex: 0.075,
  },
  footer: {
    flex: 0.925,
    marginTop: 5,
    flexDirection: "column",
  },
  topLists: {
    flexDirection: "row",
    marginTop: 5,
  },
  topListsProduct: {
    backgroundColor: "#fff",
    borderRadius: Constants.statusBarHeight * 2,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: Constants.statusBarHeight,
    marginRight: Constants.statusBarHeight / 3,
    flexDirection: "row",
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
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
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
