import React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Button, List, ListItem, Left, Right, Body, Fab } from "native-base";
import Constants from "expo-constants";
import { Camera } from "expo-camera";
import HeaderDrawer from "./components/header";
import {
  AntDesign,
  EvilIcons,
  FontAwesome,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";
const { width, height } = Dimensions.get("window");
import { t } from "../../../functions/lang";
import BarcodeMask from "react-native-barcode-mask";
import { Audio } from "expo-av";

import { hideNumb } from "../../../functions/standart/helper";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import FormData from "form-data";

export default class Bonuses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      active: false,
      loading: true,
      flashMode: "off",
    };
  }

  async getPerm() {
    this.setState({ refresh: true });
    const { status } = await Camera.requestPermissionsAsync();
  }

  async callSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../../assets/sounds/barcode_scanned.mp3")
    );
    await sound.playAsync();
  }

  flashToggle() {
    if (this.state.flashMode == "torch") {
      this.setState({ flashMode: "off" });
    } else {
      this.setState({ flashMode: "torch" });
    }
  }

  iconRender() {
    if (this.state.flashMode == "torch") {
      return (
        <Entypo
          name="flash"
          style={{ paddingHorizontal: 5, paddingVertical: 2 }}
          size={40}
          color="rgb(255,255,255)"
        />
      );
    } else {
      return (
        <Entypo
          name="flash"
          style={{ paddingHorizontal: 5, paddingVertical: 2 }}
          size={40}
          color="rgba(255,255,255,.3)"
        />
      );
    }
  }

  async qrCodeScanned(item) {
    this.callSound();
    this.setState({ active: false });
    this.addCard(item);
  }

  async getInfo() {
    this.setState({
      loading: true,
    });
    await axios.get("actions/cards").then((e) => {
      if (e.data != "Trying to get property 'id' of non-object") {
        this.setState({
          cards: e.data,
          loading: false,
        });
      } else {
        this.getInfo();
      }
    });
  }

  componentDidMount() {
    this.getInfo();
    this.getPerm();
  }

  renderItems({ item, index }) {
    var that = this;

    function deleteItem(index) {
      Alert.alert(
        t("actions.wantdelete"),
        t("actions.notrecovered"),
        [
          {
            text: t("actions.cancel"),
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: t("actions.delete"),
            onPress: () => deleteYes(index),
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }

    async function deleteYes(index) {
      await axios.delete("actions/cards/" + index).then((e) => {
        that.handleRefresh();
      });
    }

    function cardTypeFunc() {
      switch (item.cardType) {
        case "pin":
          return <AntDesign name="pushpino" size={24} color="black" />;
          break;
        case "visa":
          return <FontAwesome name="cc-visa" size={30} color="black" />;
          break;
        case "master-card":
          return <FontAwesome name="cc-mastercard" size={30} color="black" />;
          break;
        case "american-express":
          return <FontAwesome name="cc-amex" size={30} color="black" />;
          break;
        case "discover":
          return <FontAwesome name="cc-discover" size={30} color="black" />;
          break;
        case "jcb":
          return <FontAwesome name="cc-jcb" size={30} color="black" />;
          break;
        case "diners-club-north-america":
          return <FontAwesome name="cc-diners-club" size={30} color="black" />;
          break;
        case "diners-club":
          return <FontAwesome name="cc-diners-club" size={30} color="black" />;
          break;
        case "diners-club-carte-blanche":
          return <FontAwesome name="cc-diners-club" size={30} color="black" />;
          break;
        case "diners-club-international":
          return <FontAwesome name="cc-diners-club" size={30} color="black" />;
          break;
        case "maestro":
          return <FontAwesome name="credit-card-alt" size={30} color="black" />;
          break;
        case "visa-electron":
          return <FontAwesome5 name="cc-visa" size={30} color="black" />;
          break;
        default:
          return <FontAwesome name="credit-card" size={30} color="black" />;
      }
    }

    if (item.type != "pay")
      return (
        <ListItem thumbnail>
          <Left>{cardTypeFunc()}</Left>
          <Body>
            <Text
              style={styles.cardNumbText}
              children={hideNumb(item.number)}
            />
            <Text
              children={
                Math.fround(item.price).toString().substring(0, 4) + " Azn"
              }
            />
          </Body>
          <Right>
            {item.type == "pin" ? (
              <Button
                transparent
                onPress={() =>
                  this.props.navigation.navigate("Pininfo", { pinid: item.id })
                }
              >
                <EvilIcons name="eye" size={30} color="#2196f3" />
              </Button>
            ) : (
              <Button transparent onPress={() => deleteItem(item.id)}>
                <EvilIcons name="trash" size={30} color="#BF360C" />
              </Button>
            )}
          </Right>
        </ListItem>
      );
  }

  async handleRefresh() {
    this.setState(
      {
        loading: true,
      },
      () => {
        this.getInfo();
      }
    );
  }

  async addCard(cardnumb) {
    console.log(cardnumb);
    var data = new FormData();
    data.append("number", cardnumb);
    data.append("expiry", "∞/∞");
    data.append("cvc", 105);
    data.append("cardType", "b");
    data.append("type_in", "bonuse");
    await axios
      .post("actions/cards", data)
      .then((e) => {
        console.log(e.data);
        this.handleRefresh();
      })
      .catch((e) => {
        console.log(e.data);
      });
    this.setState({ active: false });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <HeaderDrawer {...this.props} name={t("drawer.bonuses")} />
        <View style={{ flex: 1 }}>
          {this.state.cards.length == 0 ? (
            <List
              style={{
                marginTop: 5 * Constants.statusBarHeight,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Textpopins
                style={styles.nullObject}
                children={t("actions.noResult")}
              />
            </List>
          ) : (
            <ScrollView>
              <List>
                <FlatList
                  data={this.state.cards}
                  renderItem={this.renderItems.bind(this)}
                  keyExtractor={(item, index) => index.toString()}
                  refreshing={this.state.loading}
                  onRefresh={this.handleRefresh}
                  disableVirtualization
                />
              </List>
            </ScrollView>
          )}
          <Fab
            active={this.state.active}
            direction="right"
            position="bottomRight"
            style={{ backgroundColor: "#AF0045" }}
            onPress={() => this.setState({ active: !this.state.active })}
          >
            <AntDesign name="plus" size={24} color="#fff" />
          </Fab>

          <View>
            <Modal
              style={{
                width: width / 2,
                height: height / 2,
                backgroundColor: "#fff",
              }}
              animationType="slide"
              transparent={false}
              animated={true}
              visible={this.state.active}
              presentationStyle="fullScreen"
              supportedOrientations="portrait"
            >
              <View style={[styles.container, styles.center]}>
                <StatusBar hidden={true} />

                <Camera
                  style={{
                    width: width / 1,
                    height: "100%",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                  type="back"
                  focusable={true}
                  onBarCodeScanned={(item) => {
                    this.qrCodeScanned(item.data);
                  }}
                  autoFocus={true}
                  focusDepth={10}
                  videoStabilizationMode={500}
                >
                  <BarcodeMask
                    outerMaskOpacity={0.6}
                    edgeBorderWidth={3}
                    edgeColor={"#5C0082"}
                    animatedLineColor="#DD2C00"
                    animatedLineHeight={2}
                    showAnimatedLine={true}
                    animated={true}
                    animatedLineWidth={"90%"}
                    lineAnimationDuration={1400}
                    useNativeDriver={true}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      textAlign: "center",
                      margin: "auto",
                      padding: "auto",
                    }}
                  />
                </Camera>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: 15,
                  width: width,
                  height: 140,
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: width,
                    height: 50,
                    marginTop: 30,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignContent: "center",
                    textAlign: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      minHeight: 45,
                      maxHeight: 60,
                      minWidth: 45,
                      maxWidth: 60,
                      marginLeft: 30,
                      borderRadius: 5,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      textAlign: "center",
                      backgroundColor: "rgba(0,0,0,.5)",
                    }}
                    onPress={() => {
                      this.setState({ active: false });
                    }}
                  >
                    <AntDesign name="left" size={25} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      minHeight: 45,
                      maxHeight: 60,
                      minWidth: 45,
                      maxWidth: 60,
                      marginRight: 30,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      textAlign: "center",
                      backgroundColor: "#5C0082",
                    }}
                    onPress={() => {
                      this.flashToggle();
                    }}
                  >
                    {this.iconRender()}
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  position: "absolute",
                  bottom: 15,
                  right: 0,
                  left: 0,
                  width: width,
                  height: 80,
                }}
              ></View>
            </Modal>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardNumbText: {
    fontSize: 17,
    color: "#6d7587",
    fontWeight: "bold",
  },
  thumbImage: {
    borderRadius: 100,
  },
  modalTitle: {
    fontSize: 23,
    color: "#010101",
    fontWeight: "bold",
  },
  cardItemRightButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  form: {
    padding: 0,
    margin: 0,
    width: width,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
  },
  itemStyle: {
    width: width - 50,
    height: 60,
    marginVertical: 10,
  },
  inputstyle: {
    height: 50,
    width: "100%",
    lineHeight: 40,
    backgroundColor: "#fff",
    paddingLeft: 10,
    color: "#6d7587",
    fontWeight: "bold",
    fontSize: 16,
    borderRadius: 6,
    borderColor: "rgba(0,0,0,.4)",
    borderWidth: 2,
  },
  buttonstyle: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInput: {
    width: width - 50,
  },
  nullObject: {
    color: "#D50000",
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
