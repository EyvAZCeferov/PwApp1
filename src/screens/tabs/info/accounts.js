import React from 'react';
import {
    Text,
    StyleSheet,
    Dimensions,
    View,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import {
    Thumbnail,
    Content,
    Form,
    Input,
    Button,
    Item,
} from 'native-base';
import HeaderDrawer from './components/header';
import customStyle from '../../../../assets/Theme';
import {t} from '../../../functions/lang';
import firebase from '../../../functions/firebase/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import {Feather} from '@expo/vector-icons';
import {StatusBar} from "expo-status-bar";
import DropdownAlert from "react-native-dropdownalert";
import Textpopins from './../../../functions/screenfunctions/text'
const {width,height} = Dimensions.get('window');

export default class Account extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: null,
            profPic: null,
            telephoneNumb: null,
            nameSurname: null,
            isReady: false,
        };
    }

    componentDidMount() {
        this.getInfo();
        setTimeout(() => {
            this.renderImage();
        }, 5000);
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert(t('permNotReqCam'));
            }
        }
    };

    getInfo() {
        firebase
            .database()
            .ref('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/userInfos')
            .on('value', (data) => {
                var newData = data.toJSON();
                if (newData.profPic != null) {
                    this.setState({
                        profPic: newData.profPic,
                        isReady: true
                    });
                } else {
                    this.setState({profPic: null, isReady: true});
                }
                this.renderImage();
                this.setState({email: newData.email});
                this.setState({telephoneNumb: newData.telephoneNumb});
            });
    }

    updateAccount = () => {
        Keyboard.dismiss();
        firebase
            .database()
            .ref('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/userInfos')
            .update({
                email: this.state.email,
                telephoneNumb: this.state.telephoneNumb,
            })
            .then(
                () => {
                    this.dropDownAlertRef.alertWithType('success', t('refreshDatas'));
                    this.getInfo();
                },
                (err) => {
                    this.dropDownAlertRef.alertWithType('error', err.message);
                }
            );
    };

    _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 0.70,
            });
            if (!result.cancelled) {
                this.dropDownAlertRef.alertWithType('info', t('ppNotChoised'));
            }
            if (result.type == 'image') {
                this.setState({isReady: false});
                
                    const response = await fetch(result.uri);
                    const blob = await response.blob();
                    var ref = firebase
                        .storage()
                        .ref()
                        .child('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/profile.jpg');
                    ref.put(blob).on(
                        firebase.storage.TaskEvent.STATE_CHANGED,
                        (data) => {
                            var downloadPP = data.downloadURL();
                            this.setState({profPic: downloadPP});
                        },
                        () => {
                            firebase
                                .storage()
                                .ref('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/profile.jpg')
                                .snapshot.ref.getDownloadURL()
                                .then(function (downloadURL) {
                                    this.setState({profPic: downloadURL});
                                    var user = firebase.auth().currentUser;
                                    firebase
                                        .database()
                                        .ref('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/userInfos')
                                        .set({
                                            profPic: downloadURL,
                                        });
                                    this.setState({profPic: downloadURL()});
                                });
                        }
                    );
                    ref.getDownloadURL().then((url) => {
                        this.setState({profPic: url});
                        var user = firebase.auth().currentUser;
                        firebase
                            .database()
                            .ref('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/userInfos')
                            .update({
                                profPic: url,
                            })
                            .then(
                                () => {
                                    firebase
                                        .database()
                                        .ref('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/userInfos')
                                        .on('value', (data) => {
                                            var newData = data.toJSON();
                                            this.setState({profPic: newData.profPic});
                                            this.renderImage();
                                        });
                                    this.dropDownAlertRef.alertWithType('success', t('ppUploaded'));
                                },
                                (err) => {
                                    this.dropDownAlertRef.alertWithType('success', err.message);
                                }
                            );
                    });
                }
        } catch (E) {
            this.dropDownAlertRef.alertWithType('error', E.message);
        }
    };

    renderImage() {
        return (
            <Thumbnail
                style={styles.image}
                source={{
                    uri: this.state.profPic,
                }}
            />
        );
    }

    render() {
        return (
            <View style={{backgroundColor: "#fff",flex:1}}>
                <HeaderDrawer {...this.props} name={t('drawer.accounts')}/>
                {this.state.isReady ? (
                    <View>
                        <View style={styles.header}>
                            <View style={customStyle.headerArena}>
                                <View style={styles.imagePickerArena}>
                                    <View style={styles.imageArena}>
                                        {this.state.profPic === null ||
                                        this.state.profPic == null ? (
                                            <Thumbnail
                                                style={styles.image}
                                                source={{
                                                    uri:
                                                        'https://firebasestorage.googleapis.com/v0/b/storeapp1-ea810.appspot.com/o/WP%2F11111111111111111111111111111111111111111.png?alt=media&token=5f0aa05e-6eaf-4945-a5f4-c9b0f917892f',
                                                }}
                                            />
                                        ) : (
                                            this.renderImage()
                                        )}
                                    </View>
                                    <View style={styles.pickerArena}>
                                        <Button style={{padding: 10, marginLeft: 10}} danger rounded small
                                                onPress={this._pickImage}>
                                            <Feather name="edit" size={18} color="#fff"/>
                                        </Button>
                                    </View>
                                </View>
                                <Textpopins style={styles.nameSurname} children={this.state.nameSurname != null
                                    ? this.state.nameSurname
                                    : t('loginregister.programlock.namesurname')}
                                />
                            </View>
                        </View>
                        <View style={customStyle.f1}>
                            <Content >
                                <Form style={styles.form}>
                                    <View style={styles.itemStyle}>
                                        <Input
                                            style={styles.inputstyle}
                                            keyboardType="numeric"
                                            placeholder={t('form.labels.phonenumb')}
                                            keyboardShouldPersistTaps="handled"
                                            onChangeText={(text) =>
                                                this.setState({telephoneNumb: text})
                                            }
                                            value={
                                                this.state.telephoneNumb != null
                                                    ? this.state.telephoneNumb
                                                    : t('form.labels.phonenumb')
                                            }
                                            defaultValue={
                                                this.state.telephoneNumb != null
                                                    ? this.state.telephoneNumb
                                                    : t('form.labels.phonenumb')
                                            }
                                        />
                                    </View>
                                    <View style={styles.itemStyle}>
                                        <Input
                                            style={styles.inputstyle}
                                            keyboardType="email"
                                            keyboardShouldPersistTaps="handled"
                                            placeholder={t('form.labels.email')}
                                            onChangeText={(text) => this.setState({email: text})}
                                            value={
                                                this.state.email != null
                                                    ? this.state.email
                                                    : t('form.labels.email')
                                            }
                                            defaultValue={
                                                this.state.email != null
                                                    ? this.state.email
                                                    : t('form.labels.email')
                                            }
                                        />
                                    </View>
                                    <View style={styles.itemStyle}>
                                        <Button
                                            rounded
                                            style={styles.buttonStyle}
                                            onPress={this.updateAccount}
                                            success>
                                            <Textpopins style={styles.buttonText}
                                                    children={t('actions.submit')}
                                            />
                                        </Button>
                                    </View>
                                </Form>
                            </Content>
                        </View>
                    </View>
                ) : (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <ActivityIndicator size="large" color="#7c9d32"/>
                    </View>

                )}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#7c9d32',
        height: height/3.25,
        width: width,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
    },
    imagePickerArena: {
        position: 'relative',
        width: 85,
        height: 85,
        marginTop:Constants.statusBarHeight-5,
        backgroundColor: '#fff',
        borderRadius: 43,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    imageArena: {
        width: 40,
        height: 40,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: "#fff",
    },
    pickerArena: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: "transparent",
    },
    nameSurname: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        paddingBottom: 20,
        backgroundColor: '#7c9d32',
        marginVertical: 10,
    },
    content: {
        padding: 0,
        margin: 0,
        marginTop: 60,
        backgroundColor: '#fff',
        width: width,
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
        borderColor:"rgba(0,0,0,.4)",
        borderWidth:2,
    },
    buttonStyle: {
        paddingHorizontal: 40,
        marginTop: 15,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#fff',
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 0,
    },
});
