import React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    SafeAreaView, Text,
} from "react-native";
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
import firebase from "../../../functions/firebase/firebaseConfig";

const {width, height} = Dimensions.get("window");

function CartList(props) {

    const [routeParams, setrouteParams] = React.useState(null)
    const [totalBalance, settotalBalance] = React.useState(0)
    const [card, setCard] = React.useState(null)

    React.useEffect(effect => {
        setrouteParams(props.route.params.routeParams)
        totalBalanceFunction()
        cardbalance(props.route.params.routeParams.selectedCard)
    }, [])

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
                    <Textpopins>
                        {item.qyt * item.price} ₼
                    </Textpopins>
                </Body>
                <Right style={{flexDirection: "row"}}>
                    <NumericInput
                        value={item.qyt}
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
                        textColor="#7c9d32"
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


    function totalBalanceFunction() {
        let balance = 0;
        props.bucketitems.map(element => {
            balance = balance + element.qyt * element.price;
        })
        settotalBalance(balance)
    }

    function cardbalance(card) {
        if (card) {
            firebase.database().goOnline();

            var dataW = null;
            firebase
                .database()
                .ref(
                    "users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/cards/" + card
                ).on("value", (data) => {
                dataW = data.val();
            });
            if (dataW == null) {
                firebase
                    .database()
                    .ref(
                        "users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/bonuses/" +
                        card
                    )
                    .on("value", (data) => {
                        dataW = data.val();
                    });
            }
            setCard(dataW)
        }
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
                        <Button
                            style={[styles.center, {
                                backgroundColor: "#7c9d32",
                                zIndex: 150,
                                paddingHorizontal: Constants.statusBarHeight,
                                position: "absolute",
                                flexDirection: "row",
                                bottom: "6%",
                                right: 0,
                                borderTopLeftRadius: Constants.statusBarHeight,
                                borderTopRightRadius: Constants.statusBarHeight,
                                borderBottomRightRadius: Constants.statusBarHeight,
                                borderBottomLeftRadius: Constants.statusBarHeight,
                                justifyContent: "space-around"
                            }]}
                            onPress={() =>
                                props.navigation.navigate("PayThanks", {
                                    checkid: 2,
                                })
                            }
                        >
                            <Textpopins style={{
                                color: "#fff",
                                textAlign: "center"
                            }}>{t("bucket.header.cartlists.finishpayment")}</Textpopins>
                            <AntDesign style={{marginLeft: 10}} name="check" size={24} color="#fff"/>
                        </Button>

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

            <View style={styles.footer}>

                <View style={{
                    flexDirection: "row",
                    justifyContent: 'space-between',
                }}>
                    <Textpopins
                        style={{
                            color: "rgba(255,255,255,.7)",
                            fontSize: 22,
                        }}
                    >
                        {t("barcode.paying.totalBalance")}
                    </Textpopins>
                    <Textpopins
                        style={{
                            color: "rgba(255,255,255,.7)",
                            fontSize: 22,
                        }}
                    >
                        {Math.fround(totalBalance).toString().substring(0,5)} ₼
                    </Textpopins>
                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: 'space-between',
                }}>
                    <Textpopins
                        style={{
                            color: "rgba(255,255,255,.7)",
                            fontSize: 20,
                        }}
                    >
                        {t("barcode.paying.edv") + " 18%"}
                    </Textpopins>
                    <Textpopins
                        style={{
                            color: "rgba(255,255,255,.7)",
                            fontSize: 20,
                        }}
                    >
                        {Math.fround(totalBalance * 18 / 100).toString().substring(0,4)} ₼
                    </Textpopins>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: 'space-between',
                }}>
                    <Textpopins
                        style={{
                            color: "rgba(255,255,255,.7)",
                            fontSize: 20,
                        }}
                    >
                        {t("barcode.paying.balance")}
                    </Textpopins>
                    <Textpopins
                        style={{
                            color: "rgba(255,255,255,.7)",
                            fontSize: 20,
                        }}
                    >
                        {card ? card.cardInfo.cvc : 0} ₼ </Textpopins>
                </View>


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
        flex: 0.1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignContent: "center"
    },
    content: {
        flex: 0.8,
        backgroundColor: '#ebecf0',
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
    },
    footer: {
        flex: 0.15,
        backgroundColor: "#7c9d32",
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
        paddingHorizontal: Constants.statusBarHeight,
        flexDirection: "column",
        justifyContent: "space-between"
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
