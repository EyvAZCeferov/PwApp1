import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Button, Header, Left, Body, Right } from "native-base";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { t } from "../../../../functions/lang";
import Textpopins from "../../../../functions/screenfunctions/text";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");
import { StatusBar } from "expo-status-bar";
const categories = [
  {
    id: 1,
    image: "https://picsum.photos/149",
    name: "Category Name 1",
  },
  {
    id: 2,
    image: "https://picsum.photos/149",
    name: "Category Name 2",
  },
  {
    id: 3,
    image: "https://picsum.photos/149",
    name: "Category Name 3",
  },
  {
    id: 4,
    image: "https://picsum.photos/149",
    name: "Category Name 4",
    top_cat: 3,
  },
  {
    id: 5,
    image: "https://picsum.photos/149",
    name: "Category Name 5",
  },
  {
    id: 6,
    image: "https://picsum.photos/149",
    name: "Category Name 6",
    top_cat: 8,
  },
  {
    id: 7,
    image: "https://picsum.photos/149",
    name: "Category Name 7",
  },
  {
    id: 8,
    image: "https://picsum.photos/149",
    name: "Category Name 8",
  },
  {
    id: 9,
    image: "https://picsum.photos/149",
    name: "Category Name 9",
  },
  {
    id: 10,
    image: "https://picsum.photos/149",
    name: "Category Name 10",
  },
];

function BucketHeader(props) {
  const navigation = useNavigation();
  const [modalstate, setmodalstate] = React.useState(false);

  function back() {
    navigation.goBack();
  }

  function getCatPage(id) {
    setmodalstate(!modalstate);
    navigation.navigate("BucketScreenes", {
      screen: "InCats",
      params: { catid: id },
    });
  }

  function renderCat({ item, index }) {
    return (
      <TouchableOpacity
        key={index}
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          height: 50,
          paddingVertical: 10,
        }}
        onPress={() => getCatPage(item.id)}
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: 50,
            height: 50,
          }}
        />
        <Textpopins
          children={item.name}
          style={{
            fontSize: 20,
            color: "rgba(0,0,0,.6)",
          }}
        />
        {item.top_cat ? (
          <TouchableOpacity style={{ width: "5%" }}>
            <AntDesign size={20} color="#7c9d32" name="user" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: "5%" }} />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        {
          flexDirection: "column",
        },
        styles.center,
      ]}
    >
      <View style={styles.header}>
        <Header
          backgroundColor="#fff"
          androidStatusBarColor="#fff"
          style={{
            backgroundColor: "#fff",
            borderBottomColor: "#7c9d32",
            borderBottomWidth: 2,
          }}
        >
          <StatusBar backgroundColor="#fff" style="dark" />
          {props.button && props.button === true ? (
            <Left style={styles.center}>
              <TouchableOpacity onPress={() => back()} style={styles.center}>
                <AntDesign name="left" size={24} color="#7c9d32" />
              </TouchableOpacity>
            </Left>
          ) : (
            <Left style={styles.center} />
          )}
          <Body style={styles.center}>
            <Text style={styles.headerTitle} children={props.title} />
          </Body>
          <Right style={[styles.headerRight, styles.center]}>
            <Button transparent onPress={() => navigation.navigate("CartList")}>
              <AntDesign name="shoppingcart" size={24} color="#000" />
              <Text
                style={[
                  styles.center,
                  {
                    color: "#7c9d32",
                    fontSize: 15,
                    fontWeight: "bold",
                    position: "absolute",
                    bottom: 6,
                    right: 8,
                  },
                ]}
                children={props.bucketitems.length}
              />
            </Button>
            <Button transparent onPress={() => navigation.navigate("WishList")}>
              <AntDesign name="hearto" size={24} color="black" />
              <Text
                style={[
                  styles.center,
                  {
                    color: "#7c9d32",
                    fontSize: 15,
                    fontWeight: "bold",
                    position: "absolute",
                    bottom: 6,
                    right: 8,
                  },
                ]}
                children={props.wishitems.length}
              />
            </Button>
          </Right>
        </Header>

        <View style={styles.bottomHeader}>
          <Button
            style={styles.button}
            info
            onPress={() => setmodalstate(!modalstate)}
          >
            <MaterialIcons color="#fff" size={24} name="storage" />
          </Button>
          <View style={styles.inputArena}>
            <TextInput
              placeholder={t("bucket.header.search")}
              placeholderTextColor={"#7c9d32"}
              style={{
                width: "90%",
                height: 45,
                borderColor: "#7c9d32",
                borderWidth: 1,
                fontSize: 17,
                paddingLeft: 5,
              }}
            />
            <Button
              style={[
                styles.button,
                { position: "absolute", right: 10, zIndex: 999 },
              ]}
              success
            >
              <MaterialIcons color="#fff" size={24} name="search" />
            </Button>
          </View>
        </View>
      </View>

      <Modal
        visible={modalstate}
        transparent={false}
        animated={true}
        hardwareAccelerated={true}
        statusBarTranslucent={true}
        animationType="slide"
        style={[
          styles.center,
          {
            width: width / 2,
            height: width / 2,
            flexDirection: "column",
            justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingTop: "25%",
          }}
        >
          <View style={{ width: "80%" }} />
          <TouchableOpacity onPress={() => setmodalstate(!modalstate)}>
            <AntDesign name="close" color="#D50000" size={24} />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.center,
            {
              width: "100%",
            },
          ]}
        >
          <ScrollView scrollEnabled={true}>
            <FlatList
              data={categories}
              renderItem={renderCat}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    bucketitems: state.bucketitems,
    wishitems: state.wishitems,
  };
};

export default connect(mapStateToProps)(BucketHeader);

const styles = StyleSheet.create({
  header: {
    width: width,
    height: "100%",
    flexDirection: "column",
    marginTop: Constants.statusBarHeight,
  },
  bottomHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 3,
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
  inputArena: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: "#7c9d32",
    fontSize: 14,
    fontWeight: "bold",
    paddingLeft: Constants.statusBarHeight * 2,
  },
  headerRight: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginRight:-Constants.statusBarHeight
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
});
