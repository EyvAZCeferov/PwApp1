import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";

const { width, height } = Dimensions.get("window");
import Constants from "expo-constants";
import Header from "./components/Header";
import { get_image } from "../../../functions/standart/helper";
import { Thumbnail, List } from "native-base";
import axios from "axios";
class Customer extends React.Component {
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
    this.setState({ refresh: true });
    await axios
      .get(
        "customers/campaigns/customer/" +
          this.props.route.params.customer +
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
      });
    this.setState({
      refresh: false,
    });
    this.renderContent();
  }

  componentDidMount() {
    this.getInfo();
  }

  renderFlatList({ item, index }) {
    return (
      <TouchableOpacity
        style={styles.product}
        key={index}
        onPress={() =>
          this.props.navigation.navigate("Campaign", {
            uid: item.id,
          })
        }
      >
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

  LoadMoreRandomData = () => {
    this.setState(
      {
        loadingExtraData: true,
        page: this.state.page + 1,
      },
      () => {
        axios
          .get(
            "customers/campaigns/customer/" +
              this.props.route.params.customer +
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
              button={true}
              title={this.props.route.params.customername}
            />
          </View>

          <View style={styles.content}>
            <ScrollView style={styles.productLists} vertical={true}>
              {this.state.datas != null && this.state.datas.length > 10 ? (
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
            </ScrollView>
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

export default Customer;

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
  },
  productDescription: {
    fontSize: 14,
    color: "rgba(0,0,0,.6)",
  },
  productPrice: {
    color: "#5C0082",
    fontSize: 16,
  },
});
