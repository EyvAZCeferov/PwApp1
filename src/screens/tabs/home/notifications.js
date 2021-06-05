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
import axios from "axios";
import FormData from "form-data";
import { convertStampDate } from "../../../functions/standart/helper";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Notification(props) {
  const [notification, setNotification] = React.useState(null);
  const [notifies, setNotifies] = React.useState(null);
  const [refresh, setRefresh] = React.useState(true);
  const [token, setToken] = React.useState(null);

  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  async function getNotifyPerform() {
    registerForPushNotificationsAsync().then((token) =>
      setTokenFunction(token)
    );

    async function setTokenFunction(token) {
      await axios.get("auth/me").then(async (e) => {
        if (
          e.data.notify_token.token == null ||
          e.data.notify_token.token == undefined ||
          e.data.notify_token.token == "undefined"
        ) {
          var formdata = new FormData();
          formdata.append("token", token);
          await axios.post("auth/set_notify_token", formdata).then((e) => {
            console.log(e.data);
          });
        }
      });

      setToken(token);
    }

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }

  async function getInfo() {
    setRefresh(true);
    await axios.get("actions/notifications").then((e) => {
      if (e.data.length > 0) {
        setNotifies(e.data);
      }
    });
    setRefresh(false);
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
        sound: "default",
        enableVibrate: true,
      });
    }

    return token;
  }

  React.useEffect(() => {
    getNotifyPerform();
    getInfo();
  }, []);

  function renderItem({ item, index }) {
    return (
      <ListItem
        style={styles.firstList}
        thumbnail
        onPress={() =>
          props.navigation.navigate("Notification", {
            notifyid: item.id,
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
          <Text style={styles.cardNumbText} children={item.name} />
          <Text
            style={{ fontSize: 15, color: "rgba(0,0,0,.5)" }}
            children={convertStampDate(new Date(item.created_at))}
          />
        </Body>
        <Right>
          <Entypo
            name="dot-single"
            size={33}
            color={!item.readed ? "#BF360C" : "#5C0082"}
          />
        </Right>
      </ListItem>
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
          onPress: async () =>
            await axios.post("notifications/readAll").then((e) => {
              if (e.data == "Success") {
                Alert("Bütün notifikasiyalar oxundu olaraq işarələndi");
              }
            }),
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
              onRefresh={getInfo}
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
