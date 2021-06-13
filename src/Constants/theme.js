import React from "react";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";

export const Colors = {
  whiteHEX: "#ffffff",
  whiteRGB: "rgb(255,255,255)",
  blackHEX: "#000000",
  blackRGB: "rgb(0,0,0)",
  green1HEX: "#96CA00",
  green1RGB: "rgb(150,202,0)",
  green2HEX: "#C5FD16",
  green2RGB: "rgb(197,253,22)",
  grayHEX: "#EBECF0",
  grayRGB: "rgb(235,236,240)",
};

export const FontSize = {
  xs: 14,
  s: 15,
  m: 16,
  l: 18,
  xl: 20,
  xxl: 22,
};

export const Styles = {
  center: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
  },
};

export const TabIcon = {
  home: <Ionicons name="home-sharp" size={24} color={Colors.whiteHEX} />,
  homeFOCUSED: (
    <Ionicons
      name="home-outline"
      size={30}
      color={Colors.green1HEX}
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 9,
        paddingVertical: 8,
        borderRadius: 200,
        borderColor: Colors.green1HEX,
        borderWidth: 2,
        textAlign: "center",
      }}
    />
  ),
  barcode: (
    <MaterialCommunityIcons name="barcode" size={24} color={Colors.whiteHEX} />
  ),
  barcodeFOCUSED: (
    <MaterialCommunityIcons
      name="barcode-scan"
      size={30}
      color={Colors.green1HEX}
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 9,
        paddingVertical: 8,
        borderRadius: 200,
        borderColor: Colors.green1HEX,
        borderWidth: 2,
        textAlign: "center",
      }}
    />
  ),
  bucket: <Feather name="shopping-cart" size={24} color={Colors.whiteHEX} />,
  bucketFOCUSED: (
    <AntDesign
      name="shoppingcart"
      size={30}
      color={Colors.green1HEX}
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 9,
        paddingVertical: 8,
        borderRadius: 200,
        borderColor: Colors.green1HEX,
        borderWidth: 2,
        textAlign: "center",
      }}
    />
  ),
  campaign: (
    <MaterialCommunityIcons name="post" size={24} color={Colors.whiteHEX} />
  ),
  campaignFOCUSED: (
    <MaterialCommunityIcons
      name="post-outline"
      size={30}
      color={Colors.green1HEX}
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 9,
        paddingVertical: 8,
        borderRadius: 200,
        borderColor: Colors.green1HEX,
        borderWidth: 2,
        textAlign: "center",
      }}
    />
  ),
  info: <FontAwesome name="user" size={24} color={Colors.whiteHEX} />,
  infoFOCUSED: (
    <FontAwesome
      name="user-o"
      size={30}
      color={Colors.green1HEX}
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 9,
        paddingVertical: 8,
        borderRadius: 200,
        borderColor: Colors.green1HEX,
        borderWidth: 2,
        textAlign: "center",
      }}
    />
  ),
};
