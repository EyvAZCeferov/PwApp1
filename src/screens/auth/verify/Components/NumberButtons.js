import React from 'react';
import {View, StyleSheet, Dimensions, Text, TouchableOpacity, BackHandler} from 'react-native';
import {Col, Grid, Row} from 'react-native-easy-grid';

const {width} = Dimensions.get('window');
import {MaterialCommunityIcons} from '@expo/vector-icons';

import {t} from "../../../../../../Lang";
import {Poppins_400Regular, useFonts} from "@expo-google-fonts/poppins";

function MyText(props) {
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
    });
    if (!fontsLoaded) {
        return (
            <Text style={[{
                fontSize: props.fontSize ? props.textColor : 18,
                color: props.textColor ? props.textColor : "rgba(0,0,0,.8)",
                textAlign: "center"
            }, props.style ? props.style : null]}>{props.children}</Text>
        )
    } else {
        return (
            <Text style={[{
                fontSize: props.fontSize ? props.textColor : 18,
                color: props.textColor ? props.textColor : "rgba(0,0,0,.8)",
                textAlign: "center",
                fontFamily: "Poppins_400Regular"
            }, props.style ? props.style : null]}>{props.children}</Text>
        )
    }
}

export default function NumberButton(props) {

    function changeVal(e) {
        props.changeVal(e)
    }

    function clearVal() {
        props.clearVal();
    }


    function RenderButtons() {

        return (
            <View>
                <Grid style={styles.grid}>
                    <Row style={styles.alignCenter}>
                        <Grid style={styles.alignCenter}>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity
                                    style={[styles.btn, styles.btnPress]}
                                    onPress={() => changeVal(1)}>
                                    <Text style={styles.btnText}>1</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                                  onPress={() => changeVal(2)}>
                                    <MyText style={styles.btnText} children="2"/>
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                                  onPress={() => changeVal(3)}>
                                    <MyText style={styles.btnText} children="3"/>
                                </TouchableOpacity>
                            </Col>
                        </Grid>
                    </Row>
                    <Row style={styles.alignCenter}>
                        <Grid style={styles.alignCenter}>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                                  onPress={() => changeVal(4)}>
                                    <MyText style={styles.btnText} children="4"/>
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                                  onPress={() => changeVal(5)}>
                                    <MyText style={styles.btnText} children={5}/>
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                                  onPress={() => changeVal(6)}>
                                    <MyText style={styles.btnText} children={6}/>
                                </TouchableOpacity>
                            </Col>
                        </Grid>
                    </Row>
                    <Row style={styles.alignCenter}>
                        <Grid style={styles.alignCenter}>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                                  onPress={() => changeVal(7)}>
                                    <MyText style={styles.btnText} children={7}/>
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                                  onPress={() => changeVal(8)}>
                                    <MyText style={styles.btnText} children={8}/>
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                                  onPress={() => changeVal(9)}>
                                    <MyText style={styles.btnText} children={9}/>
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
                                    <MyText style={[styles.btnText, styles.cancText]}
                                            children={t('cancel')}/>
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                                  onPress={() => changeVal(0)}>
                                    <MyText style={styles.btnText} children={0}/>
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.alignCenter}>
                                <TouchableOpacity style={[styles.btn, styles.btnPress]}
                                                  onPress={() => clearVal()}>
                                    <MaterialCommunityIcons
                                        name="backspace-outline"
                                        size={24}
                                        color="#7c9d32"
                                    />
                                </TouchableOpacity>
                            </Col>
                        </Grid>
                    </Row>
                </Grid>
            </View>
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
        height: 290,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    grid: {
        width: width - 50,
        height: 290,
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
        borderColor: "#7c9d32",
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
        color: '#7c9d32',
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
