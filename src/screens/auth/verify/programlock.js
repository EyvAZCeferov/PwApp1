import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import NumberButtons from './Components/NumberButtons';
import ProgramLockHeader from './Components/ProgramLock/ProgramLockHeader';
import FooterBar from './Components/ProgramLock/FooterBar';
import CodeFieldInput from './Components/ProgramLock/CodeField';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import * as LocalAuthentication from 'expo-local-authentication';

const succesImage = require('../../../../assets/images/Alert/tick.png');
import {StatusBar} from 'expo-status-bar';

const {width,height} = Dimensions.get('window');
import {t} from "../../../functions/lang";
import AsyncStorage from '@react-native-community/async-storage';
import DropdownAlert from "react-native-dropdownalert";
// import {ProgramLockContext} from "../../../../../Functions/Hooks/Authentication/Lock/ProgramLockContext";
import {setting} from '../../../functions/standart/helper';


var reqems = '';
export default class ProgramLock extends React.Component {
    // static contextType = ProgramLockContext

    constructor(props) {
        super(props);
        this.state = {
            userData:null,
            hasFingerPrintHardware: false,
            pass: '',
            refresh:true
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
        var token="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5Mjc4MDk5NC05MWYyLTQ2MGMtYmMzYy0wNmQ0YTM0MGI2YmUiLCJqdGkiOiIwYjUwMGE1N2I1OTU2ZWMwMGFiM2JjNWZiZDUzZTU4ZWEzZWY2ZTg0OGNjNTYwZGNlMzg3Y2Y0YWFlMWFmYTRmMmExN2JiNmNlNGE3NTI0MCIsImlhdCI6MTYxMDQ0OTc4OCwibmJmIjoxNjEwNDQ5Nzg4LCJleHAiOjE2NDE5ODU3ODcsInN1YiI6IjkiLCJzY29wZXMiOltdfQ.OD2qxyEMhEiMTms9oSbfMyTIr_4zs9YUkfbstdXkaw74MfHeF_AsKbU0O0BfvHuhZX71JgotdUCBfvyqHu0wQlxXpH5T5QiGSjdBJOJt4_hdg7l1MWHx9IDzvpQpd_ScHN34TD1xxikVQcIlNg54Cc_uA25dCfCtxRKPPy7NLF3tZxJbWJWA2a1rfZDlzPXlYggAqapMsAW95k2ZbluhEk3fAlZ-s9Rf-7ZhWqMaAIPZ3_AxBooQMiKwG8T1TqN0zzy0PmpdlypPMHgb9xWnN_gQhmDQPkUDPaWaPv0L-HS8lyNfVup8sKHVE4TTKhTfBmokRh55EuSyk590A4-KyfgAYnD3J5SItvbbvDc3nN4QZmtI7S2PIOknqYnCiaAd3JYNrRtCbBhKgunf3IhoEYCqpUoAYA-_0oiUYxkS6qiTCje1_EoLoEqgl-lT3m2ub2ZXd6OsviixlMotyoHNtwEJnIePPMYnqotUQIt73EcQ7nXethcalN-qyKaGWt5AdFnYJ_SkZAl_tYLhvZDGeO8imL_tknt22rNiwlDwyN6S-xZz1ooMdu4Nl8DiJLqaN7gaB61WOhSfz25FbM8cXy_QXCzoJ5l97hEZmTSVoN3rI-scEtFbK41_i7a0JseYZTM2TBH8q09CW3BFWw01TKsr89UEPHgqydyKMiGdgEY";
        var settingres=setting(token,'adminURL');
        fetch(settingres+'/api/userdata/user', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer '+token,
                'Content-Type' :'multipart/form-data',
            }
            }).then((response) => response.json())
            .then((json) => this.setState({userData:json.data}))
            .catch((error) => console.error(error))
            .finally(() => this.setState({refresh:false}));
    }

    completed() {
        const {notOpen, setNotOpen} = this.context
        this.dropDownAlertRef.alertWithType('success', t('form.validation.loginregister.login.success'));
        setNotOpen(false)
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
            <View>
                <View style={styles.header}>
                    <ProgramLockHeader
                        {...this.props}
                        userData={this.state.userData}
                    />
                </View>
                <View style={styles.codefieldArena}>
                    <CodeFieldInput
                        completed={() => this.completed()}
                        value={this.state.pass} {...this.props} 
                      />
                </View>
                <View style={styles.buttons}>
                    <NumberButtons
                        clearVal={() => this.clearVal()}
                        changeVal={(e) => this.changeVal(e)} {...this.props} />
                </View>
                <View style={styles.footer}>
                    <FooterBar 
                        permission={this.state.hasFingerPrintHardware}
                        callFingerPrint={() => this.fingerPrint()} 
                        {...this.props} />
                </View>
            </View>
        )
    }

    render() {
        return (
            <KeyboardAwareScrollView style={{ flex:1 }}>
                <View style={styles.container}>
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
                    <StatusBar  backgroundColor="#7c9d32" style="light" />
                    {this.renderContent()}
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:width,
        height:height,
        backgroundColor: "#fff",
        zIndex:99999,
    },
    header: {
        backgroundColor: "#fff",
        width: width,
        maxHeight:'22%',
        minHeight:'10%',
    },
    codefieldArena: {
        maxHeight:'19%',
        minHeight:'14%',
        width: width,
        backgroundColor: "#fff",
    },
    buttons: {
        maxHeight:'54%',
        minHeight:'10%',
        width: width,
    },
    footer: {
        maxHeight:'8%',
        minHeight:'4%',
        width: width,
    },
});
