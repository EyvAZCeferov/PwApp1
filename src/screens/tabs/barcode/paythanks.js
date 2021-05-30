import * as React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Button } from "native-base";
import { CommonActions } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { t } from "../../../functions/lang";
import { QRCode as CustomQRCode } from "react-native-custom-qr-codes-expo";
import { StatusBar } from "expo-status-bar";
import Textpopins from "../../../functions/screenfunctions/text";

const { width, height } = Dimensions.get("window");
import Barcode from "@kichiyaki/react-native-barcode-generator";
import Carousel from "react-native-snap-carousel";
import axios from "axios";

export default class PayThanks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: true,
      link: null,
      barcodes: [
        {
          id: 1,
          type: "qr",
        },
        {
          id: 2,
          type: "barcode",
        },
      ],
      activeIndex: 1,
    };
  }

  componentDidMount() {
    const params = this.props.route.params;
    if (params.checkid != null) {
      this.setState({ refresh: true });
      this.renderContent();
      this.setState({ refresh: false });
    }
  }

  navigationreset() {
    return this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: "Home" },
          {
            name: "Home",
          },
        ],
      })
    );
  }

  renderContent() {
    if (this.state.refresh) {
      return (
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
            color="#AF0045"
            animating={true}
            focusable={true}
          />
        </View>
      );
    } else {
      return (
        <View style={[styles.f1, styles.bgGreen]}>
          <View style={styles.thanksArena}>
            <View style={styles.barcode}>
              <Barcode
                format="CODE128A"
                value="0123456789012"
                text="0123456789012"
                style={styles.barcode}
                size={{ width: width, height: width }}
              />
            </View>
            <Textpopins
              style={[styles.icon, styles.title]}
              children={t("barcode.thanksBuying.title")}
            />
            <Textpopins
              style={styles.subtitle}
              children={t("barcode.thanksBuying.scanCode")}
            />
            <View style={styles.centerItems}>
              <Button
                rounded
                iconLeft
                light
                style={styles.btn}
                onPress={() => this.navigationreset()}
              >
                <AntDesign name="home" size={24} color="black" />
                <Textpopins
                  style={styles.btnText}
                  children={t("barcode.thanksBuying.returnHome")}
                />
              </Button>
            </View>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView>
        <StatusBar backgroundColor="#AF0045" style="light" />
        {this.renderContent()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  bgGreen: {
    backgroundColor: "#AF0045",
  },
  f1: {
    width,
    height,
  },
  thanksArena: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  icon: {
    fontSize: 50,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 5,
  },
  barcode: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 35,
    color: "#fff",
    width: width,
  },
  w1h1: {
    width: 500,
    height: 500,
  },
  title: {
    fontSize: 30,
    marginVertical: 10,
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    margin: 0,
    textAlign: "center",
  },
  centerItems: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  btn: {
    padding: 15,
    marginTop: 20,
  },
  btnText: {
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 5,
    color: "#010101",
  },
});
