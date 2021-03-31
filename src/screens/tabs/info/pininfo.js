import React from 'react';
import {View,  StyleSheet, Dimensions, FlatList, TouchableOpacity, ActivityIndicator,Text} from 'react-native';
import {StatusBar} from 'expo-status-bar'
import {Thumbnail, List, ListItem} from 'native-base'
import {t} from "../../../functions/lang";
import {AntDesign} from "@expo/vector-icons";
import firebase from "../../../functions/firebase/firebaseConfig";
import Textpopins from '../../../functions/screenfunctions/text'
const {width, height} = Dimensions.get("window")

const pinIcon = require("../../../../assets/images/Pin/pin.png")

export default class Pininfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            pinData: null,
            userData: null,
            checks: null
        }
    }

    renderFlatListDatas({item, index}) {
        var that = this

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
            <ListItem onPress={() =>
                that.props.navigation.navigate("OtherPages", {
                    screen: 'OneCheck',
                    params: {
                        checkid: item.checkId,
                    }
                })
            }
                      key={index} style={{flexDirection: "row", justifyContent: "space-between", padding: 10}}>
                <View>
                    <AntDesign name="shoppingcart" color="#7c9d32" size={24}/>
                </View>
                <View>
                    <Textpopins children={convertStampDate(item.date)} style={{textAlign: "left"}}/>
                </View>
                <View>
                    <Textpopins textColor="#7c9d32" style={{fontWeight: "bold"}} children={"+ " + item.price/10}/>
                </View>
            </ListItem>
        )
    }

    onHandleRefresh() {
        var that = this
        that.setState({refresh: true})
    }

    renderFlatList() {
        if (this.state.checks != null) {
            return (
                <List>
                    <FlatList
                        data={this.state.checks}
                        renderItem={this.renderFlatListDatas.bind(this)}
                        refreshing={this.state.refresh}
                        onRefresh={this.onHandleRefresh.bind(this)}/>
                </List>
            )
        } else {
            return (
                <View style={styles.alignCenter}>
                    <Textpopins style={styles.nullObject} children={t('actions.noResult')}/>
                </View>
            )
        }
    }

    renderImage(usDatas) {
        if (this.state.refresh) {
            return (
                <View style={{width: "100%", height: "100%"}}>
                    <ActivityIndicator size="large" color="#fff"/>
                </View>
            )
        } else {
            return (
                <Thumbnail
                    source={usDatas.profPic ? {uri: usDatas.profPic} : pinIcon}
                    large circular/>
            )
        }

    }

    renderContent() {
        if (this.state.refresh) {
            return (
                <View style={[styles.container, styles.alignCenter]}>
                    <ActivityIndicator size="large" color="#7c9d32"/>
                </View>
            )
        } else {
            const usDatas=null;
            if (usDatas != null) {
                return (
                    <View style={styles.container}>
                        <StatusBar backgroundColor="#7c9d32" style="light"/>
                        <View style={styles.header}>
                            <View style={[styles.alignCenter, {height: "100%", paddingTop: 20}]}>
                                <View style={{flexDirection: "row", justifyContent: "space-between", width: width}}>
                                    <TouchableOpacity style={{paddingLeft: width / 23}}
                                                      onPress={() => this.props.navigation.goBack()}>
                                        <AntDesign name="left" size={25} color="#fff"/>
                                    </TouchableOpacity>
                                    {this.renderImage(usDatas)}
                                    <View style={{width: width / 9}}/>
                                </View>
                                <Textpopins children={usDatas.email}
                                        style={{fontWeight: "bold", marginVertical: 15}}
                                        textColor={'#fff'}/>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    width: "100%",
                                }}>
                                    <Textpopins textColor={'#fff'} style={{fontWeight: "bold"}}
                                            children={"Pin saylarınız"}/>
                                    <Textpopins textColor={'#fff'} style={{fontSize: 22}}
                                            children={pinInfo.cardInfo.price}/>
                                </View>
                            </View>
                        </View>
                        <View style={styles.content}>
                            {this.renderFlatList()}
                        </View>
                    </View>
                )
            }else{
                return (
                    <View style={styles.container}>
                        <StatusBar backgroundColor="#7c9d32" style="light"/>
                        <View style={styles.header}>
                            <View style={[styles.alignCenter, {height: "100%", paddingTop: 20}]}>
                                <View style={{flexDirection: "row", justifyContent: "space-between", width: width}}>
                                    <TouchableOpacity style={{paddingLeft: width / 23}}
                                                      onPress={() => this.props.navigation.goBack()}>
                                        <AntDesign name="left" size={25} color="#fff"/>
                                    </TouchableOpacity>
                                    {this.renderImage(pinIcon)}
                                    <View style={{width: width / 9}}/>
                                </View>
                                <Textpopins children={"Name"}
                                        style={{fontWeight: "bold", marginVertical: 15,textAlign:"center",color:"#fff"}}
                                        textColor={'#fff'}/>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    width: "100%",
                                    textAlign:"center",
                                }}>
                                    <Text textColor={'#fff'} style={{fontWeight: "bold",fontSize:20,color:"#fff"}}
                                            children={"Pin saylarınız"}/>
                                    <Text textColor={'#fff'} style={{fontWeight:"bold",fontSize:20,color:"#fff"}}
                                            children={"200"}/>
                                </View>
                            </View>
                        </View>
                        <View style={styles.content}>
                            {this.renderFlatList()}
                        </View>
                    </View>
                )
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#7c9d32" style="light"/>
                {this.renderContent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: width,
        height: (height / 2) - 80,
        textAlign:"center",
        backgroundColor: "#7c9d32",
    },
    alignCenter: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        alignContent: "center",
        height: "100%"
    },
    nullObject: {
        color: '#D50000',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign:"center",
    },
    content: {
        width: width,
        height: (height / 2) + 80
    }
})
