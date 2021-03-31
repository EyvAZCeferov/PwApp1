import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  ImageBackground,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  Left,
  Right,
  Thumbnail,
  Body,
  Button,
  Card,
  CardItem,
} from "native-base";
import HTMLView from "react-native-htmlview";

import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import firebase from "../../../functions/firebase/firebaseConfig";
import Textpopins from "../../../functions/screenfunctions/text";
const { width, height } = Dimensions.get("window");
import { t } from "../../../functions/lang";
export default class Campaigns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customersData: null,
      newsData: null,
      refresh: true,
    };
  }

  getInfo() {
    this.setState({ refresh: true });
    var datas = [];
    var services = [];
    firebase
      .database()
      .ref("campaigns")
      .on("value", (data) => {
        data.forEach((data) => {
          datas.push(data.val());
        });
        this.setState({
          newsData: datas,
        });
      });

      this.setState({
        customersData: [
          {
            id: 1,
            az_title: "TitleAz",
            ru_title: "TitleRu",
            en_title: "TitleEn",
          },
          {
            id: 2,
            az_title: "TitleAzAZ",
            ru_title: "TitleRuRU",
            en_title: "TitleEnEN",
          },
          {
            id: 2,
            az_title: "TitleAzAZ",
            ru_title: "TitleRuRU",
            en_title: "TitleEnEN",
          },
          {
            id: 2,
            az_title: "TitleAzAZ",
            ru_title: "TitleRuRU",
            en_title: "TitleEnEN",
          },
          {
            id: 2,
            az_title: "TitleAzAZ",
            ru_title: "TitleRuRU",
            en_title: "TitleEnEN",
          },
          {
            id: 2,
            az_title: "TitleAzAZ",
            ru_title: "TitleRuRU",
            en_title: "TitleEnEN",
          },
          {
            id: 2,
            az_title: "TitleAzAZ",
            ru_title: "TitleRuRU",
            en_title: "TitleEnEN",
          },
          {
            id: 2,
            az_title: "TitleAzAZ",
            ru_title: "TitleRuRU",
            en_title: "TitleEnEN",
          },
        ],
      });
    firebase
      .database()
      .ref("services")
      .on("value", (data) => {
        data.forEach((data) => {
          services.push(data.val());
        });
        this.setState({
          customersData: services,
        });
      });
    
    this.setState({ refresh: false });
    this.renderContent();
  }

  renderContent() {
    const that =this;

    function renderService({ item, index }) {
  
      function serviceName(item) {
        if (Localization.locale == "en" || Localization.locale === "en") {
          return item.en_title;
        } else if (Localization.locale == "ru" || Localization.locale === "ru") {
          return item.ru_title;
        } else if (Localization.locale == "az" || Localization.locale === "az") {
          return item.az_title;
        }
      }
  
      return (
        <TouchableOpacity
          style={{
            width: width / 3,
            height: "100%",
            marginRight: 4,
            alignContent: "center",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
          onPress={() =>
            that.props.navigation.navigate("Customer", {
              uid: item.id,
            })
          }
        >
          <ImageBackground
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
            source={{ uri: "https://picsum.photos/200/300.jpg" }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
                position: "absolute",
                bottom: 0,
                width: "100%",
                backgroundColor: "rgba(0,0,0,.5)",
              }}
              children={serviceName(item)}
            />
          </ImageBackground>
        </TouchableOpacity>
      );
    }
    
    function renderCards() {
      function name(item) {
        if (Localization.locale == "en" || Localization.locale === "en") {
          return item.en_title;
        } else if (Localization.locale == "ru" || Localization.locale === "ru") {
          return item.ru_title;
        } else if (Localization.locale == "az" || Localization.locale === "az") {
          return item.az_title;
        }
      }
  
      function descr(item) {
        if (Localization.locale == "en" || Localization.locale === "en") {
          return item.en_description;
        } else if (Localization.locale == "ru" || Localization.locale === "ru") {
          return item.ru_description;
        } else if (Localization.locale == "az" || Localization.locale === "az") {
          return item.az_description;
        }
      }
  
      if (that.state.newsData != null) {
        return that.state.newsData.map((item) => {
          return (
            <Card style={{ width: width, maxHeight: 700 }}>
              <CardItem style={{ width: "100%", height: "30%" }} header>
                <Left>
                  <Thumbnail
                    source={{
                      uri: item.marketIcon,
                    }}
                    style={{
                      maxWidth: 100,
                      maxHeight: 100,
                      padding: 2,
                      margin: 0,
                    }}
                  />
                </Left>
                <Body>
                  <Textpopins style={styles.titleColor} children={name(item)} />
  
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <Ionicons name="time" color="#6d7587" size={20} />
                    <Text children={item.created_at} />
                  </TouchableOpacity>
                </Body>
                <Right>
                  <Button
                    transparent
                    onPress={() =>
                      that.props.navigation.navigate("Campaign", {
                        uid: item.id,
                      })
                    }
                  >
                    <FontAwesome name="eye" size={24} color="#6d7587" />
                  </Button>
                </Right>
              </CardItem>
              <CardItem cardBody>
                <Thumbnail
                  source={{
                    uri: item.images[0]["src"],
                  }}
                  square
                  style={{
                    width: width / 2,
                    height: width / 2,
                  }}
                />
                <Text>
                  <HTMLView value={descr(item)} addLineBreaks={true} />
                </Text>
              </CardItem>
            </Card>
          );
        });
      } 
    }

    if (this.state.refresh) {
      return (
        <View
          style={[
            styles.f1,
            {
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <ActivityIndicator color="#7c9d32" size="large" />
        </View>
      );
    } else {
      return (
        <ScrollView style={[styles.f1, { backgroundColor: "#fff" }]}>
          <View style={styles.services}>
            <FlatList
              data={this.state.customersData}
              renderItem={renderService.bind(this)}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={true}
            />
          </View>
          <View style={styles.cardArena}>
            {renderCards()}
          </View>
        </ScrollView>
      );
    }
  }

  componentDidMount() {
    this.getInfo();
  }


  render() {
    return (
      <View style={styles.f1}>
        <StatusBar backgroundColor="#fff" style="dark" />
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  f1: {
    flex: 1,
    backgroundColor: "#fff",
  },
  services: {
    width: width,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: Constants.statusBarHeight,
    height: "15%",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 4,
  },
  titleColor: {
    color: "#7c9d32",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  subTitle: {
    color: "rgba(0,0,0,.5)",
    fontWeight: "bold",
    fontSize: 15,
  },
  cardArena: {
    margin: 0,
    height: "85%",
    marginBottom: Constants.statusBarHeight,
  },
  noResult: {
    color: "#D50000",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
});
