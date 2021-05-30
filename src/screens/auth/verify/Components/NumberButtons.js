import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity, BackHandler} from 'react-native';
import {Col, Grid, Row} from 'react-native-easy-grid';

const {width} = Dimensions.get('window');
import {MaterialCommunityIcons} from '@expo/vector-icons';

import {t} from "../../../../functions/lang";
import Textpopins from '../../../../functions/screenfunctions/text';

export default function NumberButtons(props) {

    function changeVal(e) {
        props.changeVal(e)
    }

    function clearVal() {
        props.clearVal();
    }


    function RenderButtons() {

        return (
            <Grid style={styles.grid}>
                <Row style={styles.alignCenter}>
                    <Grid style={styles.alignCenter}>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity
                                style={[styles.btn, styles.btnPress]}
                                onPress={() => changeVal(1)}>
                                <Textpopins style={styles.btnText}>1</Textpopins>
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                              onPress={() => changeVal(2)}>
                                <Textpopins style={styles.btnText} children="2"/>
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                              onPress={() => changeVal(3)}>
                                <Textpopins style={styles.btnText} children="3"/>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </Row>
                <Row style={styles.alignCenter}>
                    <Grid style={styles.alignCenter}>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                              onPress={() => changeVal(4)}>
                                <Textpopins style={styles.btnText} children="4"/>
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                              onPress={() => changeVal(5)}>
                                <Textpopins style={styles.btnText} children={5}/>
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                              onPress={() => changeVal(6)}>
                                <Textpopins style={styles.btnText} children={6}/>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </Row>
                <Row style={styles.alignCenter}>
                    <Grid style={styles.alignCenter}>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                              onPress={() => changeVal(7)}>
                                <Textpopins style={styles.btnText} children={7}/>
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                              onPress={() => changeVal(8)}>
                                <Textpopins style={styles.btnText} children={8}/>
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                              onPress={() => changeVal(9)}>
                                <Textpopins style={styles.btnText} children={9}/>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </Row>
                <Row style={styles.alignCenter}>
                    <Grid style={styles.alignCenter}>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity
                                style={[styles.btn, styles.btnPress]}
                                onPress={() => BackHandler.exitApp()}>
                                <Textpopins style={[styles.btnText, styles.cancText]}
                                            children={t('actions.cancel')}/>
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                              onPress={() => changeVal(0)}>
                                <Textpopins style={styles.btnText} children={0}/>
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles.alignCenter}>
                            <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                              onPress={() => clearVal()}>
                                <MaterialCommunityIcons
                                    name="backspace-outline"
                                    size={24}
                                    color="#6d7587"
                                />
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </Row>
            </Grid>
        );
    }


    return (
        <View>
            <View style={styles.container}>
                {RenderButtons()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: '90%',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    grid: {
        width: width - 45,
        height: '50%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        textAlign: 'center',
        width: 70,
        height: 70,
    },
    btnPress: {
        borderColor: "#D1D1D1",
        borderWidth: 1.8,
        borderRadius: 35,
        shadowColor: '#6d7587',
        shadowRadius: 1,
        shadowOffset: {
            width: 2,
            height: 3,
        },
        shadowOpacity: 1,
    },
    btnText: {
        fontSize: 23,
        fontWeight: '400',
        color: '#6d7587',
    },
    cancText: {
        fontSize: 15,
    },
    alignCenter: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: "center",
    }
});
