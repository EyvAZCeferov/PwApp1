import React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import {
  Button,
  List,
  ListItem,
  Thumbnail,
  Left,
  Right,
  Body,
} from "native-base";
import firebase from "../../../functions/firebase/firebaseConfig";
import { t } from "../../../functions/lang";
const { width, height } = Dimensions.get("window");
import { AntDesign, Feather, Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import Textpopins from "../../../functions/screenfunctions/text";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Notification(props) {
  const [notifies, setNotifies] = React.useState([
    {
      image:
        "https://banker.az/wp-content/uploads/2018/02/Kapital_Bank_-e1518595902278.png",
      content: [{ title: "Baki Store", desc: "100 Azn lik Alisveris" }],
      price: 50,
      date: "20.07.2020",
      id: 1,
      read: true,
    },
    {
      image:
        "https://banker.az/wp-content/uploads/2018/02/Kapital_Bank_-e1518595902278.png",
      content: [{ title: "BazarStore", desc: "20 Azn lik Alisveris" }],
      price: 50,
      date: "20.07.2020",
      id: 2,
      read: false,
    },
    {
      image:
        "https://banker.az/wp-content/uploads/2018/02/Kapital_Bank_-e1518595902278.png",
      content: [{ title: "ArazStore", desc: "30 Azn lik Alisveris" }],
      price: 50,
      date: "20.07.2020",
      id: 3,
      read: false,
    },
  ]);
  const [notification, setNotification] = React.useState(null);
  const [refresh, setRefresh] = React.useState(true);
  const [token, setToken] = React.useState(null);
  const [modal, setModal] = React.useState(false);

  async function getNotifyPerform() {
    registerForPushNotificationsAsync().then((token) =>
      setTokenFunction(token)
    );

    function setTokenFunction(token) {
      // var user = firebase.auth().currentUser;
      console.log(token)
      alert(token)
      firebase
        .database()
        .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/userInfos/push_id")
        .set(token);
      setToken(token);
    }
  }

  function getInfo() {
    var datas = [];
    firebase
      .database()
      .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/notifications")
      .on("value", (data) => {
        data.forEach((data) => {
          datas.push(data.val());
        });
        setNotification(datas);
        setRefresh(false);
        renderContent();
      });
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;

    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#5C0082",
        enableLights: true,
        showBadge: true,
        sound: SVGComponentTransferFunctionElement,
      });
    }
    return token;
    console.log(token)
  }

  React.useEffect(() => {
    getInfo();
    getNotifyPerform();
  }, []);

  function handleRefresh() {
    setRefresh(true);
    getInfo();
  }

  function renderItem({ item, index }) {
    return (
      <ListItem
        style={styles.firstList}
        thumbnail
        onPress={(item) =>
          props.navigation.navigate("Notification", {
            params: {
              notifyid: item.id,
            },
          })
        }
      >
        <Left>
          <Thumbnail
            square
            source={{
              uri: item.image,
            }}
            style={styles.thumbImage}
          />
        </Left>
        <Body>
          <Text style={styles.cardNumbText} children={item.content[0].title} />
          <Text
            style={{ fontSize: 15, color: "rgba(0,0,0,.5)" }}
            children={item.date}
          />
        </Body>
        <Right>
          <Entypo
            name="dot-single"
            size={33}
            color={!item.read ? "#BF360C" : "#5C0082"}
          />
        </Right>
      </ListItem>
    );
  }

  function deleteNotifies() {
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
          onPress: () =>
            firebase
              .database()
              .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/notifications")
              .remove(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }

  function readNotifies() {
    Alert.alert(
      t("actions.readallnotifications"),
      "",
      [
        {
          text: t("actions.cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("actions.submit"),
          onPress: () =>
            firebase
              .database()
              .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/notifications")
              .orderByValue("noOrder")
              .isEqual("yea")
              .limitToFirst(100),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }

  function renderContent() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        {refresh ||
        notifies == null ||
        notifies.length == 0 ||
        notifies.length < 1 ? (
          <List
            style={{
              width: width,
              height: height - 4 * Constants.statusBarHeight,
              textAlign: "center",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Textpopins
              style={styles.nullObject}
              children={t("actions.noResult")}
            />
          </List>
        ) : (
          <List
            style={{
              width: width,
              height: height - 4 * Constants.statusBarHeight,
            }}
          >
            <FlatList
              style={{ width: width }}
              data={notifies}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              refreshing={refresh}
              onRefresh={handleRefresh}
            />
          </List>
        )}
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#fff" style="dark" />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#fff",
          alignItems: "center",
          alignContent: "center",
          textAlign: "center",
          marginTop: Constants.statusBarHeight,
          borderBottomColor: "#5C0082",
          borderBottomWidth: 2,
          paddingBottom: 1,
        }}
      >
        <Button transparent onPress={() => props.navigation.goBack()}>
          <AntDesign name="left" size={24} color="#5C0082" />
        </Button>

        <Text
          style={styles.headerTitle}
          children={t("home.notifications.title")}
        />

        <View
          style={{
            alignItems: "center",
            alignContent: "center",
            textAlign: "center",
            justifyContent: "space-around",
            flexDirection: "row",
          }}
        >
          <Button
            transparent
            style={{ marginHorizontal: 10 }}
            onPress={() => deleteNotifies()}
          >
            <Feather name="trash-2" size={24} color="#5C0082" />
          </Button>
          <Button
            transparent
            style={{ marginLeft: 8 }}
            onPress={() => readNotifies()}
          >
            <Feather name="user-check" size={24} color="#5C0082" />
          </Button>
        </View>
      </View>
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: "#5C0082",
    fontWeight: "bold",
    fontSize: 19,
    marginLeft: Constants.statusBarHeight * 2,
  },
  firstList: {
    marginBottom: 5,
    width: width,
  },
  cardNumbText: {
    fontSize: 17,
    marginBottom: 3,
    color: "#6d7587",
    fontWeight: "bold",
  },
  thumbImage: {
    borderRadius: 50,
    backgroundColor: "green",
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
