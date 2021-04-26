import React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    SafeAreaView,
} from "react-native";
import {StatusBar} from "expo-status-bar";
import BucketHeader from "./components/BucketHeader";
import {t} from "../../../functions/lang";
import {
    List,
    ListItem,
    Left,
    Body,
    Right,
    Button,
    Thumbnail,
    Fab,
} from "native-base";
import {connect} from "react-redux";
import Constants from "expo-constants";
import Textpopins from "../../../functions/screenfunctions/text";
import {EvilIcons, AntDesign} from "@expo/vector-icons";
import NumericInput from "react-native-numeric-input";
import Header from "./components/BucketHeader";

const {width, height} = Dimensions.get("window");

function CartList(props) {
    function renderBucket({item, index}) {
        return (
            <ListItem
                key={index}
                style={{marginLeft: -5}}
                onPress={() =>
                    props.navigation.navigate("ProductInfo", {
                        uid: item.id,
                    })
                }
            >
                <Left style={{maxWidth: width / 6}}>
                    <Thumbnail
                        source={{uri: item.image}}
                        style={{maxWidth: "100%"}}
                    />
                </Left>
                <Body style={{maxWidth: width / 3 + 30}}>
                    <Textpopins children={item.title}/>
                    <Textpopins children={item.price}/>
                </Body>
                <Right style={{flexDirection: "row"}}>
                    <NumericInput
                        value={1}
                        onChange={(value) => props.updateVal(item, value)}
                        onLimitReached={(isMax, msg) => alert(t("cards.minimal"))}
                        totalWidth={width / 3}
                        totalHeight={50}
                        iconSize={25}
                        step={1}
                        minValue={1}
                        maxValue={100}
                        valueType="integer"
                        rounded
                        textColor="#fff"
                        iconStyle={{color: "white"}}
                        rightButtonBackgroundColor="#7c9d32"
                        leftButtonBackgroundColor="#E56B70"
                    />

                    <Button
                        transparent
                        style={styles.buttonStyle}
                        onPress={() => props.removeCart(item)}
                    >
                        <EvilIcons name="trash" size={30} color="#BF360C"/>
                    </Button>
                </Right>
            </ListItem>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Header button={true}
                        title={t("bucket.header.cartlists.title")}/>
            </View>

            <View style={styles.content}>
                {props.bucketitems && props.bucketitems.length > 0 ? (
                    <List
                        style={{
                            width: width,
                            height: "100%",
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        <Fab
                            direction="right"
                            position="bottomRight"
                            style={{
                                backgroundColor: "#7c9d32",
                                zIndex: 150,
                            }}
                            onPress={() =>
                                props.navigation.navigate("PayThanks", {
                                    checkid: 2,
                                })
                            }
                        >
                            <AntDesign name="check" size={24} color="#fff"/>
                        </Fab>

                        <FlatList
                            data={props.bucketitems}
                            renderItem={renderBucket}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </List>
                ) : (
                    <List
                        style={{
                            width: width,
                            height: "100%",
                            marginTop: Constants.statusBarHeight,
                            padding: 0,
                        }}
                    >
                        <Textpopins
                            children={t("actions.noResult")}
                            style={styles.noResult}
                        />
                    </List>
                )}
            </View>
        </SafeAreaView>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeCart: (product) =>
            dispatch({type: "REMOVE_FROM_CART", payload: product}),
        updateVal: (product, value) =>
            dispatch({type: "UPDATE_CART", payload: product, value: value}),
    };
};

const mapStateToProps = (state) => {
    return {
        bucketitems: state.bucketitems,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartList);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignContent: "center"
    },
    content: {
        flex: 8,
        backgroundColor: 'rgba(124, 157, 50,.7)',
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
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
    buttonstyle: {
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
});
