import * as React from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import {
    Button,
    Form,
    Input,
    Thumbnail,
} from 'native-base';
import {t} from '../../../functions/lang';
import customStyle from '../../../../assets/Theme';

const {width, height} = Dimensions.get('window');
const icon = require('../../../../assets/icon-ios.png');
import {StatusBar} from "expo-status-bar";
import AsyncStorage from "@react-native-community/async-storage";
import Textpopins from '../../../functions/screenfunctions/text';
import Constants from 'expo-constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import DropdownAlert from "react-native-dropdownalert";
import auth from "../../../functions/actions/auth";
import {CommonActions} from "@react-navigation/native";

const succesImage = require('../../../../assets/images/Alert/tick.png');

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: null,
            password: null,
        };
    }

    login = async () => {
        await AsyncStorage.setItem('haveFinger', '');
        await AsyncStorage.setItem('localAuthPass', '');
        if (this.state.phone !== null && this.state.password !== null) {
            var cred = {"phone": this.state.phone, "password": this.state.password};
            auth.actions.signin(cred).then((e) => {
                console.log(e)
                console.log(AsyncStorage.getItem("token"))
                this.dropDownAlertRef.alertWithType('info', t('form.validation.loginregister.login.success'));
                this.navigationreset()
            }).catch(e => {
                alert(e);
            });
        }
    };

    navigationreset() {
        return this.props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    {name: "Home"},
                    {
                        name: "Home",
                    },
                ],
            })
        );
    }

    render() {
        return (
            <KeyboardAwareScrollView style={styles.container}>
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
                <View style={styles.content}>
                    <View style={[styles.header, customStyle.centerItems]}>
                        <StatusBar backgroundColor="#fff" style="dark"/>
                        <Thumbnail source={icon} style={{marginTop: Constants.statusBarHeight}}/>
                        <Textpopins style={styles.title}>
                            {t('loginregister.login.title')}
                        </Textpopins>
                    </View>
                    <View style={[styles.body, customStyle.centerItems]}>
                        <StatusBar backgroundColor="#fff" style="dark"/>
                        <View>
                            <Form style={styles.form}>

                                <View style={[customStyle.centerItems, styles.itemStyle]}>
                                    <Input
                                        style={styles.inputstyle}
                                        onChangeText={(text) =>
                                            this.setState({phone: text})
                                        }
                                        onSubmitEditing={() => Keyboard.dismiss}
                                        placeholder={t('form.labels.phonenumb')}
                                    />
                                </View>

                                <View style={[customStyle.centerItems, styles.itemStyle]}>

                                    <Input
                                        style={styles.inputstyle}
                                        placeholder={t('form.labels.password')}
                                        onChangeText={(text) =>
                                            this.setState({password: text})
                                        }
                                        onSubmitEditing={() => Keyboard.dismiss}
                                        secureTextEntry={true}
                                    />
                                </View>
                            </Form>
                        </View>

                        <View style={customStyle.pVer15}>
                            <View style={[{flexDirection: "row"}, customStyle.pHor15]}>
                                <TouchableOpacity
                                    style={customStyle.pHor15}
                                    onPress={() => this.props.navigation.navigate('ForgotPass')}>
                                    <Textpopins
                                        style={[styles.remember, styles.forgotPass]}
                                    >
                                        {t('loginregister.forgetpass.title')} ?
                                    </Textpopins>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View>
                            <Button
                                rounded
                                onPress={this.login}
                                full
                                success
                                style={styles.buttonstyle}
                                large>
                                <Textpopins style={[styles.buttonText, {color: '#fff'}]}>
                                    {t('form.buttons.login').toUpperCase()}
                                </Textpopins>
                            </Button>
                        </View>

                        <View>
                            <Button
                                rounded
                                onPress={() =>
                                    this.props.navigation.navigate('Register')
                                }
                                success
                                full
                                bordered
                                style={[styles.buttonstyle, {borderWidth: 0, borderColor: "#7c9d32"}]}
                            >
                                <Textpopins style={[styles.buttonText, {color: '#7c9d32'}]}>
                                    {t('form.buttons.register').toUpperCase()}
                                </Textpopins>
                            </Button>
                        </View>

                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderBottomColor: "#fff",
        borderBottomWidth: 0,
    },
    content: {
        flex: 1,
        justifyContent: "space-around",
    },
    title: {
        fontSize: 30,
        marginTop: 5,
        color: "#7c9d32",
        fontWeight: "bold"
    },
    header: {
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderBottomColor: "#fff",
        borderBottomWidth: 0,
        width,
        maxHeight: "40%",
        minHeight: "15%",
        marginTop: Constants.statusBarHeight,
    },
    body: {
        backgroundColor: "#fff",
        width,
        maxHeight: "100%",
        minHeight: "15%",
    },
    form: {
        padding: 0,
        margin: 0,
        width: width,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: Constants.statusBarHeight,

    },
    itemStyle: {
        width: width - 50,
        height: 60,
        marginVertical: 10,
    },
    inputstyle: {
        height: 50,
        width: "100%",
        lineHeight: 40,
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderWidth: 3,
        paddingLeft: 10,
        color: '#6d7587',
        fontWeight: 'bold',
        fontSize: 16,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12.35,
        elevation: 19,
    },
    remember: {
        color: '#33691E',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "right",
        width: width - 20,
    },
    buttonstyle: {
        marginVertical: 8,
        width: width-Constants.statusBarHeight,
        paddingHorizontal: Constants.statusBarHeight,
        paddingVertical: Constants.statusBarHeight
    },
});
