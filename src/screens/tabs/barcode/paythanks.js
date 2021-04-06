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

function Simple(props) {
  return (
    <CustomQRCode
      style={styles.barcode}
      content="Content is here"
      size={width / 1.25}
      color="#fff"
      codeStyle="square"
      innerEyeStyle="square"
      outerEyeStyle="square"
    />
  );
}

export default class PayThanks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: true,
      link: null,
    };
  }

  componentDidMount() {
    const params = this.props.route.params;
    if (params.checkid != null) {
      this.setState({ link: params.checkid, refresh: false });
      this.renderContent();
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
            color="#7c9d32"
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
              <Simple {...this.props} link={this.state.link} />
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
        <StatusBar backgroundColor="#7c9d32" style="light" />
        {this.renderContent()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  bgGreen: {
    backgroundColor: "#7c9d32",
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
