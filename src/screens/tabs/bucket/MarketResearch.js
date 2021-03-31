import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import BucketHeader from "./components/BucketHeader";
import { connect } from "react-redux";
import { t } from "../../../functions/lang";
import { Thumbnail } from "native-base";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";
const { width, height } = Dimensions.get("window");
import Constants from "expo-constants";

const inCata = [
  {
    id: 1,
    image: "https://picsum.photos/149",
    name: "Category Name 1",
  },
  {
    id: 2,
    image: "https://picsum.photos/149",
    name: "Category Name 2",
  },
  {
    id: 3,
    image: "https://picsum.photos/149",
    name: "Category Name 3",
  },
  {
    id: 4,
    image: "https://picsum.photos/149",
    name: "Category Name 4",
  },
  {
    id: 5,
    image: "https://picsum.photos/149",
    name: "Category Name 5",
  },
  {
    id: 6,
    image: "https://picsum.photos/149",
    name: "Category Name 6",
  },
  {
    id: 7,
    image: "https://picsum.photos/149",
    name: "Category Name 7",
  },
  {
    id: 8,
    image: "https://picsum.photos/149",
    name: "Category Name 8",
  },
  {
    id: 9,
    image: "https://picsum.photos/149",
    name: "Category Name 9",
  },
  {
    id: 10,
    image: "https://picsum.photos/149",
    name: "Category Name 10",
  },
];

const products = [
  {
    id: 1,
    image: "https://picsum.photos/130",
    name: "Product1",
    category: 1,
    qyt: 1,
    price: 20,
  },
  {
    id: 2,
    image: "https://picsum.photos/120",
    name: "Product2",
    category: 1,
    qyt: 0.351,
    price: 30,
  },
  {
    id: 3,
    image: "https://picsum.photos/110",
    name: "Product3",
    category: 3,
    qyt: 0.321,
    price: 1.2,
  },
  {
    id: 4,
    image: "https://picsum.photos/100",
    name: "Product4",
    category: 4,
    qyt: 0.331,
    price: 1.5,
  },
  {
    id: 4,
    image: "https://picsum.photos/100",
    name: "Product4",
    category: 4,
    qyt: 0.331,
    price: 1.5,
  },
  {
    id: 4,
    image: "https://picsum.photos/100",
    name: "Product4",
    category: 4,
    qyt: 0.331,
    price: 1.5,
  },
  {
    id: 5,
    image: "https://picsum.photos/150",
    name: "Product5",
    category: 5,
    qyt: 0.5,
    price: 3,
  },
];

class InCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cat: [],
      refresh: true,
      product: [],
    };
  }

  getInfo() {
    const params = this.props.route.params;
    const { catid } = params;
    var data = [];
    var product = [];
    inCata.map((element) => {
      if (element.id == catid) {
        data = inCata[catid];
      }
    });
    products.map((item) => {
      if (item.category == catid) {
        product.push(item);
      }
    });
    this.setState({ product });
    this.setState({ cat: data });
    this.setState({ refresh: false });
  }

  componentDidMount() {
    this.setState({ refresh: true });
    this.getInfo();
  }

  renderProducts({ item, index }) {
      
    var that = this;

    function wishorunwish(id) {
      if (
        that.props.wishitems !== null ||
        that.props.wishitems !== [] ||
        that.props.wishitems.length !== 0 ||
        that.props.wishitems.length > 0
      ) {
        return that.props.wishitems.map((element) => {
          if (element.id == id) {
            return (
              <TouchableOpacity
                style={{
                  padding: 3,
                  alignContent: "center",
                  textAlign: "center",
                  backgroundColor: "#fff",
                }}
                onPress={() => that.props.removewishlist(products[id])}
              >
                <AntDesign name="heart" size={20} color="#7c9d32" />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                style={{
                  padding: 3,
                  alignContent: "center",
                  textAlign: "center",
                  backgroundColor: "#fff",
                }}
                onPress={() => that.props.addWishList(products[id])}
              >
                <AntDesign name="hearto" size={20} color="#7c9d32" />
              </TouchableOpacity>
            );
          }
        });
      } else {
        return (
          <TouchableOpacity
            style={{
              padding: 3,
              alignContent: "center",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
            onPress={() => that.props.addWishList(products[id])}
          >
            <AntDesign name="hearto" size={20} color="#7c9d32" />
          </TouchableOpacity>
        );
      }
    }

    return (
      <TouchableOpacity
        key={index}
        style={{
          width: 150,
          height: 150,
          borderRadius: 0,
        }}
        onPress={() =>
            that.props.navigation.navigate("ProductInfo", {
              uid: item.id,
            })
          }
      >
        <Thumbnail
          source={{ uri: item.image }}
          resizeMode="cover"
          resizeMethod="resize"
          style={{
            borderRadius: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            alignContent: "center",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {wishorunwish(item.id)}
          <TouchableOpacity
            style={{
              padding: 3,
              alignContent: "center",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
            onPress={() => this.props.addtoCard(item)}
          >
            <MaterialIcons name="add-shopping-cart" size={20} color="#7c9d32" />
          </TouchableOpacity>
        </View>
        <Text
          children={item.name}
          style={{
            position: "absolute",
            bottom: 0,
            left: -1,
            fontSize: 14,
            backgroundColor: "#fff",
            padding: 3,
            borderRadius: 0,
            zIndex: 15,
            color: "#7c9d32",
          }}
        />
        <Text
          style={{
            position: "absolute",
            right: 0,
            borderRadius: 0,
            backgroundColor: "#1E88E5",
            padding: 3,
          }}
        >
          <Text
            children={item.price + "₼"}
            style={{
              textAlign: "right",
              fontSize: 11,
              color: "#fff",
            }}
          />
        </Text>
      </TouchableOpacity>
    );
  }

  renderContent() {
    if (this.state.refresh) {
      return (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#7c9d32" />
        </View>
      );
    } else {
      return (
        <View style={[styles.container, styles.center]}>
          <StatusBar backgroundColor="#fff" style="dark" />
          <View>
            <View style={styles.header}>
              <BucketHeader button={true} title={this.state.cat.name} />
            </View>
            <View style={styles.contentArena}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignContent: "center",
                  paddingHorizontal: 5,
                }}
              >
                <ImageBackground
                  source={{ uri: this.state.cat.image }}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                  resizeMode="cover"
                  resizeMethod="scale"
                />
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    style={{ fontSize: 14, color: "#000", flexWrap: "wrap" }}
                    children={this.state.cat.desc}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.center,
                  {
                    paddingVertical: 15,
                  },
                ]}
              >
                <Textpopins
                  children="Products"
                  style={{
                    fontSize: 25,
                    color: "rgba(0,0,0,.9)",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                />
              </View>
              {this.state.product == null ? (
                <View style={[styles.center, styles.container]}>
                  <Textpopins
                    children={t("actions.noResult")}
                    style={styles.noResult}
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.container,
                    
                  ]}
                >
                  <FlatList
                    style={{ flex: 1 }}
                    data={this.state.product}
                    renderItem={this.renderProducts.bind(this)}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" style="dark" />
        {this.renderContent()}
      </View>
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
    addtoCard: (product) => dispatch({ type: "bucketitems/ADD_TO_CART", payload: product }),
    removewishlist: (product) =>
      dispatch({ type: "wishitems/REMOVE_FROM_WISHLIST", payload: product }),
    addWishList: (product) =>
      dispatch({ type: "wishitems/ADD_TO_WISHLIST", payload: product }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InCustomer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: width,
    height: "20%",
    marginTop: Constants.statusBarHeight,
  },
  contentArena: {
    width: width,
    height: "80%",
    flexDirection: "column",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  contentHeader: {
    flexDirection: "row",
    height: "25%",
    justifyContent: "space-between",
  },
  contentBody: {
    flexDirection: "row",
    height: "25%",
    justifyContent: "space-between",
  },
  noResult: {
    color: "#D50000",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
});
