import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import NumberButtons from './Components/NumberButtons';
import MobileVerifyHeader from './Components/MobileVerify/MobileVerifyHeader';
import CodeFieldInput from './Components/ProgramLock/CodeField';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import * as LocalAuthentication from 'expo-local-authentication';

const succesImage = require('../../../../assets/images/Alert/tick.png');
import {StatusBar} from 'expo-status-bar';

const {width, height} = Dimensions.get('window');
import {t} from "../../../functions/lang";
import AsyncStorage from '@react-native-community/async-storage';
import DropdownAlert from "react-native-dropdownalert";
import axios from "axios";

var reqems = '';
export default class MobileVerify extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            pass: '',
            refresh: true
        }
    }

    completed() {
        const {notOpen, setNotOpen} = this.context
        var cred = {
            phone: this.props.route.params.phone,
            password: this.props.route.params.password,
            code: this.state.pass,
        }
        axios.post("auth/verify", cred).then((e) => {
            this.dropDownAlertRef.alertWithType('success', t('form.validation.loginregister.login.success'));
            AsyncStorage.setItem("token", e.data.access_token);
            this.props.navigation.navigate("SetPass");
        }).catch(e => {
            this.dropDownAlertRef.alertWithType('success', t('form.validation.forgetpass.error'));
            setNotOpen(true)
        })

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
                    <MobileVerifyHeader
                        {...this.props}
                    />
                </View>
                <View style={styles.codefieldArena}>
                    <CodeFieldInput
                        completed={() => this.completed()} value={this.state.pass} {...this.props}
                    />
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
            <KeyboardAwareScrollView style={{flex: 1}}>
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
                    <StatusBar backgroundColor="#5C0082" style="light"/>
                    {this.renderContent()}
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: "#fff",
        zIndex: 99999,
    },
    header: {
        backgroundColor: "#fff",
        width: width,
        maxHeight: '22%',
        minHeight: '10%',
    },
    codefieldArena: {
        maxHeight: '20%',
        minHeight: '15%',
        width: width,
        backgroundColor: "#fff",
    },
    buttons: {
        maxHeight: '80%',
        minHeight: '10%',
        width: width,
    },
});
