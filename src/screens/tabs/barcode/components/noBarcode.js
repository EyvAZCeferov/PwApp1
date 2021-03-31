import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import { Input, InputGroup } from "native-base";
import { t } from "../../../../functions/lang";
import Textpopins from "../../../../functions/screenfunctions/text";
const { width, height } = Dimensions.get("window");

export default class NoBarcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null,
    };
  }

  barcodeWrited() {
    console.log(this.state.text);
    Keyboard.dismiss();
    if (this.state.text != null) {
      this.props.bar(this.state.text);
    } else {
      alert("Barcode Null");
    }
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          animated={true}
          transparent={false}
          presentationStyle="fullScreen"
          visible={true}
          statusBarTranslucent={true}
        >
          <KeyboardAwareScrollView>
            <View
              style={{
                width: width,
                height: 90,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  marginTop: 40,
                }}
                onPress={() => this.props.togMod()}
              >
                <AntDesign name="left" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 50,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  alignContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <InputGroup
                  style={{
                    width: width - 50,
                    marginTop: width / 5,
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    height: 140,
                    borderColor: "transparent",
                  }}
                >
                  <Input
                    style={{
                      alignContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      borderColor: "rgba(0,0,0,.7)",
                      borderWidth: 3,
                      width: "100%",
                      height: 80,
                    }}
                    autoCapitalize="none"
                    placeholder={t("barcodeScreen.typeBarcode")}
                    placeholderTextColor="rgba(0,0,0,.5)"
                    keyboardType="numeric"
                    onChangeText={(text) => this.setState({ text })}
                  />
                  <TouchableOpacity
                    onPress={() => this.barcodeWrited()}
                    style={{
                      backgroundColor: "#7c9d32",
                      width: width - 50,
                      borderRadius: 8,
                      height: 50,
                      marginTop: 15,
                      alignContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Textpopins
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 24,
                        paddingHorizontal: 0,
                        paddingVertical: 20,
                      }}
                      children={t("addCard")}
                    />
                  </TouchableOpacity>
                </InputGroup>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
      </View>
    );
  }
}
