import React from "react";
import {
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
import { t } from "../../../functions/lang";
const { width } = Dimensions.get("screen");
import Textpopins from "../../../functions/screenfunctions/text";
import { get_image } from "../../../functions/standart/helper";
import { Thumbnail, List } from "native-base";
import axios from "axios";

class Campaigns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: null,
      customers: null,
      loadingExtraData: false,
      page: 1,
      refresh: true,
    };
  }

  async getInfo() {
    this.setState({ refresh: false });

    await axios.get("customers/customers").then((e) => {
      this.setState({
        customers: e.data,
      });
    });
    await axios
      .get("customers/campaigns" + "?page=" + this.state.page)
      .then((e) => {
        console.log(e.data);
        var datas =
          this.state.page === 1
            ? e.data.data
            : [...this.state.datas, ...e.data.data];
        this.setState({
          datas: datas,
        });
      });
    this.setState({
      refresh: false,
    });
    this.renderContent();
  }

  componentDidMount() {
    this.getInfo();
  }

  LoadMoreRandomData = () => {
    this.setState(
      {
        loadingExtraData: true,
        page: this.state.page + 1,
      },
      () => {
        axios
          .get("customers/campaigns" + "?page=" + this.state.page)
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

  renderHorizontalList() {
    if (this.state.customers != null) {
      return this.state.customers.map((element) => {
        return (
          <TouchableOpacity
            style={styles.topListsProduct}
            onPress={() =>
              this.props.navigation.navigate("Customer", {
                customer: element.id,
                customername: element.name["az_name"],
              })
            }
          >
            {element.logo ? (
              <Image
                source={{ uri: get_image(element.logo) }}
                resizemode="contain"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  // marginRight: Constants.statusBarHeight,
                }}
              />
            ) : null}
            <Textpopins style={styles.productTitle}>
              {element.name["az_name"]}
            </Textpopins>
          </TouchableOpacity>
        );
      });
    }
  }

  renderFlatList({ item, index }) {
    return (
      <TouchableOpacity
        style={[styles.product, { position: "relative", zIndex: 1 }]}
        key={index}
        onPress={() =>
          this.props.navigation.navigate("Campaign", {
            uid: item.id,
          })
        }
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 5,
            backgroundColor: "#5C0082",
            padding: 5,
          }}
        >
          <Textpopins
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {item.customer.name["az_name"]}
          </Textpopins>
        </View>

        <Thumbnail
          source={{
            uri: get_image(item.images[0], "campaigns"),
          }}
          resizemode="contain"
          style={{
            width: width,
            height: width / 2.5,
            borderRadius: 0,
          }}
        />
        <View>
          <Textpopins style={[styles.productTitle, { color: "#5C0082" }]}>
            {item.az_name}
          </Textpopins>
          <Textpopins
            style={[
              styles.productDescription,
              {
                marginLeft: -25,
              },
            ]}
          >
            {item.description["az_description"].substring(0, 80)}
          </Textpopins>
          {item.price != null ? (
            <Textpopins style={styles.productPrice}>{item.price} ₼</Textpopins>
          ) : null}
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

  renderContent() {
    if (this.state.refresh) {
      return (
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
          <ActivityIndicator color="#5C0082" animating={true} size="large" />
        </View>
      );
    } else {
      if (this.state.datas != null) {
        return (
          <List
            style={{
              width: width,
              height: "100%",
              marginTop: Constants.statusBarHeight,
              padding: 0,
            }}
          >
            {this.state.datas.length > 10 ? (
              <FlatList
                data={this.state.datas}
                numColumns={1}
                renderItem={this.renderFlatList.bind(this)}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={() => this.LoadMoreRandomData()}
                ListFooterComponent={this.renderFooter}
                enableEmptySections={true}
              />
            ) : (
              <FlatList
                data={this.state.datas}
                numColumns={1}
                renderItem={this.renderFlatList.bind(this)}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
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
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <ScrollView
            style={styles.topLists}
            alwaysBounceVertical={true}
            horizontal={true}
          >
            {this.renderHorizontalList()}
          </ScrollView>
        </View>
        <View style={styles.content}>
          <ScrollView style={styles.productLists} vertical={true}>
            {this.renderContent()}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default Campaigns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flex: 0.075,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center",
    marginTop: Constants.statusBarHeight,
  },
  content: {
    flex: 0.925,
    backgroundColor: "#ebecf0",
    borderTopLeftRadius: Constants.statusBarHeight,
    borderTopRightRadius: Constants.statusBarHeight,
  },
  topLists: {
    flexDirection: "row",
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
    borderColor: "#000",
    borderWidth: 1,
    elevation: 15,
  },
  productLists: {
    flexDirection: "row",
  },
  product: {
    width: width,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: Constants.statusBarHeight,
    marginBottom: Constants.statusBarHeight / 2,
    flexDirection: "column",
    marginLeft: 2,
  },
  productTitle: {
    fontSize: 20,
    color: "rgba(0,0,0,.8)",
    fontWeight: "bold",
    textAlign: "center",
  },
  productDescription: {
    fontSize: 14,
    textAlign: "justify",
    color: "rgba(0,0,0,.6)",
  },
  productPrice: {
    color: "#5C0082",
    fontSize: 16,
    textAlign: "right",
  },
  noResult: {
    color: "#D50000",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
