import React from 'react';
import {StyleSheet, Dimensions, View, Text} from 'react-native';
import {Button} from 'native-base';
import {Col, Grid, Row} from 'react-native-easy-grid';

const {width,height} = Dimensions.get('window');
import {Entypo, FontAwesome5} from '@expo/vector-icons';
import {t} from "../../../../../functions/lang";
import Textpopins from '../../../../../functions/screenfunctions/text';

export default class FooterBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ 
                width:width,
                height:"100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderTopColor:"#7c9d32",
                borderTopWidth:2,
                }}>
                {!this.props.permission ? (
                    <Row>
                        <Grid style={{ height:"100%" }}>
                            <Col>
                                <Button 
                                    vertical
                                    transparent 
                                    style={{ width:"100%"}}
                                    onPress={() => this.props.navigation.navigate('Fp')}>
                                        <Entypo name="lock" size={24} color="#6d7587"/>
                                        <Textpopins style={styles.colorAndFontSize}>
                                            {t('loginregister.forgetpass.title')}?
                                        </Textpopins>
                                </Button>
                            </Col>
                            <Col>
                                <Button 
                                    vertical
                                    style={{ width:"100%"}} 
                                    onPress={() => this.props.callFingerPrint()} 
                                    transparent>
                                        <FontAwesome5 name="fingerprint" size={24} color="#6d7587"/>
                                        <Textpopins style={styles.colorAndFontSize}>
                                            {t('loginregister.programlock.useFingerPrint')}
                                        </Textpopins>
                                </Button>
                            </Col>
                        </Grid>
                    </Row>
                ) : (
                    <View style={{ 
                        width:width/2,
                        height:"100%",
                        backgroundColor:"#fff",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center"  }}>
                        <Button vertical transparent style={styles.oneButton}
                                onPress={() => this.props.navigation.navigate('Fp')}>
                            <Entypo name="lock" size={24} color="#6d7587"/>
                            <Textpopins style={styles.colorAndFontSize}>
                                {t('loginregister.forgetpass.title')}?
                            </Textpopins>
                        </Button>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    colorAndFontSize: {
        color: '#6d7587',
        fontSize: 15,
        flexWrap:"wrap",
    },
});
