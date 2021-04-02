import React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    ImageBackground,
    Text,
} from "react-native";
import {StatusBar} from "expo-status-bar";
import {connect} from "react-redux";
import {t} from "../../../functions/lang";
import {Header, Left, Body, Right, Button} from "native-base";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";

const {width, height} = Dimensions.get("window");
import Constants from "expo-constants";

const products = [
    {
        id: 1,
        image: "https://picsum.photos/130",
        name: "Product1",
        category: 1,
        qyt: 1,
        price: 20,
    },
    {
        id: 2,
        image: "https://picsum.photos/120",
        name: "Product2",
        category: 1,
        qyt: 0.351,
        price: 30,
    },
    {
        id: 3,
        image: "https://picsum.photos/110",
        name: "Product3",
        category: 3,
        qyt: 0.321,
        price: 1.2,
    },
    {
        id: 4,
        image: "https://picsum.photos/100",
        name: "Product4",
        category: 4,
        qyt: 0.331,
        price: 1.5,
    },
    {
        id: 5,
        image: "https://picsum.photos/150",
        name: "Product5",
        category: 5,
        qyt: 0.5,
        price: 3,
    },
];

class ProductInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: true,
            product: null,
        };
    }

    getInfo() {
        const params = this.props.route.params;
        const {uid} = params;
        var product = products.findIndex((products) => products.id == uid);
        this.setState({product: products[product]});
        this.setState({refresh: false});
    }

    componentDidMount() {
        this.getInfo();
    }


    content() {
        const that = this;

        const header = (image) => {
            return (
                <View>
                    <ImageBackground
                        resizeMode="cover"
                        resizeMethod="resize"
                        source={{uri: image}}
                        style={{
                            width: width,
                            borderRadius: 0,
                            height: height / 3,
                            backgroundColor: "red",
                        }}
                    >
                        <Header
                            backgroundColor="transparent"
                            androidStatusBarColor="transparent"
                            style={{
                                backgroundColor: "transparent",
                                shadowColor: "transparent",
                                elevation: 0,
                                shadowOpacity: 0,
                                shadowRadius: 0,
                            }}
                        >
                            <StatusBar hidden/>
                            <Left style={styles.center}>
                                <Button
                                    onPress={() => that.props.navigation.goBack()}
                                    style={{
                                        backgroundColor: "#fff",
                                        borderLeftRadius: 5,
                                    }}
                                    transparent
                                >
                                    <AntDesign name="left" size={24} color="#7c9d32"/>
                                </Button>
                            </Left>
                            <Body></Body>
                            <Right style={[styles.headerRight, styles.center]}>
                                <Button
                                    style={{
                                        backgroundColor: "#fff",
                                        borderRadius: 0,
                                        borderTopLeftRadius: 5,
                                        borderBottomLeftRadius: 5,
                                    }}
                                    transparent
                                    onPress={() => that.props.navigation.navigate("CartList")}
                                >
                                    <AntDesign name="shoppingcart" size={24} color="#000"/>
                                    <Text
                                        style={[
                                            styles.center,
                                            {
                                                color: "#7c9d32",
                                                fontSize: 13,
                                                fontWeight: "bold",
                                                position: "absolute",
                                                bottom: 6,
                                                right: 8,
                                            },
                                        ]}
                                        children={that.props.bucketitems.length}
                                    />
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: "#fff",
                                        borderRadius: 0,
                                        borderTopRightRadius: 5,
                                        borderBottomRightRadius: 5,
                                    }}
                                    transparent
                                    onPress={() => that.props.navigation.navigate("WishList")}
                                >
                                    <AntDesign name="hearto" size={24} color="black"/>
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
                                        children={that.props.wishitems.length}
                                    />
                                </Button>
                            </Right>
                        </Header>
                    </ImageBackground>
                </View>
            );
        };

        const contentArena = (product) => (
            <View>
                <Textpopins
                    style={{margin: Constants.statusBarHeight, fontWeight: "bold"}}
                >
                    {product.name}
                </Textpopins>
                <View
                    style={{flexDirection: "column", justifyContent: "space-around"}}
                >
                    <View
                        style={{flexDirection: "row", justifyContent: "space-around"}}
                    >
                        <Button
                            bordered
                            success
                            style={{
                                width: width / 2.3,
                                textAlign: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center",
                            }}
                            onPress={() => this.props.addWishList(product)}
                        >
                            <AntDesign name="hearto" size={20} color="#7c9d32"/>
                        </Button>

                        <Button
                            bordered
                            success
                            style={{
                                width: width / 2.3,
                                textAlign: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center",
                            }}
                            onPress={() => this.props.addtoCard(product)}
                        >
                            <MaterialIcons
                                name="add-shopping-cart"
                                size={20}
                                color="#7c9d32"
                            />
                        </Button>
                    </View>
                    <Textpopins style={{margin: Constants.statusBarHeight}}>
                        {product.name}
                    </Textpopins>
                </View>
            </View>
        );

        if (this.state.refresh) {
            return (
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color="#7c9d32"/>
                </View>
            );
        } else {
            if (this.state.product || this.state.product != null) {
                return (
                    <View style={styles.container}>
                        {header(this.state.product.image, this.state.product.name)}
                        {contentArena(this.state.product)}
                    </View>
                );
            } else {
                return (
                    <View style={[styles.center, styles.container]}>
                        <Textpopins
                            children={t("actions.noResult")}
                            style={styles.noResult}
                        />
                    </View>
                );
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden hideTransitionAnimation translucent/>
                {this.content()}
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
        addtoCard: (product) =>
            dispatch({type: "ADD_TO_CART", payload: product}),
        removewishlist: (product) =>
            dispatch({type: "REMOVE_FROM_WISHLIST", payload: product}),
        addWishList: (product) =>
            dispatch({type: "ADD_TO_WISHLIST", payload: product}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductInfo);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    headerTitle: {
        color: "#7c9d32",
        fontSize: 14,
        fontWeight: "bold",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
    },
    headerRight: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
});
