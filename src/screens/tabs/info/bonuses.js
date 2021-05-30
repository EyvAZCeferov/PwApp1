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
import {
  Button,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Card,
  CardItem,
  Fab,
  Form,
} from "native-base";
import Constants from "expo-constants";
import { LiteCreditCardInput } from "react-native-credit-card-input";
import HeaderDrawer from "./components/header";
import {
  AntDesign,
  EvilIcons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";
const { width, height } = Dimensions.get("window");
import { t } from "../../../functions/lang";

const pinicon = require("../../../../assets/images/Pin/pin.png");
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
      newcard: null,
    };
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
        case "visa":
          return <FontAwesome name="cc-visa" size={30} color="#7c9d32" />;
          break;
        case "master-card":
          return <FontAwesome name="cc-mastercard" size={30} color="#7c9d32" />;
          break;
        case "american-express":
          return <FontAwesome name="cc-amex" size={30} color="#7c9d32" />;
          break;
        case "discover":
          return <FontAwesome name="cc-discover" size={30} color="#7c9d32" />;
          break;
        case "jcb":
          return <FontAwesome name="cc-jcb" size={30} color="#7c9d32" />;
          break;
        case "diners-club-north-america":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#7c9d32" />
          );
          break;
        case "diners-club":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#7c9d32" />
          );
          break;
        case "diners-club-carte-blanche":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#7c9d32" />
          );
          break;
        case "diners-club-international":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#7c9d32" />
          );
          break;
        case "maestro":
          return (
            <FontAwesome name="credit-card-alt" size={30} color="#7c9d32" />
          );
          break;
        case "visa-electron":
          return <FontAwesome5 name="cc-visa" size={30} color="#7c9d32" />;
          break;
        default:
          return <FontAwesome name="credit-card" size={30} color="#7c9d32" />;
      }
    }

    return (
      <ListItem
        thumbnail
        onPress={
          item.type == "pin"
            ? this.props.navigation.navigate("PinInfo", {
                pinid: item.id,
              })
            : null
        }
      >
        <Left>{cardTypeFunc()}</Left>
        <Body>
          <Text style={styles.cardNumbText} children={hideNumb(item.number)} />
          <Text children={item.price + " Azn"} />
        </Body>
        <Right>
          {item.type == "pin" ? (
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Pininfo")}
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

  addCard = async () => {
    this.setState({ active: false });
    var data = new FormData();
    data.append("card", this.state.newcard);
    data.append("type_in", "bonuse");
    data.append("price", 0.0);
    await axios.post("actions/cards", data).then((e) => {
      console.log(e.data);
      this.handleRefresh();
    });
  };

  _onChange = (data) => {
    this.setState({ newcard: data.values });
  };

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
              visible={this.state.active}
            >
              <StatusBar backgroundColor="#fff" />
              <Card
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <CardItem header>
                  <Left>
                    <Textpopins
                      style={styles.modalTitle}
                      children={t("bonuses.cartadd")}
                    />
                  </Left>
                  <Right>
                    <TouchableOpacity
                      onPress={() => this.setState({ active: false })}
                    >
                      <FontAwesome
                        style={{ fontWeight: "bold" }}
                        name="close"
                        size={35}
                        color="#D50000"
                      />
                    </TouchableOpacity>
                  </Right>
                </CardItem>
                <CardItem>
                  <Form style={styles.form}>
                    <View style={styles.itemStyle}>
                      <View style={[styles.inputstyle, styles.cardInput]}>
                        <LiteCreditCardInput
                          keyboardShouldPersistTaps="handled"
                          keyboardType="number-pad"
                          onChange={this._onChange}
                        />
                      </View>
                    </View>
                  </Form>
                </CardItem>
                <CardItem footer>
                  <Button
                    style={styles.buttonStyle}
                    onPress={this.addCard}
                    success
                  >
                    <Textpopins
                      color="#fff"
                      style={{ padding: 15 }}
                      children={t("actions.submit")}
                    />
                  </Button>
                </CardItem>
              </Card>
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
