import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import firebase from "../../../functions/firebase/firebaseConfig";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import { t } from "../../../functions/lang";
import {
  Body,
  Button,
  Card,
  CardItem,
  Left,
  Right,
  Thumbnail,
  Header,
} from "native-base";
import Constants from "expo-constants";
import Textpopins from "../../../functions/screenfunctions/text";

const { width, height } = Dimensions.get("window");
export default class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oneService: null,
      campaigns: null,
      refresh: true,
    };
  }

  async getInfo() {
    const params = this.props.route.params;
    if (params.uid != null) {
      firebase
        .database()
        .ref("services/" + params.uid)
        .on("value", (data) => {
          this.setState({
            oneService: data.toJSON(),
          });
        });
      firebase
        .database()
        .ref("campaigns")
        .orderByChild("category_id")
        .limitToFirst(10)
        .on("value", (data) => {
          var keys = [];
          var cards = [];
          data.forEach((element) => {
            keys.push(element.key);
          });
          keys.map((element) => {
            firebase
              .database()
              .ref("campaigns/" + element + "/category_id/" + params.uid)
              .on("value", (data) => {
                console.log(data);
                data.forEach((d) => {
                  cards.push(d.val());
                });
              });
          });

          this.setState({
            campaigns: null,
            refresh: false,
          });
        });
    }
  }

  componentDidMount() {
    this.getInfo();
  }

  name(item) {
    if (Localization.locale == "en" || Localization.locale === "en") {
      if (item.en_title) {
        return item.en_title;
      } else {
        return "Null";
      }
    } else if (Localization.locale == "ru" || Localization.locale === "ru") {
      if (item.ru_title) {
        return item.ru_title;
      } else {
        return "Null";
      }
    } else if (Localization.locale == "az" || Localization.locale === "az") {
      if (item.az_title) {
        return item.az_title;
      } else {
        return "Null";
      }
    }
  }

  renderCards({ item, index }) {
    var that = this;

    function name(item) {
      if (Localization.locale == "en" || Localization.locale === "en") {
        if (item.en_title) {
          return item.en_title;
        } else {
          return "Null";
        }
      } else if (Localization.locale == "ru" || Localization.locale === "ru") {
        if (item.ru_title) {
          return item.ru_title;
        } else {
          return "Null";
        }
      } else if (Localization.locale == "az" || Localization.locale === "az") {
        if (item.az_title) {
          return item.az_title;
        } else {
          return "Null";
        }
      }
    }

    if (this.state.campaign != null) {
      return (
        <Card style={styles.card} key={index}>
          <CardItem header>
            <Left>
              <Thumbnail
                source={{
                  uri: item.marketIcon,
                }}
                style={{ maxWidth: 50, maxHeight: 50, padding: 2, margin: 0 }}
              />
            </Left>
            <Body style={styles.body}>
              <Textpopins
                style={styles.titleColor}
                children={item.marketName}
              />
              <Textpopins
                textColor="rgba(0,0,0,0,.5)"
                children={item.created_at}
              />
            </Body>
            <Right>
              <Button
                transparent
                onPress={() =>
                  that.props.navigate("OtherPages", {
                    screen: "OneCampaign",
                    params: {
                      uid: item.id,
                    },
                  })
                }
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  marginTop: -10,
                }}
              >
                <FontAwesome name="eye" size={24} color="#6d7587" />
              </Button>
            </Right>
          </CardItem>
          <CardItem cardBody>
            <Thumbnail
              style={styles.thumbBIgImage}
              source={{
                uri: item.images[0]["src"],
              }}
              square
            />
          </CardItem>
          <CardItem footer>
            <Body>
              <Textpopins style={styles.subTitle} children={name(item)} />
            </Body>
          </CardItem>
        </Card>
      );
    } else {
      that.getInfo();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#fff"
          androidStatusBarColor="#fff"
          style={[
            styles.header,
            {
              backgroundColor: "#fff",
              borderBottomColor: "#7c9d32",
              borderBottomWidth: 2,
            },
          ]}
        >
          <StatusBar backgroundColor="#fff" style="dark" />
          <Left>
            <Button
              style={styles.backBtn}
              onPress={() => this.props.navigation.goBack()}
            >
              <Ionicons name="ios-arrow-back" size={24} color="#7c9d32" />
            </Button>
          </Left>
          <Body style={{ textAlign: "center" }}>
            <Text
              children={
                this.state.refresh ? null : this.name(this.state.oneService)
              }
              style={styles.headerBodyText}
            />
          </Body>
        </Header>
        <View style={styles.contentArena}>
          <View style={styles.serviceAbout}>
            {this.state.refresh ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <ActivityIndicator
                  size="large"
                  focusable={true}
                  accessibilityLabel="Hay?"
                  color="#7c9d32"
                />
              </View>
            ) : (
              <ImageBackground
                source={{ uri: "https://picsum.photos/200/300.jpg" }}
                resizeMode="cover"
                resizeMethod="auto"
                fadeDuration={1000}
                accessibilityLabel={this.name(this.state.oneService)}
                accessibilityComponentType="button"
                style={{ width: width / 2, height: "100%" }}
              />
            )}
            {this.state.refresh ? null : (
              <Textpopins
                style={{
                  color: "#010101",
                  fontSize: 25,
                  fontWeight: "bold",
                  width: width / 2,
                  textAlign: "center",
                }}
                children={this.name(this.state.oneService)}
              />
            )}
          </View>
          <View style={styles.otherPost}>
            <ScrollView>
              {this.state.refresh || this.state.campaigns == null ? (
                <View
                  style={{
                    width: width,
                    height: height - height / 3,
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Textpopins
                    style={{
                      color: "red",
                      fontSize: 25,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                    children={t("actions.noResult")}
                  />
                </View>
              ) : (
                <FlatList
                  data={this.state.campaigns}
                  renderItem={this.renderCards.bind(this)}
                  keyExtractor={(item, index) => index.toString()}
                  windowSize={width}
                  zoomScale={1.5}
                  scrollEnabled={true}
                  horizontal={false}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: width,
    marginTop: Constants.statusBarHeight,
  },
  contentArena: {
    width: width,
    flexDirection: "column",
  },
  headerBodyText: {
    color: "#7c9d32",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  backBtn: {
    backgroundColor: "#fff",
    paddingLeft: Constants.statusBarHeight,
    borderWidth: 0,
    shadowColor: "#fff",
    shadowOpacity: 0,
    elevation:0
  },
  serviceAbout: {
    width: width,
    height: "17%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  otherPost: {
    width: "100%",
    height: "73%",
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  subTitle: {
    color: "rgba(0,0,0,.5)",
    fontWeight: "bold",
    fontSize: 15,
    marginVertical: 10,
    width: width - 30,
    marginLeft: 2,
    maxHeight: 20,
  },
  card: {
    margin: 0,
    borderColor: "#fff",
  },
});
