import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Thumbnail} from 'native-base';
import Textpopins from '../../../../../functions/screenfunctions/text';

const {width,height} = Dimensions.get('window');
const icon = require('../../../../../../assets/icon-ios.png');
import {t} from "../../../../../functions/lang";
import Constants from 'expo-constants';


export default class ProgramLockHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData:null,
        }
    }

    UNSAFE_componentWillMount(){
        this.getInfo();
    }

    getInfo() {
        this.setState({userData:{profilePhoto:"A",name:"Eyvaz"}})
    }

    render() {
        return (
            <View style={styles.container}>
                {!this.state.userData.profilePhoto ?
                    (
                        <View style={styles.header}>
                            <Thumbnail
                                rounded
                                source={{
                                    uri: this.state.userData.profilePhoto,
                                }}
                            />
                            <Textpopins style={styles.title} >{this.state.userData.name}</Textpopins>
                        </View>
                    )
                :
                    (
                        <View style={styles.header}>
                            <Thumbnail
                                rounded
                                source={icon}
                            />
                            <Textpopins style={styles.title} >{t('loginregister.programlock.namesurname')}</Textpopins>
                        </View>
                    )
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor:"#7c9d32",
    },
    header: {
        width: width,
        height: "90%",
        backgroundColor: 'transparent',
        borderColor: "transparent",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop:Constants.statusBarHeight,
    },
    title: {
        color: 'rgba(255,255,255,.9)',
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 4,
        lineHeight: 18,
        textAlign: 'center',
        marginTop:Constants.statusBarHeight-8
    },
});
