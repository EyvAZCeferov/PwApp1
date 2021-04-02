import React from "react";
import {View, Text, StyleSheet, Dimensions, FlatList, SafeAreaView} from "react-native";
import {StatusBar} from "expo-status-bar";
import BucketHeader from "./components/BucketHeader";
import {t} from "../../../functions/lang";
import {List, ListItem, Left, Body, Right, Button, Thumbnail} from "native-base";
import {connect} from "react-redux";
import Constants from "expo-constants";
import Textpopins from "../../../functions/screenfunctions/text";
import {EvilIcons} from "@expo/vector-icons";
import NumericInput from 'react-native-numeric-input'


const {width, height} = Dimensions.get("window");

function CartList(props) {

    function renderBucket({item, index}) {

        return (
            <ListItem key={index} style={{marginLeft: -5}} onPress={() =>
                props.navigation.navigate("ProductInfo", {
                    uid: item.id,
                })
            }>
                <Left style={{maxWidth: width / 6}}>
                    <Thumbnail source={{uri: item.image}} style={{maxWidth: "100%"}}/>
                </Left>
                <Body style={{maxWidth: width / 3 + 30}}>
                    <Textpopins children={item.name}/>
                </Body>
                <Right style={{flexDirection: "row"}}>
                    <NumericInput
                        value={Math.ceil(item.qyt)}
                        onChange={value => props.updateVal(item, value)}
                        onLimitReached={(isMax, msg) => alert(isMax, msg)}
                        totalWidth={width / 3}
                        totalHeight={50}
                        iconSize={25}
                        step={1}
                        minValue={1}
                        maxValue={100}
                        valueType='integer'
                        rounded
                        textColor='#7c9d32'
                        iconStyle={{color: 'white'}}
                        rightButtonBackgroundColor='#7c9d32'
                        leftButtonBackgroundColor='#E56B70'/>

                    <Button transparent style={styles.buttonStyle} onPress={() => props.removeCart(item)}>
                        <EvilIcons name="trash" size={30} color="#BF360C"/>
                    </Button>

                </Right>
            </ListItem>
        );
    }

    return (
        <SafeAreaView style={[styles.container, styles.center]}>
            <StatusBar backgroundColor="#fff" style="dark"/>
            <View>
                <View style={styles.header}>
                    <BucketHeader
                        button={true}
                        title={t("bucket.header.cartlists.title")}
                    />
                </View>
                <View style={[styles.center, styles.contentArena]}>
                    {props.bucketitems && props.bucketitems.length > 0 ? (
                        <List
                            style={{
                                width: width,
                                height: "100%",
                                margin: 0,
                                padding: 0,
                            }}
                        >
                            <FlatList
                                data={props.bucketitems}
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
        </SafeAreaView>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeCart: (product) => dispatch({type: "REMOVE_FROM_CART", payload: product}),
        updateVal: (product, value) => dispatch({type: "UPDATE_CART", payload: product, value: value}),
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
        width: width,
        height: "20%",
        marginTop: Constants.statusBarHeight,
    },
    contentArena: {
        width: width,
        height: "80%",
        flexDirection: "column",
        margin: 0,
        padding: 0
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
