import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";
import BarcodeMask from "react-native-barcode-mask";
import firebase from "../../../functions/firebase/firebaseConfig";
import NoBarcode from "./components/noBarcode";
import { t } from "../../../functions/lang";

const { width, height } = Dimensions.get("window");
export default function Buy(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [flashMode, setFlashMode] = useState("off");
  const [barcode, setbarcode] = useState(null);
  const [modalState, setModalState] = useState(false);
  const params = props.route.params;
  const id = params.id;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function flashToggle() {
    if (flashMode == "torch") {
      setFlashMode("off");
    } else {
      setFlashMode("torch");
    }
  }

  function toggleModal() {
    setModalState(!modalState);
  }

  function renderContent() {
    if (modalState) {
      return (
        <NoBarcode
          {...props}
          bar={(e) => barcodeWrited(e)}
          togMod={() => toggleModal()}
        />
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar hidden={true} />
          <Camera
            style={{ flex: 1 }}
            type="back"
            flashMode={flashMode}
            focusable={true}
            onBarCodeScanned={(item) => barcodeScanned(item)}
            autoFocus={true}
            focusDepth={10}
            videoStabilizationMode={500}
          >
            <BarcodeMask
              outerMaskOpacity={0.6}
              edgeBorderWidth={3}
              edgeColor={"#C90052"}
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
                  props.navigation.goBack();
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
                  backgroundColor: "#C90052",
                }}
                onPress={() => {
                  flashToggle();
                }}
              >
                {iconRender()}
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
          >
            <TouchableOpacity
              style={{
                minHeight: 45,
                maxHeight: 60,
                minWidth: 150,
                maxWidth: 200,
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                alignContent: "center",
                textAlign: "center",
                backgroundColor: "#C90052",
                marginLeft: "auto",
                marginRight: 10,
              }}
              onPress={() => toggleModal()}
            >
              <Entypo
                name="edit"
                style={{ paddingHorizontal: 15, paddingVertical: 10 }}
                size={30}
                color="#fff"
              />
              <Text
                style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}
                children={t("barcode.paying.noBarcode")}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  function iconRender() {
    if (flashMode == "torch") {
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

  function barcodeWrited(e) {
    setbarcode(e);
    barcodeScanned({ data: barcode });
    setModalState(!modalState);
  }

  function barcodeScanned(item) {
    fetch(
      "https://admin.paygo.az/api/customers/product/1/" + "1_" + item.barcode
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.length != 0) {
          var datas = [];
          fetch("https://admin.paygo.az/api/actions/shops/" + id)
            .then((res) => res.json())
            .then((r) => {
              datas = r;
            });
          var dat = new FormData();
          dat.append("barcode", item.barcode);
          dat.append("pay_id", id);
          dat.append("product_name", datas.name);
          dat.append("product_qyt", 1);
          dat.append("price", datas.price.price);
          dat.append("product_edv", datas.edv);
          fetch(
            "https://admin.paygo.az/api/actions/products/" +
              id +
              "/add_pay_item",
            {
              method: "POST",
              body: dat,
            }
          );
        }
        this.props.navigation.pop();
      })
      .catch((error) => console.error(error))
      .finally((e) => {
        props.navigation.navigate("Buy");
      });
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      {renderContent()}
    </View>
  );
}
