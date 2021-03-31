import React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {StatusBar} from "expo-status-bar";
import {AntDesign, Entypo} from '@expo/vector-icons'
import {t} from "../../../functions/lang";
import AsyncStorage from '@react-native-community/async-storage';
import * as LocalAuthentication from "expo-local-authentication";
import {PasswordSetAndFingerSetContext} from "../../../functions/Hooks/Authentication/FingerAndSetPass/PasswordSetAndFingerSetContext";

const {width, height} = Dimensions.get("window");
import {Restart} from 'fiction-expo-restart';


export default class SetFinger extends React.Component {
    static contextType = PasswordSetAndFingerSetContext

    constructor(props) {
        super(props);
        this.state = {
            setFinger: false,
            prevPage:null,
        }
    }

    componentDidMount() {
        this.getStat();
    }

    async getStat() {
        this.setState({prevPage:this.props.route.params.prevPage})
        await AsyncStorage.removeItem('haveFinger');
        await AsyncStorage.getItem('haveFinger').then((a) => {
            if (a != null && a !==null) {
                this.setState({setFinger: true})
            } else {
                this.hasHardware()
            }
        });

    }

    async hasHardware() {
        let permission = await LocalAuthentication.hasHardwareAsync()
        if (permission) {
            let type = await LocalAuthentication.supportedAuthenticationTypesAsync();
            let isFinger = type.includes(1)
            if (isFinger) {
                let enroll = await LocalAuthentication.isEnrolledAsync();
                if (enroll) {
                    let authenticate = await LocalAuthentication.authenticateAsync({
                        disableDeviceFallback: true,
                        promptMessage: t('loginregister.programlock.useFingerPrint'),
                        cancelLabel: t('actions.cancel'),
                        fallbackLabel: t('form.labels.password'),
                    });
                    if (authenticate !== null) {
                        if (authenticate.success) {
                            await AsyncStorage.setItem('haveFinger', 'Haved');
                            if(this.state.prevPage=="Settings" || this.state.prevPage==="Settings"){
                                this.props.navigation.pop();
                                Restart();
                            }else{
                                const {haveLocalAuth, sethaveLocalAuth} = this.context
                                sethaveLocalAuth(false)
                                this.setState({setFinger: true})
                            }
                        }
                    }
                }
            }
        }
    }

    async onCancel() {
        await AsyncStorage.setItem('haveFinger', null)
        const {haveLocalAuth, sethaveLocalAuth} = this.context
        sethaveLocalAuth(false)
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#7c9d32" style="light"/>
                <View style={styles.panel}>
                    <View style={styles.topPanel}>
                        <TouchableOpacity onPress={() => this.onCancel()} style={styles.cancelButton}>
                            <AntDesign name="close" color="#fff" size={30}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.panel, {height: height / 4}]}>
                {this.state.setFinger ?
                    (
                        <TouchableOpacity onPress={() => this.hasHardware()}>
                            <AntDesign name='checkcircle' color="#fff" size={100}/>
                        </TouchableOpacity>
                    )
                :
                    (
                        <TouchableOpacity onPress={() => this.hasHardware()}>
                            <Entypo name='fingerprint' color="#fff" size={100}/>
                        </TouchableOpacity>
                    )
                }
                </View>
                <View style={styles.panel}>
                    <Text
                        style={styles.desc}>{t('loginregister.programlock.useFingerPrint')}</Text>
                </View>
                <View style={styles.panel}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: "#7c9d32",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        alignContent: "center",
        textAlign: "center",
    },
    panel: {
        width: width,
        height: height / 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        textAlign: "center",
        backgroundColor: "transparent",
    },
    topPanel: {
        flexDirection: "row",
        backgroundColor: "transparent",
        alignItems: "flex-end",
        marginLeft: "auto",
    },
    cancelButton: {
        padding: 10,
        marginRight: 10,
        backgroundColor: "red",
    },
    desc: {
        fontSize: 14,
        color: "rgba(255,255,255,.8)",
        textTransform: "capitalize",
        textAlign: "center",
        paddingHorizontal: 60
    }
})