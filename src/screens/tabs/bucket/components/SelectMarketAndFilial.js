import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { List } from "native-base";
import { AntDesign } from "@expo/vector-icons";
const { width } = Dimensions.get("screen");
import { get_image } from "../../../../functions/standart/helper";
import { t } from "../../../../functions/lang";
import Textpopins from "../../../../functions/screenfunctions/text";
export default function SelectedMarketAndFilial(props) {
  const [selected, setSelected] = React.useState(null);

  function renderFilialItem({ item, index }) {
    return (
      <TouchableOpacity
        style={[
          styles.center,
          styles.listItem,
          selected == item ? { borderColor: "#AF0045", borderWidth: 1 } : null,
        ]}
        onPress={() => setSelected(item)}
      >
        <Textpopins
          style={[
            styles.buttontext,
            selected == item.id ? { color: "#AF0045" } : null,
          ]}
        >
          {item.name["az_name"]}
        </Textpopins>
      </TouchableOpacity>
    );
  }

  function renderMarketItem({ item, index }) {
    return (
      <TouchableOpacity
        style={[
          styles.center,
          styles.marketList,
          selected == item
            ? {
                borderColor: "#AF0045",
                borderWidth: 1,
                width: width / 1.8,
                height: width / 1.8,
              }
            : null,
        ]}
        onPress={() => setSelected(item)}
      >
        <Image
          source={{ uri: get_image(item.logo) }}
          width={"100%"}
          height={"100%"}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
        <Textpopins style={styles.marketName}>
          {item.name["az_name"]}
        </Textpopins>
      </TouchableOpacity>
    );
  }

  function renderContent() {
    if (props.type == "market") {
      return (
        <FlatList
          data={props.data}
          renderItem={renderMarketItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          style={{
            width,
          }}
        />
      );
    } else if (props.type == "filial") {
      return (
        <FlatList
          data={props.data}
          renderItem={renderFilialItem}
          keyExtractor={(item, index) => index.toString()}
          style={{
            width,
          }}
        />
      );
    }
  }

  function select() {
    if (selected != null) {
      props.call(selected);
    } else {
      alert("Məlumat boşdur");
    }
  }

  return (
    <View style={[styles.container, styles.center]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={() => props.togMod()}>
          <AntDesign name="arrowleft" size={24} color="#AF0045" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Textpopins
          style={[
            styles.center,
            {
              fontSize: 22,
              marginBottom: Constants.statusBarHeight / 3,
            },
          ]}
        >
          {props.type == "market"
            ? t("barcode.starter.selectmar")
            : t("barcode.starter.selectfilial")}
        </Textpopins>
        <List
          style={{
            width: width,
          }}
        >
          {renderContent()}
        </List>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => select()}
          style={[
            styles.button,
            {
              borderColor: "#C90052",
              paddingHorizontal: 30,
              paddingVertical: 10,
            },
          ]}
        >
          <Textpopins style={[styles.buttontext, { color: "#C90052" }]}>
            Təsdiqlə
          </Textpopins>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    flex: 0.1,
    flexDirection: "column",
  },
  content: {
    flex: 0.6,
  },
  footer: {
    marginTop: Constants.statusBarHeight,
    flex: 0.2,
    flexDirection: "column-reverse",
  },
  center: {
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    borderColor: "#C90052",
    borderWidth: 1,
  },
  buttontext: {
    fontSize: 14,
    color: "#C90052",
    textAlign: "center",
  },

  listItem: {
    width: width - 10,
    height: 55,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  marketList: {
    width: width / 2,
    height: width / 2,
    backgroundColor: "#fff",
    textAlign: "center",
    position: "relative",
    marginBottom: 2,
    marginRight: 2,
  },
  marketName: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "#AF0045",
    paddingHorizontal: 25,
    paddingVertical: 8,
    color: "#fff",
  },
});
