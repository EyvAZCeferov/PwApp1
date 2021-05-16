import React from 'react';
import Constants from "expo-constants";
import {View, StyleSheet, FlatList, Dimensions, ScrollView} from "react-native";
import Header from "./components/BucketHeader";
import {t} from "../../../functions/lang";
import {connect} from "react-redux";
import {Body, Button, Left, List, ListItem, Right, Thumbnail} from "native-base";
import Textpopins from "../../../functions/screenfunctions/text";
import firebase from "../../../functions/firebase/firebaseConfig";
import * as Permissions from "expo-permissions";
import {AntDesign} from "@expo/vector-icons";

const {width, height} = Dimensions.get("screen");

class Beforebuy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            routeParams: null,
            totalBalance: 0,
            latitude: null,
            longitude: null,
            markers: null,
            markerCount: null
        }
    }

    async getPerm() {
        const {status} = await Permissions.getAsync(Permissions.LOCATION);

        if (status !== "granted") {
            const response = await Permissions.askAsync(Permissions.LOCATION);
        }
        navigator.geolocation.getCurrentPosition(
            ({coords: {latitude, longitude}}) =>
                this.setState({
                    latitude: latitude,
                    longitude: longitude,
                }),
            (error) => console.log("Error:", error)
        );
    }

    componentDidMount() {
        let routeParams = this.props.route.params;
        this.setState({
            routeParams: routeParams
        })
        console.log(routeParams.checkid);
        this.totalBalanceFunction()
        this.cardbalance(this.props.route.params.routeParams.selectedCard)
        this.getPerm();
        this.getInfo();
    }

    async getInfo() {
        var datas = [];
        firebase
            .database()
            .ref("maps")
            .on("value", (data) => {
                data.forEach((data) => {
                    datas.push(data.val());
                });
                this.setState({
                    markers: datas,
                    markerCount: data.numChildren(),
                });
            });
    }

    totalBalanceFunction() {
        let balance = 0;
        this.props.bucketitems.map(element => {
            balance = balance + element.qyt * element.price;
        })
        this.setState({totalBalance: balance})
    }

    cardbalance(card) {
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
            this.setState({
                card: dataW
            })
        }
    }

    renderBucket({item, index}) {
        return (
            <ListItem
                key={index}
                style={{marginLeft: -5}}
                onPress={() =>
                    this.props.navigation.navigate("ProductInfo", {
                        uid: item.id,
                    })
                }
            >
                <Left>
                    <Thumbnail
                        source={{uri: item.image}}
                        style={{maxWidth: "100%"}}
                    />
                </Left>
                <Body style={{marginLeft: -Constants.statusBarHeight * 3}}>
                    <Textpopins children={item.title}/>
                </Body>
                <Right>
                    <Textpopins>
                        {item.qyt * item.price} ₼
                    </Textpopins>
                </Right>
            </ListItem>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Header button title={t("bucket.header.beforeorder")}/>
                </View>
                <View style={styles.content}>
                    <View style={styles.top}>
                        {this.props.bucketitems && this.props.bucketitems.length > 0 ? (
                            <List
                                style={{
                                    width: width,
                                    height: "100%",
                                    margin: 0,
                                    padding: 0,
                                }}
                            >
                                <FlatList
                                    data={this.props.bucketitems}
                                    renderItem={this.renderBucket.bind(this)}
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
                            height: "57.5%",
                            borderTopWidth: 1,
                            borderTopColor: "#7c9d32"
                        }}>

                            <ScrollView style={{marginTop: 0, flex: 0.8, backgroundColor: "#fff"}}>
                                {this.state.markers ? this.state.markers.map(item => {
                                    return (
                                        <ListItem style={{flex: 1}} onPress={() => this.toLoc(item)}>
                                            <Left style={{flex: 0.2}}>
                                                <Thumbnail
                                                    source={{uri: item.image_url}}
                                                />
                                            </Left>
                                            <Body style={{flex: 0.7}}>
                                                <Textpopins style={{
                                                    fontSize: 19,
                                                    color: "rgba(0,0,0,.8)"
                                                }}>{item.name}</Textpopins>
                                                <Textpopins style={{
                                                    fontSize: 15,
                                                    color: "rgba(0,0,0,.4)"
                                                }}>{item.address}</Textpopins>
                                            </Body>
                                            <Right style={{flex: 0.2}}>
                                                <Textpopins style={{
                                                    fontSize: 15,
                                                    color: "rgba(124,157,50,.8)"
                                                }}>51516 m</Textpopins>
                                            </Right>
                                        </ListItem>
                                    )
                                }) : null}
                            </ScrollView>
                        </View>


                        <View style={{
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            marginTop: Constants.statusBarHeight,
                            marginHorizontal: Constants.statusBarHeight / 2
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
                                {Math.fround(this.state.totalBalance).toString().substring(0, 5)} ₼
                            </Textpopins>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            marginHorizontal: Constants.statusBarHeight / 2
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
                                {Math.fround(this.state.totalBalance * 18 / 100).toString().substring(0, 4)} ₼
                            </Textpopins>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            marginHorizontal: Constants.statusBarHeight / 2
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
                                {this.state.card ? this.state.card.cardInfo.cvc : 0} ₼ </Textpopins>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: 'center',
                            marginHorizontal: Constants.statusBarHeight / 2
                        }}>
                            <Button
                                style={[styles.center, {
                                    backgroundColor: "#fff",
                                    paddingHorizontal: Constants.statusBarHeight,
                                    flexDirection: "row",
                                    borderTopLeftRadius: Constants.statusBarHeight,
                                    borderTopRightRadius: Constants.statusBarHeight,
                                    borderBottomRightRadius: Constants.statusBarHeight,
                                    borderBottomLeftRadius: Constants.statusBarHeight,
                                    justifyContent: "space-around"
                                }]}
                                onPress={() =>
                                    this.props.navigation.navigate("PayThanks", {
                                        checkid: "Check",
                                    })
                                }
                            >
                                <Textpopins style={{
                                    color: "#7c9d32",
                                    textAlign: "center"
                                }}>
                                    {t("bucket.header.cartlists.finishpayment")}
                                </Textpopins>
                                <AntDesign style={{marginLeft: 10}} name="check" size={24} color="#7c9d32"/>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wishitems: state.wishitems,
        bucketitems: state.bucketitems,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addtoCard: (product) => dispatch({type: "ADD_TO_CART", payload: product}),
        addWishList: (product) => dispatch({type: "ADD_TO_WISHLIST", payload: product}),
        removewishlist: (product) =>
            dispatch({type: "REMOVE_FROM_WISHLIST", payload: product}),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Beforebuy);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flex: 0.1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignContent: "center"
    },
    content: {
        flex: 0.9,
        backgroundColor: '#ebecf0',
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
    },
    top: {
        flex: 0.4,
    },
    footer: {
        flex: 0.6,
        flexDirection: 'column',
        backgroundColor: "#7c9d32",
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
    },
    center: {
        textAlign: "center",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
});