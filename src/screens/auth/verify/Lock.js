import * as React from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    SafeAreaView,
} from 'react-native';
import {Button} from 'native-base';

import * as Animatable from 'react-native-animatable';
import Constants from 'expo-constants';

const {width, height} = Dimensions.get('screen');
import {StatusBar} from 'expo-status-bar';
import {t} from '../../../functions/lang';

var reqems = '';

const icon = require('../../../../assets/icon-ios.png');
import AsyncStorage from "@react-native-community/async-storage";
import Textpopins from '../../../functions/screenfunctions/text';
import DropdownAlert from "react-native-dropdownalert";
import {Entypo, FontAwesome5} from "@expo/vector-icons";
import {ProgramLockContext} from "../../../functions/Hooks/Authentication/Lock/ProgramLockContext";
import * as LocalAuthentication from "expo-local-authentication";
import {setting} from "../../../functions/standart/helper";
import NumberButtons from "./Components/NumberButtons";
import Codefield from "./Components/ProgramLock/CodeField";

const succesImage = require('../../../../assets/images/Alert/tick.png');

export default class Lock extends React.Component {
    static contextType = ProgramLockContext

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            hasFingerPrintHardware: false,
            pass: '',
            refresh: true
        }
    }


    async getSoragePerm() {
        await AsyncStorage.getItem('haveFinger').then((a) => {
            if (a != null) {
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
                this.callFinger();
                this.setState({
                    hasFingerPrintHardware: isFinger
                });
            }
        }
    }

    componentDidMount() {
        this.getSoragePerm();
    }

    async getInfo() {
        var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5Mjc4MDk5NC05MWYyLTQ2MGMtYmMzYy0wNmQ0YTM0MGI2YmUiLCJqdGkiOiIwYjUwMGE1N2I1OTU2ZWMwMGFiM2JjNWZiZDUzZTU4ZWEzZWY2ZTg0OGNjNTYwZGNlMzg3Y2Y0YWFlMWFmYTRmMmExN2JiNmNlNGE3NTI0MCIsImlhdCI6MTYxMDQ0OTc4OCwibmJmIjoxNjEwNDQ5Nzg4LCJleHAiOjE2NDE5ODU3ODcsInN1YiI6IjkiLCJzY29wZXMiOltdfQ.OD2qxyEMhEiMTms9oSbfMyTIr_4zs9YUkfbstdXkaw74MfHeF_AsKbU0O0BfvHuhZX71JgotdUCBfvyqHu0wQlxXpH5T5QiGSjdBJOJt4_hdg7l1MWHx9IDzvpQpd_ScHN34TD1xxikVQcIlNg54Cc_uA25dCfCtxRKPPy7NLF3tZxJbWJWA2a1rfZDlzPXlYggAqapMsAW95k2ZbluhEk3fAlZ-s9Rf-7ZhWqMaAIPZ3_AxBooQMiKwG8T1TqN0zzy0PmpdlypPMHgb9xWnN_gQhmDQPkUDPaWaPv0L-HS8lyNfVup8sKHVE4TTKhTfBmokRh55EuSyk590A4-KyfgAYnD3J5SItvbbvDc3nN4QZmtI7S2PIOknqYnCiaAd3JYNrRtCbBhKgunf3IhoEYCqpUoAYA-_0oiUYxkS6qiTCje1_EoLoEqgl-lT3m2ub2ZXd6OsviixlMotyoHNtwEJnIePPMYnqotUQIt73EcQ7nXethcalN-qyKaGWt5AdFnYJ_SkZAl_tYLhvZDGeO8imL_tknt22rNiwlDwyN6S-xZz1ooMdu4Nl8DiJLqaN7gaB61WOhSfz25FbM8cXy_QXCzoJ5l97hEZmTSVoN3rI-scEtFbK41_i7a0JseYZTM2TBH8q09CW3BFWw01TKsr89UEPHgqydyKMiGdgEY";
        var settingres = setting(token, 'adminURL');
        fetch(settingres + '/api/userdata/user', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
                'Content-Type': 'multipart/form-data',
            }
        }).then((response) => response.json())
            .then((json) => this.setState({userData: json.data}))
            .catch((error) => console.error(error))
            .finally(() => this.setState({refresh: false}));
    }

    completed() {
        const {program, setProgram} = this.context
        this.dropDownAlertRef.alertWithType('success', t('form.validation.loginregister.login.success'));
        setProgram(true)
    }

    async callFinger() {
        let enroll = await LocalAuthentication.isEnrolledAsync();
        if (enroll) {
            let authenticate = await LocalAuthentication.authenticateAsync({
                promptMessage: t('loginregister.programlock.useFingerPrint'),
                cancelLabel: t('actions.cancel'),
                fallbackLabel: t('form.labels.password'),
                disableDeviceFallback: true
            });
            if (authenticate != null) {
                if (authenticate.success) {
                    this.dropDownAlertRef.alertWithType('success', t('form.validation.loginregister.login.success'));
                    this.completed()
                }
            }
        }
    }

    fingerPrint() {
        this.callFinger()
    }

    changeVal(val) {
        reqems = reqems + val;
        if (reqems.length > 4) {
            //
        } else {
            this.setState({pass: reqems})
        }
    }

    clearVal() {
        reqems = ''
        this.setState({pass: ''})
    }

    renderContent() {
        return (
            <View style={{
                flex: 1,
                justifyContent: "space-between",
                marginBottom: Constants.statusBarHeight * 2
            }}>
                <Codefield completed={() => this.completed()} value={this.state.pass} {...this.props} />
                <NumberButtons
                    clearVal={() => this.clearVal()}
                    changeVal={(e) => this.changeVal(e)}
                    {...this.props} />
            </View>
        )
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <DropdownAlert
                    ref={ref => this.dropDownAlertRef = ref}
                    useNativeDriver={true}
                    closeInterval={1000}
                    updateStatusBar={true}
                    tapToCloseEnabled={true}
                    showCancel={true}
                    elevation={5}
                    isInteraction={false}
                    successImageSrc={succesImage}
                />
                <StatusBar backgroundColor="#D1D1D1" style="light"/>
                <View style={styles.header}>
                    <Animatable.Image
                        animation="fadeIn"
                        duration={1000}
                        source={icon}
                        useNativeDriver={true}
                        resizeMode="stretch"
                        style={styles.logo}
                    />
                    <Animatable.Text
                        animation="fadeIn"
                        duration={1000}
                        delay={500}
                        useNativeDriver={true}
                        style={{
                            textAlign: "center",
                            color: "#5C0082",
                            fontSize: 20,
                            marginTop: -Constants.statusBarHeight * 2
                        }}>
                        {this.state.userData ? this.state.userData.name : t('loginregister.programlock.namesurname')}
                    </Animatable.Text>
                </View>
                <View style={styles.content}>
                    {this.renderContent()}
                </View>
                <View style={[styles.footer, styles.center]}>
                    {this.state.hasFingerPrintHardware ? (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around"
                            }}
                        >
                            <Button transparent style={[styles.footerButton, {marginRight: 5}]}
                                    onPress={() => this.props.navigation.navigate('ForgotPass')}>
                                <Entypo name="lock" size={24} color="#5C0082"/>
                                <Textpopins
                                    style={{color: "#5C0082", fontSize: 15, marginTop: 25}}>
                                    {t('loginregister.forgetpass.title')}
                                </Textpopins>
                            </Button>
                            <Button style={[styles.footerButton, {marginLeft: 5}]}
                                    onPress={() => this.callFinger()}
                                    transparent>
                                <FontAwesome5 name="fingerprint" size={24} color="#5C0082"/>
                                <Textpopins style={{
                                    color: "#5C0082",
                                    fontSize: 15,
                                    marginTop: 25
                                }}>{t('loginregister.programlock.useFingerPrint')}</Textpopins>
                            </Button>
                        </View>
                    ) : (
                        <Button
                            transparent full style={[styles.footerButton, styles.center]}
                            onPress={() => this.props.navigation.navigate('ForgotPass')}>
                            <Entypo name="lock" size={24} color="#5C0082"/>
                            <Textpopins style={{color: "#5C0082", fontSize: 15, marginTop: 5}}>
                                {t('loginregister.forgetpass.title')}
                            </Textpopins>
                        </Button>
                    )}
                </View>
            </SafeAreaView>
        )
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D1D1D1',
    },
    header: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 0.7,
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
        borderBottomLeftRadius: Constants.statusBarHeight * 1.2,
        borderBottomRightRadius: Constants.statusBarHeight * 1.2,
        backgroundColor: '#fff',
    },
    footer: {
        flex: 0.1,
        backgroundColor: '#D1D1D1',
    },
    center: {
        textAlign: "center",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    logo: {
        width: "45%",
        height: "100%",
        backgroundColor: "transparent"
    },
    footerButton: {
        flexDirection: "column",
        justifyContent: "space-around",
        zIndex: 9999
    },
});

