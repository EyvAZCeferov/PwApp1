import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { Thumbnail } from "native-base";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { t } from "../../../../functions/lang";
import Textpopins from "../../../../functions/screenfunctions/text";
const { width, height } = Dimensions.get("window");

const Horizontalwishlists = (props) => {
  
  function renderWhitelists({ item, index }) {
    return (
      <TouchableOpacity
        key={index}
        style={{
          marginHorizontal: 5,
          width: 150,
          height: 150,
          borderRadius: 0,
          position: "relative",
        }}
      >
        <Thumbnail
          source={{ uri: item.image }}
          resizeMode="cover"
          resizeMethod="resize"
          style={{
            borderRadius: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            alignContent: "center",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            style={{
              padding: 3,
              alignContent: "center",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
            onPress={() =>
              props.addtowishlist({
                id: 1,
                name: "Name",
                content: "Content",
                price: 15,
              })
            }
          >
            <MaterialIcons name="add-shopping-cart" size={20} color="#7c9d32" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 3,
              alignContent: "center",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
            onPress={() =>
              props.removefromwishlist({
                id: 1,
                name: "Name",
                content: "Content",
                price: 15,
              })
            }
          >
            <AntDesign name="heart" size={20} color="#7c9d32" />
          </TouchableOpacity>
        </View>
        <Textpopins
          children={item.name}
          style={{
            position: "absolute",
            bottom: 0,
            left: -1,
            fontSize: 14,
            backgroundColor: "#fff",
            padding: 3,
            borderRadius: 0,
            zIndex: 15,
            color: "#7c9d32",
          }}
        />
        <Textpopins
          style={{
            position: "absolute",
            right: 0,
            borderRadius: 0,
            backgroundColor: "#1E88E5",
            padding: 3,
          }}
        >
          <Textpopins
            children={item.price + "₼"}
            style={{
              textAlign: "right",
              fontSize: 11,
              color: "#fff",
            }}
          />
        </Textpopins>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.contentHeader}>
      <View style={styles.contentHeaderBlocks}>
        <Textpopins style={styles.center} children={t("bucket.loved")} />
        <Textpopins style={{ color: "#7c9d32" }} children={0} />
      </View>
      <View>
        <FlatList
          data={props.wishitems}
          renderItem={renderWhitelists}
          renderToHardwareTextureAndroid={true}
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    wishitems: state.wishitems,
  };
};

export default connect(mapStateToProps)(Horizontalwishlists);

const styles = StyleSheet.create({
  contentHeader: {
    width: width,
    flexDirection: "column",
  },
  contentHeaderBlocks: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
