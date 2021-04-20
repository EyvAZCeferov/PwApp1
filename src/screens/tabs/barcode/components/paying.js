import React from "react";
import {View, Text, StyleSheet, Dimensions} from "react-native";
import firebase from "../../../../functions/firebase/firebaseConfig";
import {StatusBar} from "expo-status-bar";
import {hideNumb} from "../../../../functions/standart/helper";
import Textpopins from "../../../../functions/screenfunctions/text";
import Constants from "expo-constants";
import {t} from "../../../../functions/lang";

const {width, height} = Dimensions.get("window");
let lastPrice = 0;
let edvhesabla = 0;

export default class Paying extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: true,
            selectedCard: this.props.cardNumb,
            cards: null,
            checks: null,
            checksCount: 0,
            priceAll: 0,
            edv: 0,
        };
    }

    async getInfo() {
        if (this.state.selectedCard) {
            this.setState({refresh: true});
            firebase.database().goOnline();

            var dataW = null;
            firebase
                .database()
                .ref(
                    "users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/cards/" + this.state.selectedCard
                )
                .on("value", (data) => {
                    dataW = data.val();
                });
            if (dataW == null) {
                firebase
                    .database()
                    .ref(
                        "users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/bonuses/" +
                        this.state.selectedCard
                    )
                    .on("value", (data) => {
                        dataW = data.val();
                    });
            }
            this.setState({
                cards: dataW,
                refresh: false,
            });
            this.countEDV();
            this.renderTopPanel();
        }
    }

    componentWillMount() {
        this.getInfo();
    }

    componentDidMount() {
        this.getInfo();
        setInterval(() => {
            this.getInfo();
        }, 1000);
    }

    priceCollector() {
        var datas = [];
        firebase
            .database()
            .ref(
                "users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/checks/" +
                this.props.checkid +
                "/products/"
            )
            .on("value", (data) => {
                if (data.numChildren() > 0 && data != null) {
                    data.forEach((data) => {
                        datas.push(data.val());
                    });
                    this.setState({
                        checks: datas,
                        checksCount: data.numChildren(),
                    });
                }
            });
    }

    price() {
        this.priceCollector();
        if (this.state.checks != null && this.state.checksCount > 0) {
            this.state.checks.map((element) => {
                var elementPrice = parseFloat(element.price);
                lastPrice = lastPrice + elementPrice;
            });
            this.setState({priceAll: lastPrice});
        }
        lastPrice = 0;
        return this.state.priceAll;
    }

    countEDV() {
        this.price();
        if (parseFloat(this.state.priceAll) > 0) {
            edvhesabla = (parseFloat(this.state.priceAll) * 18) / 100;
            this.setState({edv: edvhesabla});
        }
        edvhesabla = 0;
        return this.state.edv;
    }

    balance(card) {
        if (card != null) {
            if (card.cvc) {
                return card.cvc;
            } else {
                return card.price;
            }
        }
    }

    lastBalance(card) {
        if (card != null) {
            let result = 0;
            if (card.cvc) {
                result = parseFloat(card.cvc) - parseFloat(this.state.priceAll);
            } else {
                result = parseFloat(card.price) - parseFloat(this.state.priceAll);
            }
            return result;
        }
    }

    renderCardDatas() {
        return (
            <View
                style={{
                    backgroundColor: "#fff",
                    width: width / 2.2,
                    height: "100%",
                    borderRadius: 12,
                    paddingTop: Constants.statusBarHeight * 2,
                }}
            >
                <View
                    style={{
                        justifyContent: "space-between",
                        flex: 1,
                        flexDirection: "column",
                        marginVertical: 10,
                        paddingHorizontal: 15,
                    }}
                >
                    <View>
                        <Textpopins
                            style={{
                                fontSize: 21,
                                fontWeight: "bold",
                                color: "#000",
                                marginTop: 14,
                            }}
                            children={t("barcode.paying.aboutCard")}
                        />
                        <View
                            style={{
                                width: "100%",
                                marginTop: 5,
                                flexDirection: "column-reverse",
                                justifyContent: "center",
                            }}
                        >
                            <Textpopins
                                style={{color: "rgba(0,0,0,.5)", fontSize: 14}}
                                children={t("barcode.paying.cardNumb")}
                            />
                            <Textpopins
                                style={{
                                    color: "#000",
                                    fontSize: 18,
                                }}
                                children={
                                    this.state.cards != null
                                        ? hideNumb(this.state.cards.cardInfo.number)
                                        : "*********"
                                }
                            />
                        </View>
                        <View style={{marginTop: 15}}/>
                        <View
                            style={{
                                width: "100%",
                                marginTop: 5,
                                flexDirection: "column-reverse",
                                justifyContent: "space-around",
                            }}
                        >
                            <Textpopins
                                style={{color: "rgba(0,0,0,.5)", fontSize: 14}}
                                children={t("barcode.paying.balance")}
                            />
                            <Textpopins
                                style={{
                                    color: "#000",
                                    fontSize: 18,
                                }}
                                children={
                                    this.state.cards != null
                                        ? this.balance(this.state.cards.cardInfo) + "₼"
                                        : 0 + "₼"
                                }
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderRight() {
        return (
            <View
                style={{
                    backgroundColor: "#7c9d32",
                    width: width / 2.6,
                    height: "100%",
                    borderBottomLeftRadius: Constants.statusBarHeight * 2,
                    borderTopLeftRadius: 0,
                    flexDirection: "column",
                    paddingHorizontal: 8,
                    paddingTop: Constants.statusBarHeight * 2,
                }}
            >
                <Textpopins
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#fff",
                        marginTop: 20,
                    }}
                    children={t("barcode.paying.totalBalance")}
                />
                <Text
                    style={{
                        color: "rgba(255,255,255,.5)",
                        fontSize: 17,
                        marginLeft: 5,
                        marginTop: 2,
                    }}
                >
                    {this.state.priceAll} ₼
                </Text>
                <View style={{marginTop: 5, marginLeft: 5}}>
                    <Textpopins
                        style={{color: "#fff", fontSize: 20, fontWeight: "bold"}}
                        children={t("barcode.paying.remainingBalance")}
                    />
                    <Textpopins
                        style={{
                            color: "rgba(255,255,255,.5)",
                            fontSize: 17,
                            marginLeft: 5,
                            marginTop: 2,
                        }}
                        children={
                            this.state.cards != null
                                ? this.lastBalance(this.state.cards.cardInfo) + "₼"
                                : 0 + "₼"
                        }
                    />
                </View>
                <View style={{marginTop: 5, marginLeft: 5}}>
                    <Textpopins
                        style={{color: "#fff", fontSize: 20, fontWeight: "bold"}}
                        children={t("barcode.paying.edv") + " 18%"}
                    />
                    <Textpopins
                        style={{
                            color: "rgba(255,255,255,.5)",
                            fontSize: 17,
                            marginLeft: 5,
                            marginTop: 2,
                        }}
                        children={this.state.edv + "₼"}
                    />
                </View>
            </View>
        );
    }

    renderTopPanel() {
        return (
            <View style={styles.cardCotnent}>
                {this.renderCardDatas()}
                {this.renderRight()}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#7c9d32" style="light"/>
                <View style={styles.card}>{this.renderTopPanel()}</View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7c9d32",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        flex: 1,
        width: width - 50,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 0,
        borderColor: "transparent",
    },
    cardCotnent: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
    },
    cardOne: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: 3,
        paddingVertical: 3,
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
    },
    cardOnePass: {
        color: "rgba(0,0,0,.5)",
        fontSize: 14,
    },
    cardOneVal: {
        fontSize: 15,
        color: "#7c9d32",
    },
});
