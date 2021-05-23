import React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Text,
    FlatList,
    TouchableOpacity, SafeAreaView, ScrollView, Image,
} from "react-native";
import {StatusBar} from "expo-status-bar";
import {connect} from "react-redux";
import {AntDesign, Feather, FontAwesome} from "@expo/vector-icons";
import Textpopins from "../../../functions/screenfunctions/text";

const {width, height} = Dimensions.get("window");
import Constants from "expo-constants";
import Header from "./components/BucketHeader";
import Filter from "./components/filter";
import {Button} from "native-base";

class InCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: true,
            datas: [
                {
                    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                    title: 'Səba',
                    image: 'https://www.arazmarket.az/site/assets/files/2475/2700037.png',
                    description: "frozen chicken 1kg",
                    price: 4.59,
                    qyt: 1,
                },
                {
                    id: '3ac6sddadc-c605-48d3-a4f8-fbd91aa95f63',
                    title: 'Bizim süfrə',
                    image: 'https://www.arazmarket.az/site/assets/files/2476/004072.png',
                    description: "mayonez 460qr",
                    price: 1.59,
                    qyt: 1,
                },
                {
                    id: 'bdqedqwldmqwdma-c1b1-46c2-aed5-3ad53abb28ba',
                    title: 'Final',
                    image: 'https://www.arazmarket.az/site/assets/files/2477/028232.png',
                    description: "ultra earl grey çay",
                    price: 2.19,
                    qyt: 1,
                },
                {
                    id: '3ac68dsaasdsaf-a4f8-fbd91aa95f63',
                    title: 'Posidelkino',
                    image: 'https://www.arazmarket.az/site/assets/files/2478/002857.png',
                    description: "peçenye 310qr",
                    price: 2.02,
                    qyt: 1,
                },
                {
                    id: '3ac68dssdasdqdqdqdf-a4f8-fbd91aa95f63',
                    title: 'Pantene',
                    image: 'https://www.arazmarket.az/site/assets/files/2479/004938.png',
                    description: "şampun 400ml",
                    price: 4.40,
                    qyt: 1,
                },
                {
                    id: '3ac68dssdqdqjdqüdnqüodnqüodnqündqdf-a4f8-fbd91aa95f63',
                    title: 'Çayka',
                    image: 'https://www.arazmarket.az/site/assets/files/2487/25.png',
                    description: "şokolad 1kq",
                    price: 4.99,
                    qyt: 1,
                },
            ],
            activeFilter: false,
            brands: [
                {id: 1, label: "Caremood"},
                {id: 2, label: "Grand Mart"},
                {id: 3, label: "Bol Mart"}
            ],
        };
    }

    getInfo() {
        const params = this.props.route.params;
        const {catid} = params;
        this.setState({refresh: false});
    }

    componentDidMount() {
        this.setState({refresh: true});
        this.getInfo();
    }

    renderFlatList({item, index}) {
        return (
            <TouchableOpacity
                style={styles.product} key={index}
                onPress={() =>
                    this.props.navigation.navigate("ProductInfo", {
                        uid: item.id,
                    })
                }
            >
                <Image
                    source={{
                        uri: item.image,
                    }}
                    style={{
                        width: width / 2.3,
                        height: width / 2.3,
                        borderRadius: width / 2.3,
                    }}
                />
                <Text style={[styles.productTitle, {color: '#5C0082'}]}>
                    {item.title}
                </Text>
                <Text style={styles.productDescription}>Lorem Ipsum dummy text.</Text>
                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={() => this.props.addtoCard(item)}
                        style={styles.addToCart}>
                        {this.props.bucketitems.find(element => element.id == item.id) ? (
                            <FontAwesome name="cart-arrow-down" size={24} color="black"/>
                        ) : (
                            <AntDesign name="shoppingcart" size={24} color="black"/>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addToCart}
                        onPress={() => this.props.addWishList(item)}
                    >
                        {this.props.wishitems.find(element => element.id == item.id) ? (
                            <AntDesign name="heart" size={24} color="black"/>
                        ) : (
                            <AntDesign name="hearto" size={24} color="black"/>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addToCart}>
                        <Textpopins>{item.price} ₼</Textpopins>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }

    renderContent() {
        if (this.state.refresh) {
            return (
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color="#5C0082"/>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Header button={true}
                                title={"Cat name"}/>
                    </View>

                    <View style={[styles.content, {flex: 0.9}]}>
                        <View style={[styles.footer, {flex: 1}]}>
                            <ScrollView style={styles.productLists} vertical={true}>
                                <FlatList
                                    data={this.state.datas}
                                    numColumns={2}
                                    renderItem={this.renderFlatList.bind(this)}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </ScrollView>
                        </View>
                    </View>

                </View>
            );
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#fff" style="dark"/>
                {this.renderContent()}
                <Button large style={[styles.filterButton, {
                    right: this.state.activeFilter ? 0 : -Constants.statusBarHeight / 2
                }]}
                        onPress={() => this.setState({activeFilter: !this.state.activeFilter})}
                >
                    <Feather name="filter" size={24} color="#fff"/>
                </Button>
                {this.state.activeFilter ? (
                    <Filter active={this.state.activeFilter}
                            closeModal={() => this.setState({activeFilter: !this.state.activeFilter})}
                            searchFilter={() => this.setState({activeFilter: !this.state.activeFilter})}
                            brands={this.state.brands}/>
                ) : null}
            </SafeAreaView>
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
        removewishlist: (product) =>
            dispatch({type: "REMOVE_FROM_WISHLIST", payload: product}),
        addWishList: (product) =>
            dispatch({type: "ADD_TO_WISHLIST", payload: product}),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(InCustomer);

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
        flex: 0.8,
        backgroundColor: '#ebecf0',
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
    },
    top: {
        flex: 0.1,
    },
    footer: {
        flex: 0.9,
        marginTop: 5,
        flexDirection: 'column',
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
    productLists: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        marginTop: 5,
    },
    product: {
        width: width / 1.9,
        height: width / 1.9,
        // justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: Constants.statusBarHeight,
    },
    productTitle: {
        fontSize: 20,
        color: 'rgba(0,0,0,.8)',
        fontWeight: 'bold',
    },
    productDescription: {
        fontSize: 14,
        color: 'rgba(0,0,0,.6)',
    },
    actions: {
        position: 'absolute',
        top: 0,
        left: 3,
        flexDirection: 'column',
        flex: 1,
    },
    addToCart: {
        paddingHorizontal: Constants.statusBarHeight / 3,
        paddingVertical: 5,
        backgroundColor: '#fff',
        borderRadius: Constants.statusBarHeight,
        marginVertical: 2,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    filterButton: {
        position: "absolute",
        right: -Constants.statusBarHeight / 2,
        top: "50%",
        backgroundColor: "#5C0082",
        padding: Constants.statusBarHeight / 2,
        paddingVertical: Constants.statusBarHeight / 3,
        zIndex: 9999999,
    },
});
