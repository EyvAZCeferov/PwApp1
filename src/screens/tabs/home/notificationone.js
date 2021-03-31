import React from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native'
import {Thumbnail, Left, Body, Header, Right} from 'native-base';
import {StatusBar} from "expo-status-bar";
import {AntDesign} from "@expo/vector-icons";
import firebase from "../../../functions/firebase/firebaseConfig";
import Textpopins from '../../../functions/screenfunctions/text'
const {width, height} = Dimensions.get("window")

export default class NotificationOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifyId: null,
            notify: null,
            refresh: true
        }
    }

    componentDidMount() {
        this.setState({refresh:true})
        const params = this.props.route.params;
        var notifyId = params.notifyid
        this.setState({notifyId, refresh: false})
    }

    getInfo() {
        firebase
            .database()
            .ref('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/notifications' + this.state.notifyId)
            .on('value', (data) => {
                var notiffy = data.toJSON()
                this.setState({notiffy})
                if (notiffy.read != 1) {
                    firebase
                        .database()
                        .ref('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/notifications/' + this.state.notifyId)
                        .set({
                            read: 1
                        })
                }
            });
    }

    renderContent() {
        if (this.state.refresh) {
            return (
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color="#7c9d32" focusable={true}/>
                </View>
            )
        } else {
            return (
                <View style={styles.center}>
                    <View style={[styles.body, styles.center]}>
                        <View style={styles.header}>
                            <Header transparent={true} translucent={true} hasSegment={true} hasTabs={false}
                                    hasSubtitle={false} androidStatusBarColor="transparent" noShadow={true} span={false}
                                    style={{width: width}}>
                                <StatusBar backgroundColor="#7c9d32" style="light"/>
                                <Left style={styles.center}>
                                    <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                                        <AntDesign name="left" size={24} color="#fff"/>
                                    </TouchableOpacity>
                                </Left>
                                <Body/>
                                <Right/>
                            </Header>
                            <View style={[styles.headerBottom, styles.center]}>
                                <View
                                    style={[styles.center, {flexDirection: "column", width: width / 1.4}]}>
                                    <Thumbnail
                                        source={{uri: "https://banker.az/wp-content/uploads/2018/02/Kapital_Bank_-e1518595902278.png"}}
                                        large circular resizeMode="cover"/>
                                    <Textpopins style={[styles.center, {marginTop: 20, fontWeight: "bold"}]}
                                            children="Title"
                                            textColor="#fff"/>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.content, styles.center, {padding: 1, paddingBottom: 0}]}>
                            <ScrollView scrollEventThrottle={30} showsVerticalScrollIndicator={false} collapsable={true}
                                        focusable={true} bounces={false} nestedScrollEnabled={true}>
                                <Textpopins
                                    style={{textAlign: "justify"}}
                                    children="ContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContentContent"/>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            )
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
        flex: 1,
        backgroundColor: "#fff",
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        textAlign: "center"
    },
    body: {
        width,
        height
    },
    header: {
        width,
        backgroundColor: "#7c9d32",
        height: '40%'
    },
    headerBottom: {
        width,
    },
    content: {
        width,
        backgroundColor: "#fff",
        height: '60%'
    },

})