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
  Input,
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
import { hideNumb } from "../../../functions/standart/helper";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import FormData from "form-data";

export default class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      active: false,
      newcard: null,
      loading: true,
    };
  }

  async getInfo() {
    this.setState({
      loading: true,
    });
    await axios.get("actions/cards/type/pay").then((e) => {
      if (e.data != "Trying to get property 'id' of non-object") {
        this.setState({
          cards: e.data,
          loading: false,
        });
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
      switch (item.type) {
        case "visa":
          return <FontAwesome name="cc-visa" size={30} color="#5C0082" />;
          break;
        case "master-card":
          return <FontAwesome name="cc-mastercard" size={30} color="#5C0082" />;
          break;
        case "american-express":
          return <FontAwesome name="cc-amex" size={30} color="#5C0082" />;
          break;
        case "discover":
          return <FontAwesome name="cc-discover" size={30} color="#5C0082" />;
          break;
        case "jcb":
          return <FontAwesome name="cc-jcb" size={30} color="#5C0082" />;
          break;
        case "diners-club-north-america":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#5C0082" />
          );
          break;
        case "diners-club":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#5C0082" />
          );
          break;
        case "diners-club-carte-blanche":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#5C0082" />
          );
          break;
        case "diners-club-international":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#5C0082" />
          );
          break;
        case "maestro":
          return (
            <FontAwesome name="credit-card-alt" size={30} color="#5C0082" />
          );
          break;
        case "visa-electron":
          return <FontAwesome5 name="cc-visa" size={30} color="#5C0082" />;
          break;
        default:
          return <FontAwesome name="credit-card" size={30} color="#5C0082" />;
      }
    }

    return (
      <ListItem thumbnail>
        <Left>{cardTypeFunc()}</Left>
        <Body>
          <Text style={styles.cardNumbText} children={hideNumb(item.number)} />
          <Text children={item.price + " Azn"} />
        </Body>
        <Right>
          <Button transparent onPress={() => deleteItem(item.id)}>
            <EvilIcons name="trash" size={30} color="#BF360C" />
          </Button>
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

  async addCard() {
    var data = new FormData();
    data.append("number",this.state.newcard.number);
    data.append("expiry",this.state.newcard.expiry);
    data.append("cvc",this.state.newcard.cvc);
    data.append("cardType",this.state.newcard.type);
    data.append("number",this.state.newcard.number);
    data.append("type_in", "pay");
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

  _onChange = (data) => {
    this.setState({ newcard: data.values });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <HeaderDrawer {...this.props} name={t("drawer.cards")} />
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
              <List style={{ flex: 1 }}>
                <FlatList
                  data={this.state.cards}
                  renderItem={this.renderItems.bind(this)}
                  keyExtractor={(item, index) => index.toString()}
                  refreshing={this.state.loading}
                  onRefresh={this.handleRefresh}
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
                      children={t("cards.cartadd")}
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
                    onPress={() => this.addCard()}
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
    color: "#5C0082",
    fontWeight: "bold",
  },
  thumbImage: {
    borderRadius: 100,
  },
  cardItemheader: {
    backgroundColor: "#fff",
    width: width - 30,
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
    color: "#5C0082",
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
