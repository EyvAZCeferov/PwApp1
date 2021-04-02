import React from "react";
import {View, Text, StyleSheet, Dimensions, FlatList} from "react-native";
import {StatusBar} from "expo-status-bar";
import BucketHeader from "./components/BucketHeader";
import {t} from "../../../functions/lang";
import {List, ListItem, Left, Right, Body, Button, Thumbnail} from "native-base";
import {connect} from "react-redux";
import Constants from "expo-constants";
import Textpopins from "../../../functions/screenfunctions/text";

const {width, height} = Dimensions.get("window");
import {Ionicons, EvilIcons} from "@expo/vector-icons";

function WishList(props) {

    function renderBucket({item, index}) {
        return (
            <ListItem key={index} onPress={() =>
                props.navigation.navigate("ProductInfo", {
                    uid: item.id,
                })
            }>
                <Left style={{maxWidth: width / 6}}>
                    <Thumbnail source={{uri: item.image}} style={{maxWidth: "100%"}}/>
                </Left>
                <Body>
                    <Textpopins children={item.name}/>
                </Body>
                <Right style={{flexDirection: "row"}}>

                    <Button transparent style={styles.buttonStyle} onPress={() => props.addtoCard(item)}>
                        <Ionicons name="add" size={30} color="#7c9d32"/>
                    </Button>
                    <Button transparent style={styles.buttonStyle} onPress={() => props.removewishlist(item)}>
                        <EvilIcons name="trash" size={30} color="#BF360C"/>
                    </Button>

                </Right>
            </ListItem>
        );
    }

    return (
        <View style={[styles.container, styles.center]}>
            <StatusBar backgroundColor="#fff" style="dark"/>
            <View>
                <View style={styles.header}>
                    <BucketHeader
                        button={true}
                        title={t("bucket.header.wishList.title")}
                    />
                </View>
                <View style={[styles.center, styles.contentArena]}>
                    {props.wishitems && props.wishitems.length > 0 ? (
                        <List
                            style={{
                                width: width,
                                height: "100%",
                            }}
                        >
                            <FlatList
                                data={props.wishitems}
                                renderItem={renderBucket}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </List>
                    ) : (
                        <Textpopins
                            children={t("actions.noResult")}
                            style={styles.noResult}
                        />
                    )}
                </View>
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        wishitems: state.wishitems,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addtoCard: (product) => dispatch({type: "ADD_TO_CART", payload: product}),
        removewishlist: (product) =>
            dispatch({type: "REMOVE_FROM_WISHLIST", payload: product}),
        addWishList: (product) =>
            dispatch({type: "ADD_TO_WISHLIST", payload: product}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WishList);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        width: width,
        height: "20%",
        marginTop: Constants.statusBarHeight,
    },
    contentArena: {
        width: width,
        height: "80%",
        flexDirection: "column",
    },
    center: {
        textAlign: "center",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    noResult: {
        color: "#D50000",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "700",
    },
});
