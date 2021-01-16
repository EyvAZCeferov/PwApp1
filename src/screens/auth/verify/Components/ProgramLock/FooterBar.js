import React from 'react';
import {StyleSheet, Dimensions, View, Text} from 'react-native';
import {Button, Footer, FooterTab} from 'native-base';

var width = Dimensions.get('window').width;
import {Entypo, FontAwesome5} from '@expo/vector-icons';
import {t} from "../../../../../../../Lang";

export default class FooterBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                {this.props.permission ? (
                    <Footer style={styles.bgCol}>
                        <Button vertical transparent style={[styles.bgCol, styles.oneButton]}
                                onPress={() => this.props.navigation.navigate('Fp')}>
                            <Entypo name="lock" size={24} color="#6d7587"/>
                            <Text style={styles.colorAndFontSize}>
                                {t('forgetPass')}
                            </Text>
                        </Button>
                        <FooterTab style={styles.bgCol}>
                            <Button style={[styles.bgCol, styles.oneButton]} onPress={() => this.props.callFingerPrint()} vertical
                                    transparent>
                                <FontAwesome5 name="fingerprint" size={24} color="#6d7587"/>
                                <Text style={styles.colorAndFontSize}>{t('fingerprintlogin')}</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                ) : (
                    <Footer style={styles.bgCol}>
                        <Button vertical transparent style={[styles.bgCol, styles.oneButton]}
                                onPress={() => this.props.navigation.navigate('Fp')}>
                            <Entypo name="lock" size={24} color="#6d7587"/>
                            <Text style={styles.colorAndFontSize}>
                                {t('forgetPass')}
                            </Text>
                        </Button>
                    </Footer>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgCol: {
        borderColor: '#fff',
        backgroundColor: "#fff",
        width: width,
        height: 70,
        textAlign: 'center',
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    oneButton: {
        width: width / 2,
    },
    colorAndFontSize: {
        borderColor: '#fff',
        backgroundColor: "#fff",
        color: '#6d7587',
        fontSize: 16,
        textAlign: 'center',
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
});
