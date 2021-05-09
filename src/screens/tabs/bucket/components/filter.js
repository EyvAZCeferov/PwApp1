import React from 'react';
import {Dimensions, Modal, StyleSheet, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants";
import Textpopins from "../../../../functions/screenfunctions/text";
import {Body, Button, Left, List, ListItem, Picker, Right} from "native-base";
import {AntDesign, Entypo, Feather, FontAwesome} from "@expo/vector-icons";
import {t} from "../../../../functions/lang";
import {Icon, Slider} from 'react-native-elements';

const {width, height} = Dimensions.get("screen");

export default class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            brand: null,
            price: 0
        }
    }

    render() {
        return (
            <Modal
                animated={true}
                animationType="slide"
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                transparent={false}
                presentationStyle="fullScreen"
                supportedOrientations="portrait"
                visible={this.props.active}
            >
                <View style={styles.container}>
                    <View style={[styles.header, styles.center, {
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }]}>
                        <View style={{
                            marginTop: Constants.statusBarHeight
                        }}/>
                        <Textpopins style={[styles.center, {
                            fontSize: 23,
                            marginTop: Constants.statusBarHeight
                        }]}>Filter</Textpopins>
                        <TouchableOpacity
                            style={{
                                marginTop: Constants.statusBarHeight
                            }}
                            onPress={() => this.props.closeModal()}
                        >
                            <AntDesign name="closecircleo" size={24} color="black"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <List>
                            <ListItem>
                                <Left><Textpopins>{t('filter.brand')}</Textpopins></Left>
                                <Body>
                                    <Picker
                                        enabled
                                        mode="dropdown"
                                        selectedValue={this.state.brand}
                                        onValueChange={(val) => this.onValueChange(val)}
                                        style={{width: width / 1.5, zIndex: 9999}}
                                        supportedOrientations="portrait"
                                        note
                                    >
                                        <Picker.Item value="" label="Brend seçin"/>
                                        {this.props.brands ? this.props.brands.map(element => {
                                            return (
                                                <Picker.Item value={element.id} label={element.label}/>
                                            )
                                        }) : null}
                                    </Picker>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Left><Textpopins>{t('check.productPrice')}</Textpopins></Left>
                                <Body>
                                    <Textpopins>{Math.max(this.state.price)}</Textpopins>
                                    <Slider
                                        value={this.state.price}
                                        onValueChange={(val) => this.setState({price: val})}
                                        maximumValue={150}
                                        minimumValue={0}
                                        step={0.1}
                                        trackStyle={{height: 10, backgroundColor: 'transparent'}}
                                        thumbStyle={{height: 20, width: 20, backgroundColor: 'transparent'}}
                                        thumbProps={{
                                            children: (
                                                <Entypo
                                                    name="price-tag"
                                                    size={24}
                                                    containerStyle={{bottom: 24, right: 20}}
                                                    color="#29C5B9"/>
                                            ),
                                        }}
                                        animationType={'spring'}
                                        allowTouchTrack
                                        orientation={'horizontal'}
                                    />
                                </Body>
                            </ListItem>
                        </List>
                    </View>
                    <View style={[styles.footer, styles.center]}>
                        <Button success rounded large style={[styles.center, {
                            paddingHorizontal: Constants.statusBarHeight,
                            paddingVertical: Constants.statusBarHeight
                        }]}
                                onPress={() => this.props.searchFilter()}>
                            <Feather name="search" size={24} color="#fff"/>
                        </Button>
                    </View>
                </View>
            </Modal>
        )
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flex: 0.1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignContent: "center"
    },
    center: {
        textAlign: "center",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 0.8,
        backgroundColor: '#ebecf0',
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
    },
    footer: {
        flex: 0.1,
        marginTop: 5,
        flexDirection: 'row',
    },
})