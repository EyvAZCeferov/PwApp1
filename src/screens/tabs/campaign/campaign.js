import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Share,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { t } from "../../../functions/lang";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";
import Header from "./components/Header";
import axios from "axios";
const { width } = Dimensions.get("window");
import Constants from "expo-constants";
import { get_image } from "../../../functions/standart/helper";

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: true,
      campaign: null,
    };
  }

  onShare = async (campaign) => {
    try {
      const result = await Share.share({
        message: campaign.description["az_description"],
        title: campaign.az_name,
        url: "https://paygo.az/" + campaign.slug,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  async getInfo() {
    this.setState({ refresh: true });
    await axios
      .get("customers/campaigns/" + this.props.route.params.uid)
      .then((e) => {
        this.setState({
          campaign: e.data,
        });
      })
      .finally((e) => {
        this.setState({ refresh: false });
        this.content();
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
          source={{ uri: get_image(image, "campaigns") }}
          style={{
            width: width,
            height: width,
            zIndex: 1,
            position: "relative",
          }}
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
              {this.state.campaign.customer.name["az_name"]}
            </Textpopins>
          </View>
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
            {this.state.campaign.price != null ? (
              <TouchableOpacity style={styles.addToCart}>
                <Textpopins>{this.state.campaign.price} ₼</Textpopins>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.addToCart}
              onPress={() => this.onShare(this.state.campaign)}
            >
              <AntDesign name="sharealt" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      );
    };

    const contentArena = (product) => (
      <ScrollView
        style={{
          flexDirection: "column",
          position: "relative",
          marginTop: Constants.statusBarHeight * 8,
        }}
      >
        <Textpopins
          style={{
            marginVertical: Constants.statusBarHeight * 3,
            marginBottom: Constants.statusBarHeight,
            fontSize: 25,
            fontWeight: "bold",
            color: "#5C0082",
            textAlign: "center",
          }}
        >
          {product.az_name}
        </Textpopins>
        <Textpopins
          style={{
            fontSize: 15,
            color: "rgba(0,0,0,.6)",
            marginHorizontal: Constants.statusBarHeight / 2,
            marginBottom: Constants.statusBarHeight,
          }}
        >
          {product.description["az_description"]}
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
      if (this.state.campaign || this.state.campaign != null) {
        return (
          <View style={styles.container}>
            <View style={styles.header}>
              <Header
                button={true}
                title={this.state.campaign.az_name}
                titleLeft
              />
            </View>
            <View style={styles.content}>
              <View style={styles.top}>
                {header(this.state.campaign.images[0])}
              </View>
              <View style={styles.footer}>
                {contentArena(this.state.campaign)}
              </View>
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <View style={styles.header}>
              <Header button={true} title={t("actions.noResult")} />
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

export default Campaign;

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
    width: width,
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
