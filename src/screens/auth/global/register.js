import * as React from 'react';
import {StyleSheet, Dimensions, Keyboard, View} from 'react-native';
import {
    Button,
    Item,
    Form,
    Input,
    Thumbnail
} from 'native-base';
import {LiteCreditCardInput} from 'react-native-credit-card-input';
import {t} from '../../../functions/lang';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
const succesImage = require('../../../../assets/images/Alert/tick.png');

var {width} = Dimensions.get('window');
const icon = require('../../../../assets/icon-ios.png');
import {StatusBar} from "expo-status-bar";
import DropdownAlert from "react-native-dropdownalert";
import AsyncStorage from "@react-native-community/async-storage";
import Textpopins from '../../../functions/screenfunctions/text';
import customStyle from '../../../../assets/Theme';
import Constants from 'expo-constants';
import {makeid} from '../../../functions/standart/helper';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumb: null,
            pincode: null,
            cardInfos: [],
            data: [],
        };
    }
    signUp () {
        Keyboard.dismiss();
        let cardId = makeid()
        if (this.state.phoneNumb !== null) {
            const cardDatas = {
                cardId: cardId,
                cardPass: this.state.pincode,
                cardInfo: this.state.cardInfos,
            }
            // await AsyncStorage.setItem('haveFinger', '');
            // await AsyncStorage.setItem('localAuthPass', '');
        }
        this.dropDownAlertRef.alertWithType('success', t('form.validation.loginregister.register.success'));
        this.props.navigation.navigate('MobileVerify');
        // this.dropDownAlertRef.alertWithType('error', t('form.validation.loginregister.forgetpass.error'));
    };

    _onChange = (data) => {
        this.setState({cardInfos: data.values});
    };


    render() {
        return (
            <KeyboardAwareScrollView style={styles.container}>
                <StatusBar backgroundColor="#fff" style="dark"/>
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
                <View style={[customStyle.centerItems, styles.mt]}>

                    <View style={styles.mt}>
                        <View style={customStyle.centerItems}>
                            <Thumbnail source={icon} />
                            <Textpopins style={styles.title} >{t('program.pw')}</Textpopins>
                        </View>
                    </View>

                    <View>

                        <View>
                            <Form
                                style={styles.form}
                                onPress={Keyboard.dismiss}>

                                <View style={[customStyle.centerItems,styles.itemStyle]}>
                                    <Input
                                        style={styles.inputstyle}
                                        placeholder={t('form.labels.phonenumb')}
                                        autoCorrect={false}
                                        maxLength={15}
                                        selectionColor="#7c9d32"
                                        onChangeText={(text) => this.setState({phoneNumb: text})}
                                    />
                                </View>

                                {/* <Item style={styles.itemStyle}>
                                    <View style={[styles.inputstyle, styles.cardInput]}>
                                        <LiteCreditCardInput
                                            keyboardShouldPersistTaps="handled"
                                            keyboardType="number-pad"
                                            onChange={this._onChange}
                                        />
                                    </View>
                                </Item> */}

                                <View style={[customStyle.centerItems,styles.itemStyle]}>

                                    <Input
                                        autoCorrect={false}
                                        style={styles.inputstyle}
                                        placeholder={t('form.labels.password')}
                                        minLength={8}
                                        secureTextEntry={true}
                                        onChangeText={(text) => this.setState({pincode: text})}
                                    />

                                </View>

                                <View style={styles.itemStyle}>
                                    <Button
                                        style={styles.buttonStyle}
                                        onPress={() => this.signUp()}
                                        success
                                        full
                                    >
                                        <Textpopins style={styles.continueButtonText}
                                                >{t('form.buttons.continue')}</Textpopins>
                                    </Button>
                                </View>

                                <View style={styles.itemStyle}>
                                    <Button
                                        style={styles.buttonStyle}
                                        success
                                        full
                                        bordered
                                        onPress={() => this.props.navigation.navigate('Login')}
                                    >
                                        <Textpopins
                                            style={styles.buttonText}>
                                            {t('form.buttons.backlogin')}
                                        </Textpopins>
                                    </Button>
                                </View>

                            </Form>
                        </View>

                    </View>
                
                </View>

            </KeyboardAwareScrollView>
        );
    }
}
const styles = StyleSheet.create({
    logo: {
        width: 110,
        height: 130,
    },
    mt: {
        marginTop:Constants.statusBarHeight,
    },
    title: {
        fontSize: 21,
        color: '#7c9d32',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20,
    },
    form: {
        padding: 0,
        margin: 0,
        width: width,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    itemStyle:{
        width:width-50,
        height:60,
        marginVertical:10,
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
    cardInput: {
        width: '100%',
        paddingLeft: 0,
    },
    buttonText: {
        color: '#7c9d32',
        fontSize: 17,
    },
    buttonstyle:{
        marginHorizontal:30,
        height:"100%",
    },
    continueButtonText: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#fff',
    },
    container: {
        backgroundColor: '#fff',
        flex:1,
    }
});
