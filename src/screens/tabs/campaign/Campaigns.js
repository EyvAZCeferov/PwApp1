import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
} from 'react-native';
import Constants from 'expo-constants';
import Header from './components/Header';

const {width} = Dimensions.get('screen');
import {t} from "../../../functions/lang";
import Textpopins from "../../../functions/screenfunctions/text";


class Campaigns extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: [
                {
                    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                    title: 'Səba',
                    image: 'https://www.arazmarket.az/site/assets/files/2475/2700037.png',
                    description: "frozen chicken 1kg",
                    price: 4.59,
                },
                {
                    id: '3ac6sddadc-c605-48d3-a4f8-fbd91aa95f63',
                    title: 'Bizim süfrə',
                    image: 'https://www.arazmarket.az/site/assets/files/2476/004072.png',
                    description: "mayonez 460qr",
                    price: 1.59,
                },
                {
                    id: 'bdqedqwldmqwdma-c1b1-46c2-aed5-3ad53abb28ba',
                    title: 'Final',
                    image: 'https://www.arazmarket.az/site/assets/files/2477/028232.png',
                    description: "ultra earl grey çay",
                    price: 2.19,
                },
                {
                    id: '3ac68dsaasdsaf-a4f8-fbd91aa95f63',
                    title: 'Posidelkino',
                    image: 'https://www.arazmarket.az/site/assets/files/2478/002857.png',
                    description: "peçenye 310qr",
                    price: 2.02,
                },
                {
                    id: '3ac68dssdasdqdqdqdf-a4f8-fbd91aa95f63',
                    title: 'Pantene',
                    image: 'https://www.arazmarket.az/site/assets/files/2479/004938.png',
                    description: "şampun 400ml",
                    price: 4.40,
                },
                {
                    id: '3ac68dssdqdqjdqüdnqüodnqüodnqündqdf-a4f8-fbd91aa95f63',
                    title: 'Çayka',
                    image: 'https://www.arazmarket.az/site/assets/files/2487/25.png',
                    description: "şokolad 1kq",
                    price: 4.99,
                },
            ],
        }
    }

    renderHorizontalList() {
        return this.state.datas.map((element) => {
            return (
                <TouchableOpacity
                    style={styles.topListsProduct}
                    onPress={() => this.props.navigation.navigate("Customer", {
                        catid: element.id,
                    })}>
                    {element.icon}
                    <Textpopins style={styles.productTitle}>{element.title}</Textpopins>
                </TouchableOpacity>
            );
        });
    }

    renderFlatList({item, index}) {
        return (
            <TouchableOpacity
                style={styles.product}
                key={index}
                onPress={() =>
                    this.props.navigation.navigate("Campaign", {
                        uid: item.id,
                    })
                }
            >
                <Image
                    source={{
                        uri: item.image,
                    }}
                    resizemode="contain"
                    style={{
                        width: width / 2,
                        height: width / 2,
                        borderRadius: width / 2,
                        marginRight: Constants.statusBarHeight
                    }}
                />
                <View>
                    <Textpopins style={[styles.productTitle, {color: '#7c9d32'}]}>
                        {item.title}
                    </Textpopins>
                    <Textpopins style={styles.productDescription}>{item.description}</Textpopins>
                    <Textpopins style={styles.productPrice}>{item.price} ₼</Textpopins>
                </View>

            </TouchableOpacity>
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                </View>
                <View style={styles.content}>
                    <View style={styles.top}>
                        <ScrollView
                            style={styles.topLists}
                            alwaysBounceVertical={true}
                            horizontal={true}>
                            {this.renderHorizontalList()}
                        </ScrollView>
                    </View>
                    <View style={styles.footer}>
                        <ScrollView style={styles.productLists} vertical={true}>
                            <FlatList
                                data={this.state.datas}
                                numColumns={1}
                                renderItem={this.renderFlatList.bind(this)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

export default Campaigns;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flex: 0.5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignContent: "center"
    },
    content: {
        flex: 8,
        backgroundColor: '#ebecf0',
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
    },
    top: {
        flex: 0.4,
    },
    footer: {
        flex: 4.5,
        marginTop: 5,
        flexDirection: 'column',
    },
    topLists: {
        flexDirection: 'row',
        marginTop: 5,
    },
    topListsProduct: {
        backgroundColor: '#fff',
        borderRadius: Constants.statusBarHeight * 2,
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: Constants.statusBarHeight + 10,
        marginRight: Constants.statusBarHeight / 3,
        flexDirection: 'row',
    },
    productLists: {
        flexDirection: 'row',
        marginTop: 5,
    },
    product: {
        width: width,
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: Constants.statusBarHeight,
        flexDirection: "row"
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
    productPrice: {
        color: "#7c9d32",
        fontSize: 16
    },

});
