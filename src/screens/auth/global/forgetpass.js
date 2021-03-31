import * as React from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Keyboard,
    StatusBar,
} from 'react-native';
import {
    Button,
    Form,
    Input,
    Thumbnail,
} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import {t} from '../../../functions/lang';
import Textpopins from '../../../functions/screenfunctions/text';
import customStyle from '../../../../assets/Theme';
import Constants from 'expo-constants';

const {width,height} = Dimensions.get('window');
const icon = require('../../../../assets/icon-ios.png');
import DropdownAlert from "react-native-dropdownalert";

export default class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumb: '',
        };
    }

    sendLink = () => {
        Keyboard.dismiss();
        this.dropDownAlertRef.alertWithType('info', t('form.validation.loginregister.forgetpass.success'));
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
                    />
                <View style={[styles.content,customStyle.centerItems,styles.mt]}>
                    <View style={[styles.loginheader,customStyle.centerItems]}>
                        <Thumbnail source={icon}/>
                    </View>
                    <View style={customStyle.centerItems}>
                        <View>
                            <Textpopins style={styles.title} >
                                {t('loginregister.forgetpass.title')}
                            </Textpopins>
                        </View>
                        <View>
                            <Form style={styles.form}>
                                <View style={styles.itemStyle}>
                                    <Input
                                        style={styles.inputstyle}
                                        onChangeText={(text) =>
                                            this.setState({phoneNumb: text})
                                        }
                                        onSubmitEditing={() => Keyboard.dismiss}
                                        placeholder={t('form.labels.phonenumb')}
                                    />
                                </View>
                            </Form>
                        </View>

                        <View style={styles.itemStyle}>
                            <Button
                                rounded
                                onPress={this.sendLink}
                                full
                                success
                                style={styles.buttonStyle}
                                large>
                                <Textpopins style={[styles.buttonText, {color: '#fff'}]}
                                >
                                    {t('form.buttons.continue').toUpperCase()}
                                </Textpopins>
                            </Button>
                        </View>

                        <View style={styles.itemStyle}>
                            <Button
                                rounded
                                onPress={() => this.props.navigation.goBack()}
                                full
                                success
                                style={styles.buttonStyle}
                                large
                                bordered>
                                <Textpopins style={[styles.buttonText, {color: '#7c9d32'}]}
                                >
                                    {t('form.buttons.backlogin').toUpperCase()}
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
    container:{
        flex:1,
        backgroundColor:"#fff",
        borderColor:"#fff",
        borderBottomColor:"#fff",
        borderBottomWidth:0,
    },
    content:{
        flex:1,
    },
    mt:{
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
    header:{
        backgroundColor:"#fff",
        borderColor:"#fff",
        borderBottomColor:"#fff",
        borderBottomWidth:0,
        width,
        marginTop:Constants.statusBarHeight,
        zIndex:10,
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
        height:50,
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
    buttonStyle:{
        paddingHorizontal: 10,
    },
});
