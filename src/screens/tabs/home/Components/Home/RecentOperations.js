import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Body, Button, Left, ListItem, Right } from "native-base";
import { t } from "../../../../../functions/lang";
import Textpopins from "../../../../../functions/screenfunctions/text";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { ScrollView } from "react-native";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("window");
export default function RecentOperations(props) {
  const nav = useNavigation();

  const [list, setList] = React.useState(null);

  const [refresh, setRefresh] = React.useState(true);

  React.useEffect(() => {
    getInfo();
  }, []);

  async function getInfo() {
    setRefresh(true);
    var datas = [];
    await axios.get("actions/shops").then((e) => {
      if (e.data.length > 0) {
        e.data.map((es) => {
          if (es.payed && es.payed == true) {
            datas.push(es);
          }
        });
        if (datas.length > 0) {
          setList(datas);
        } else {
          setList(null);
        }
      }
    });
    setRefresh(false);
    renderContent();
  }

  function renderItem({ item, index }) {
    function marketTypeFunc() {
      switch (item.type) {
        case "barcode":
          return <FontAwesome name="barcode" size={30} color="#AF0045" />;
          break;
        case "bucket":
          return <Entypo name="shopping-bag" size={30} color="#AF0045" />;
          break;
        default:
          return <FontAwesome name="shopping" size={30} color="#AF0045" />;
      }
    }

    function convertStampDate(unixtimestamp) {
      var months_arr = [
        "Yanvar",
        "Fevral",
        "Mart",
        "Aprel",
        "May",
        "İyun",
        "İyul",
        "Avqust",
        "Sentyabr",
        "Oktyabr",
        "Noyabr",
        "Dekabr",
      ];

      var date = new Date(unixtimestamp * 1);

      var year = date.getFullYear();

      var month = months_arr[date.getMonth()];

      var day = date.getDate();

      var hours = date.getHours();

      var minutes = "0" + date.getMinutes();

      var seconds = "0" + date.getSeconds();

      var fulldate =
        day +
        " " +
        month +
        " " +
        year +
        " -Saat: " +
        hours +
        " : " +
        minutes.substr(-2);

      return fulldate;
    }

    function priceCollector(items) {
      var price = 0;
      items.map((e) => {
        var p = parseFloat(e.price * e.qyt);
        price = parseFloat(price) + parseFloat(p);
      });
      return price;
    }

    return (
      <ListItem
        thumbnail
        onPress={() => {
          nav.navigate("OneCheck", { checkid: item.id });
        }}
        key={index}
      >
        <Left>{marketTypeFunc()}</Left>
        <Body>
          <Textpopins
            style={{ fontSize: 22, color: "rgba(0,0,0,.8)", textAlign: "left" }}
            children={item.get_customer.name["az_name"]}
          />
          <Textpopins
            style={{ fontSize: 14, color: "rgba(0,0,0,.6)", textAlign: "left" }}
            children={convertStampDate(new Date(item.created_at))}
          />
        </Body>
        <Right>
          <Button transparent>
            <Textpopins children={priceCollector(item.pay_items) + " AZN"} />
          </Button>
        </Right>
      </ListItem>
    );
  }

  function onHandleRefresh() {
    setRefresh(true);
    getInfo();
  }

  function renderContent() {
    if (refresh) {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color="#AF0045" animating={true} size="large" />
        </View>
      );
    } else {
      if (list != null) {
        return (
          <FlatList
            data={list}
            keyExtractor={(index, item) => index.toString()}
            renderItem={renderItem}
            refreshing={refresh}
            onRefresh={onHandleRefresh}
            style={{
              marginBottom: Constants.statusBarHeight * 2,
            }}
            showsVerticalScrollIndicator
            scrollEnabled
          />
        );
      } else {
        return (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Textpopins
              style={styles.noResult}
              children={t("actions.noResult")}
            />
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#AF0045",
                borderRadius: 20,
                marginTop: 20,
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
              onPress={() => onHandleRefresh()}
            >
              <Ionicons name="md-refresh" color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        );
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View>
        <View
          style={{
            borderTopColor: "#AF0045",
            borderTopWidth: 4,
            maxHeight: 60,
            minHeight: 45,
            width: width,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              paddingHorizontal: 12,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Text
              style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}
              children={t("home.recentoperations.title")}
            />
            {/* <Text
              style={{ color: "#000", fontSize: 17 }}
              children={t("home.recentoperations.time.yesterday")}
            /> */}
          </View>
        </View>
        <View style={{ width: width, height: height - 288, marginBottom: 20 }}>
          {renderContent()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  f1: {
    flex: 1,
    width: width,
    height: height,
  },
  seperatorText: {
    fontSize: 15,
    color: "#AF0045",
    paddingTop: 1,
    flex: 1,
    width: width,
  },
  listHeaderText: {
    color: "#AF0045",
    paddingVertical: 3,
    fontSize: 14,
  },
  noResult: {
    color: "#000",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
});
