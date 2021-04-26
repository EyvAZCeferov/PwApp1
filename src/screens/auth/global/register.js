import * as React from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Keyboard,
    TouchableOpacity,
    SafeAreaView,
    Text,
} from 'react-native';
import {Form, Input, Item} from 'native-base';

import * as Animatable from 'react-native-animatable';
import Constants from 'expo-constants';

const {width, height} = Dimensions.get('screen');
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';
import {t} from '../../../functions/lang';

const icon = require('../../../../assets/icon-ios.png');
import AsyncStorage from "@react-native-community/async-storage";
import Textpopins from '../../../functions/screenfunctions/text';
import DropdownAlert from "react-native-dropdownalert";
import auth from "../../../functions/actions/auth";
import {CommonActions} from "@react-navigation/native";
import {AntDesign, Feather, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {LiteCreditCardInput} from "react-native-credit-card-input";

const succesImage = require('../../../../assets/images/Alert/tick.png');

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: null,
            password: null,
        };
    }

    register = async () => {
        await AsyncStorage.setItem('haveFinger', '');
        await AsyncStorage.setItem('localAuthPass', '');
        if (this.state.phone !== null && this.state.password !== null) {
            var cred = {"phone": this.state.phone, "password": this.state.password};
            auth.actions.register(cred).then((e) => {
                this.dropDownAlertRef.alertWithType('info', t('form.validation.loginregister.login.success'));
                this.navigationreset()
            }).catch(e => {
                this.dropDownAlertRef.alertWithType('error', e);
            });
        } else {
            this.dropDownAlertRef.alertWithType('error', t('actions.noResult'));
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
                <StatusBar backgroundColor="#7c9d32" style="light"/>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.pop()}>
                        <Ionicons name="arrow-back" size={24} color="#fff"/>
                    </TouchableOpacity>
                    <Animatable.Image
                        animation="fadeIn"
                        duration={1000}
                        source={icon}
                        useNativeDriver={true}
                        resizeMode="stretch"
                        style={styles.logo}
                    />
                    <View/>
                </View>

                <Animatable.View
                    style={styles.content}
                    useNativeDriver={true}
                    animation="slideInUp"
                    duration={1000}>
                    <Textpopins
                        style={[styles.title, {marginVertical: Constants.statusBarHeight}]}>{t('form.buttons.register')}</Textpopins>
                    <Form>
                        <Item style={styles.item} success>
                            <Feather name="phone" size={24} color="black" style={{paddingRight: 5}}/>
                            <Input
                                onChangeText={(text) =>
                                    this.setState({phone: text})
                                }
                                style={styles.input}
                                onSubmitEditing={() => Keyboard.dismiss}
                                placeholder={t('form.labels.phonenumb')}/>
                        </Item>

                        <Item style={styles.item} success>
                            <AntDesign name="creditcard" size={24} color="black"
                                       style={{paddingRight: 5, marginLeft: 25}}/>
                            <LiteCreditCardInput
                                keyboardShouldPersistTaps="handled"
                                keyboardType="number-pad"
                                onChange={this._onChange}
                                style={styles.input}
                            />
                        </Item>

                        <Item style={styles.item} success>
                            <MaterialCommunityIcons style={{paddingRight: 5}} name="form-textbox-password" size={24}
                                                    color="black"/>
                            <Input
                                placeholder={t('form.labels.password')}
                                onChangeText={(text) =>
                                    this.setState({password: text})
                                }
                                style={styles.input}
                                onSubmitEditing={() => Keyboard.dismiss}
                                secureTextEntry={true}/>
                        </Item>

                        <Item
                            style={[
                                styles.item,
                                {
                                    alignContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                },
                            ]}>
                            <TouchableOpacity
                                onPress={this.register}
                            >
                                <LinearGradient
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}}
                                    colors={['#7c9d32', '#b7d477']}
                                    style={styles.login}
                                >
                                    <Textpopins
                                        style={[styles.title, {color: '#fff'}]}>{t('form.buttons.register')} !</Textpopins>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Item>

                    </Form>
                </Animatable.View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7c9d32',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 3,
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
        backgroundColor: '#fff',
        paddingVertical: Constants.statusBarHeight,
        paddingHorizontal: Constants.statusBarHeight,
    },
    logo: {
        width: width / 4,
        height: width / 4,
        backgroundColor: "transparent"
    },
    title: {
        color: '#7c9d32',
        fontWeight: 'bold',
        fontSize: 20,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'transparent',
        marginVertical: Constants.statusBarHeight / 2
    },
    forget: {
        paddingTop: Constants.statusBarHeight,
        borderColor: 'transparent',
    },
    input: {
        borderBottomColor: "#7c9d32",
        borderBottomWidth: 2,
    },
    login: {
        paddingHorizontal: Constants.statusBarHeight,
        borderColor: '#7c9d30',
        paddingVertical: 5,
        marginVertical: 5,
        borderWidth: 2,
        borderRadius: Constants.statusBarHeight * 2
    },
    back: {
        paddingHorizontal: Constants.statusBarHeight / 2,
        backgroundColor: "transparent",
        paddingVertical: Constants.statusBarHeight / 3,
        borderRadius: Constants.statusBarHeight,
        position: "absolute",
        top: Constants.statusBarHeight,
        left: 0
    }
});
