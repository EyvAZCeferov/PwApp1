import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';
import NumberButtons from './Components/NumberButtons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const succesImage = require('../../../../../../../assets/images/Alert/tick.png');

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import AsyncStorage from '@react-native-community/async-storage';
import DropdownAlert from "react-native-dropdownalert";
import SetPassHeader from "./Components/SetPass/SetPassHeader";
import {StatusBar} from "expo-status-bar";
import CodeFieldSetPass from "./Components/SetPass/CodeFieldSetPass";
import {t} from "../../../../../Lang";
import * as LocalAuthentication from "expo-local-authentication";
import {PasswordSetAndFingerSetContext} from "../../../../../Functions/Hooks/Authentication/FingerAndSetPass/PasswordSetAndFingerSetContext";

var reqems = '';
export default class SetPass extends React.Component {
    static contextType = PasswordSetAndFingerSetContext

    constructor(props) {
        super(props);
        this.state = {
            pass1: '',
            pass2: '',
            setFinger: false
        }
    }


    async getStat() {
        await AsyncStorage.getItem('haveFinger').then((a) => {
            if (a != null) {
                this.setState({setFinger: true})
            } else {
                this.hasHardware()
            }
        });
    }

    async hasHardware() {
        let permission = await LocalAuthentication.hasHardwareAsync()
        if (permission) {
            let type = await LocalAuthentication.supportedAuthenticationTypesAsync(1);
            let isFinger = type.includes(1)
            if (isFinger) {
                this.setState({setFinger: true})
            }
        }
    }

    async resetStat() {
        this.getStat()
    }

    funcStat() {
        setInterval(() => {
            this.completed()
        }, 0)
    }

    componentDidMount() {
        this.funcStat();
        this.resetStat()
    }

    async completed() {
        const params = this.props.route.params;
        if (this.state.pass1 !== '' && this.state.pass2 !== '') {
            if (this.state.pass1 === this.state.pass2) {
                await AsyncStorage.setItem('localAuthPass', this.state.pass1);
                if (this.state.setFinger) {
                    if (params) {
                        if (params.prevPage == 'Settings') {
                            this.props.navigation.navigate('Settings')
                        }
                    }
                    const {haveLocalAuth, sethaveLocalAuth} = this.context
                    sethaveLocalAuth(false)
                } else {
                    if (params) {
                        if (params.prevPage == 'Settings') {
                            this.props.navigation.navigate('Settings')
                        }
                    }
                    const {haveLocalAuth, sethaveLocalAuth} = this.context
                    sethaveLocalAuth(false)
                }
            }
        }
    }

    changeVal(val) {
        reqems = reqems + val;
        if (this.state.pass1.length <= 3) {
            this.setState({pass1: reqems})
            if (this.state.pass1.length === 3) {
                reqems = ''
            }
        } else if (this.state.pass1.length > 3) {
            this.setState({pass2: reqems})
            if (this.state.pass2.length === 3) {
                reqems = ''
            }
        }
    }

    clearVal() {
        reqems = ''
        this.setState({pass1: "", pass2: ""})
    }


    renderContent() {
        return (
            <View style={styles.container}>
                <DropdownAlert
                    ref={ref => this.dropDownAlertRef = ref}
                    useNativeDriver={true}
                    closeInterval={1000}
                    zIndex={5000}
                    updateStatusBar={true}
                    tapToCloseEnabled={true}
                    showCancel={true}
                    elevation={10}
                    isInteraction={true}
                    successImageSrc={succesImage}
                />
                <StatusBar backgroundColor="#fff" style="dark"/>
                <View style={styles.header}>
                    <DropdownAlert
                        ref={ref => this.dropDownAlertRef = ref}
                        useNativeDriver={true}
                        closeInterval={1000}
                        zIndex={5000}
                        updateStatusBar={true}
                        tapToCloseEnabled={true}
                        showCancel={true}
                        elevation={10}
                        isInteraction={true}
                        successImageSrc={succesImage}
                    />
                    <SetPassHeader/>
                </View>
                <View style={styles.codefieldArena}>
                    <CodeFieldSetPass value={this.state.pass1} {...this.props} />
                    <Text style={styles.passwordUnderTExt}>{t('newpassword')}</Text>
                    <CodeFieldSetPass value={this.state.pass2} {...this.props} />
                    <Text style={styles.passwordUnderTExt}>{t('repeatthenewpassword')}</Text>
                </View>
                <View style={styles.buttons}>
                    <NumberButtons
                        clearVal={() => this.clearVal()}
                        changeVal={(e) => this.changeVal(e)} {...this.props} />
                </View>
            </View>
        )
    }

    render() {
        return (
            <View>
                <DropdownAlert
                    ref={ref => this.dropDownAlertRef = ref}
                    useNativeDriver={true}
                    closeInterval={1000}
                    zIndex={5000}
                    updateStatusBar={true}
                    tapToCloseEnabled={true}
                    showCancel={true}
                    elevation={10}
                    isInteraction={true}
                    successImageSrc={succesImage}
                />
                <KeyboardAwareScrollView>
                    <DropdownAlert
                        ref={ref => this.dropDownAlertRef = ref}
                        useNativeDriver={true}
                        closeInterval={1000}
                        zIndex={5000}
                        updateStatusBar={true}
                        tapToCloseEnabled={true}
                        showCancel={true}
                        elevation={10}
                        isInteraction={true}
                        successImageSrc={succesImage}
                    />
                    {this.renderContent()}
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: "#fff",
        justifyContent: "space-around"
    },
    header: {
        height: 80,
        backgroundColor: "#fff",
        width: width,
    },
    codefieldArena: {
        height: 180,
        width: width,
        backgroundColor: "#fff",
    },
    buttons: {
        height: 290,
        width: width,
        backgroundColor: "#fff",
    },
    passwordUnderTExt: {
        color: 'rgba(0,0,0,.4)',
        fontSize: 13,
        marginTop: '-3%',
        paddingLeft: '9%',
        fontWeight: '500',
    },
});
