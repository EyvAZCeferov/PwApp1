import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Thumbnail} from 'native-base';
import Textpopins from '../../../../../functions/screenfunctions/text';

const {width,height} = Dimensions.get('window');
const icon = require('../../../../../../assets/icon-ios.png');
import {t} from "../../../../../functions/lang";
import Constants from 'expo-constants';


export default class MobileVerifyHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                
                <View style={styles.header}>
                    <Textpopins style={styles.title} >
                        {t('loginregister.mobileverify.title')}
                    </Textpopins>
                    <Textpopins style={[styles.title,styles.desc]} >
                        {t('loginregister.mobileverify.desc')}
                    </Textpopins>
                </View>
                   
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
        backgroundColor:"#5C0082",
    },
    header: {
        width: width,
        height: "100%",
        backgroundColor: 'transparent',
        borderColor: "transparent",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop:Constants.statusBarHeight-10,
    },
    title: {
        color: 'rgba(255,255,255,.9)',
        fontSize: 22,
        fontWeight: "bold",
        letterSpacing: 2,
        lineHeight: 22,
        textAlign: 'center',
    },
    desc:{
        fontSize:16,
        marginTop:10,
    },
});
