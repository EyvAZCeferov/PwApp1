import React from 'react';
import {View, Text, Dimensions, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native'
import {Body, Button, Left, ListItem, Right} from "native-base";
import {t} from "../../../../../functions/lang";
import firebase from '../../../../../functions/firebase/firebaseConfig';
import Textpopins from '../../../../../functions/screenfunctions/text';
import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons";

const {width, height} = Dimensions.get('window');
export default function RecentOperations() {
    const nav = useNavigation();

    const [list, setList] = React.useState(null)

    const [refresh, setRefresh] = React.useState(true);

    React.useEffect(() => {
        getInfo()
    }, [])

    function getInfo() {
        var datas = [];
        var numchild = 0;
        firebase
            .database()
            .ref('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/shoppings/')
            .on('value', (data) => {
                data.forEach((element) => {
                    datas.push(element.val())
                    numchild = data.numChildren()
                })
            });
        if (numchild > 0) {
            setList(datas)
        } else {
            setList(null)
        }
        setRefresh(false)
        renderContent()
       
    }

    function renderItem({item, index}) {
        function marketTypeFunc() {
            switch (item.market) {
                case "Bazar Store":
                    return <FontAwesome name="cc-visa" size={30} color="#7c9d32"/>
                    break;
                case "Araz":
                    return <FontAwesome name="cc-mastercard" size={30} color="#7c9d32"/>
                    break;
                default:
                    return <FontAwesome name="credit-card" size={30} color="#7c9d32"/>
            }
        }

        let allPrice = 0

        function priceCollector(id) {
            var user = firebase.auth().currentUser;
            if (user) {
                var datas = [];
                firebase
                    .database()
                    .ref('users/' + user.uid + '/checks/' + id + '/products')
                    .on('value', (data) => {
                        if (data.numChildren() > 0 && data != null) {
                            data.forEach((data) => {
                                datas.push(data.val());
                            });
                        }
                    });
                return datas
            }
        }

        function sumPrice(checkId) {
            if (checkId != null) {
                allPrice = 0
                var checkProducts = priceCollector(checkId)
                checkProducts.map(element => {
                    allPrice = allPrice + parseFloat(element.price)
                })
            }
            return parseFloat(allPrice)
        }

        function convertStampDate(unixtimestamp) {

            var months_arr = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

            var date = new Date(unixtimestamp * 1);

            var year = date.getFullYear();

            var month = months_arr[date.getMonth()];

            var day = date.getDate();

            var hours = date.getHours();

            var minutes = "0" + date.getMinutes();

            var seconds = "0" + date.getSeconds();

            var fulldate = day + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes.substr(-2);

            return fulldate;
        }

        return (
            <ListItem
                thumbnail
                onPress={() =>
                    nav.navigate("OtherPages", {
                        screen: 'OneCheck',
                        params: {
                            checkid: item.id,
                        }
                    })
                }
                key={index}
            >
                <Left>
                    <AntDesign name="shoppingcart" color="#7c9d32" size={24}/>
                </Left>
                <Body>
                    <MyText style={{fontSize: 22, color: "rgba(0,0,0,.8)", textAlign: "left"}} children={item.market}/>
                    <MyText style={{fontSize: 14, color: "rgba(0,0,0,.6)", textAlign: "left"}}
                            children={convertStampDate(item.date)}/>
                </Body>
                <Right>
                    <Button transparent>
                        <MyText children={sumPrice(item.id) + ' AZN'}/>
                    </Button>
                </Right>
            </ListItem>
        );
    }

    function onHandleRefresh() {
        setRefresh(true)
        getInfo()
    }

    function renderContent() {
        if (refresh) {
            return (
                <View style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                }}>
                    <ActivityIndicator color="#7c9d32" animating={true} size="large"/>
                </View>
            )
        } else {
            if (list != null) {
                return (
                    <FlatList
                        data={list}
                        keyExtractor={(index, item) => index.toString()}
                        renderItem={renderItem}
                        refreshing={refresh}
                        onRefresh={onHandleRefresh}
                    />
                )
            } else if (list == null) {
                return (
                    <View style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#fff",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center"
                    }}><Textpopins style={styles.noResult} children={t('actions.noResult')}/>
                        <TouchableOpacity
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: "#7c9d32",
                                borderRadius: 20,
                                marginTop: 20,
                                alignItems: "center",
                                alignContent: "center",
                                justifyContent: "center",
                                textAlign: "center"
                            }}
                            onPress={() => onHandleRefresh()}>
                            <Ionicons name="md-refresh" color="#fff" size={20}/>
                        </TouchableOpacity>
                    </View>
                )
            }
        }
    }

    return (
        <View style={{flex: 1}}>
            <View sttyle={styles.panelHandle}>
                <View style={{
                    maxHeight: 60,
                    minHeight: 45,
                    width: width,
                }}>
                    <View style={{
                        marginHorizontal: 20,
                        justifyContent: "space-between",
                        flexDirection: "row",
                    }}>
                        <Textpopins style={{color: "#7c9d32", marginVertical: 10}} children={t('recentoperations')}/>
                        <Textpopins style={{color: "#7c9d32", marginVertical: 10}} children={t('yesterday')}/>
                    </View>
                </View>
                <View style={{height: height / 2.25, width: width, marginBottom: 20}}>
                    {renderContent()}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    f1: {
        flex: 1,
        width: width,
        height: 300,
    },
    scrollrecent: {
        flex: 1,
        width: width,
    },
    seperatorText: {
        fontSize: 15,
        color: '#7c9d32',
        paddingTop: 1,
        flex: 1,
        width: width,
    },
    listHeaderText: {
        color: '#7c9d32',
        paddingVertical: 3,
        fontSize: 14,
    },
    notFound: {
        color: '#BF360C',
        fontSize: 19,
        textAlign: 'center',
    },
    panelHandle: {
        height: 300,
        width: width,
        backgroundColor: "#666",
        borderRadius: 6,
        alignSelf: "center",
    },
    noResult: {
        color: '#D50000',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
    }
})

