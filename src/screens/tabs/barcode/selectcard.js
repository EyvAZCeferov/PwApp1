import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "native-base";
import { StatusBar } from "expo-status-bar";
import firebase from "../../../functions/firebase/firebaseConfig";
import { t } from "../../../functions/lang";
import Textpopins from "../../../functions/screenfunctions/text";
import { hideNumb } from "../../../functions/standart/helper";

const { width, height } = Dimensions.get("window");
export default class SelectCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCards: null,
      selectedCard: null,
      refresh: true,
    };
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo() {
    firebase.database().goOnline();
    let datas = [];
    firebase
      .database()
      .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/cards")
      .on("value", (data) => {
        data.forEach((element) => {
          datas.push(element.val());
        });
      });
    firebase
      .database()
      .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/bonuses")
      .on("value", (data) => {
        data.forEach((element) => {
          datas.push(element.val());
        });
      });
    this.setState({ allCards: datas });
    this.setState({ refresh: false });
  }

  goBack() {
    this.setState({
      selectedCard: null,
    });
    this.props.navigation.goBack();
  }

  updateShoppingData() {
    firebase.database().goOnline();
    let user = firebase.auth().currentUser;
    const params = this.props.route.params;
    firebase
      .database()
      .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/checks/" + params.checkid)
      .update({
        card: this.state.selectedCard,
      });
  }

  goNext() {
    if (this.state.selectedCard != null) {
      this.updateShoppingData();
      const params = this.props.route.params;
      this.props.navigation.navigate("ShoppingList", {
        checkid: params.checkid,
        selectedCard: this.state.selectedCard,
      });
    } else {
      this.dropDownAlertRef.alertWithType(
        "info",
        t("cardsSelections.selectRetry")
      );
    }
  }

  renderCards() {
    if (this.state.allCards != null) {
      return this.state.allCards.map((car) => {
        let l = hideNumb(car.cardInfo.number);
        return (
          <Picker.Item
            label={l}
            key={car.cardId}
            value={car.cardId}
            color="#7c9d32"
          />
        );
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.refresh ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <StatusBar backgroundColor="#fff" style="dark" />
            <ActivityIndicator size="large" color="#7c9d32" />
          </View>
        ) : (
          <View style={[styles.container, styles.center]}>
            <StatusBar backgroundColor="#fff" style="dark" />
            <View style={[styles.content, styles.center]}>
              <Textpopins
                style={styles.title}
                children={t("barcode.cardselect.title")}
              />
              <Picker
                iosHeader={t("barcode.cardselect.selectCard")}
                mode="dialog"
                selectedValue={this.state.selectedCard}
                onValueChange={(text) => this.setState({ selectedCard: text })}
                style={{ width: width / 2 }}
                focusable={true}
              >
                <Picker.Item
                  key={0}
                  label={t("barcode.cardselect.selectCard")}
                  color="#7c9d32"
                  value=""
                />
                {this.renderCards()}
              </Picker>
            </View>
            <View style={styles.buttonArena}>
              <TouchableOpacity
                onPress={() => this.goBack()}
                style={[
                  styles.center,
                  styles.button,
                  {
                    width: width / 2,
                    height: width / 8,
                  },
                ]}
              >
                <Textpopins
                  style={styles.buttonTExt}
                  children={t("form.buttons.back")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.goNext()}
                style={[
                  styles.center,
                  styles.button,
                  {
                    width: width / 2,
                    height: width / 8,
                  },
                ]}
              >
                <Textpopins
                  style={styles.buttonTExt}
                  children={t("form.buttons.continue")}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "transparent",
    borderColor: "#7c9d32",
    borderWidth: 1.45,
    borderRadius: 6,
  },
  goBack: {
    borderColor: "#fff",
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: height / 15,
  },
  buttonTExt: {
    color: "#7c9d32",
    fontSize: 17,
    fontWeight: "bold",
    paddingVertical: 11,
    textAlign: "center",
  },
  content: {
    height: height / 2.2,
  },
  title: {
    color: "rgba(0,0,0,.8)",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
    textAlign: "center",
  },
  buttonArena: {
    width,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
