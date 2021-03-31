import React from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Textpopins from "../../../../functions/screenfunctions/text";
import Constants from "expo-constants";
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

const { width, height } = Dimensions.get("window");

function RenderCategory(props) {
  const navigation = useNavigation();

  function renderCategories(e) {
    return e.map((element) => {
      return (
        <TouchableOpacity
          key={element.id}
          style={{
            width: "49%",
            height: 150,
            backgroundColor: "#fff",
            borderColor: "#7c9d32",
            borderWidth: 1,
            marginHorizontal: 1,
            marginVertical: 1,
          }}
          onPress={() =>
            navigation.navigate("InCustomer", {
              catid: element.id,
            })
          }
        >
          <ImageBackground
            style={{
              width: "100%",
              height: "100%",
              zIndex: 4,
            }}
            resizeMode="cover"
            resizeMethod="resize"
            source={{ uri: element.image }}
          />
          <Textpopins
            style={{
              color: "#000",
              fontSize: 10,
              position: "absolute",
              bottom: 3,
              padding: 4,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              zIndex: 5,
            }}
            children={element.name}
          />
        </TouchableOpacity>
      );
    });
  }

  return (
    <ScrollView
      style={{
        width,
        alignContent: "center",
      }}
      enableOnAndroid={true}
      horizontal={false}
      bounces={false}
      scrollEnabled={true}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          paddingBottom: Constants.statusBarHeight * 2,
        }}
      >
        {renderCategories(categories)}
      </View>
    </ScrollView>
  );
}

export default RenderCategory;
