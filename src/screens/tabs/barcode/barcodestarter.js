import React from 'react';
import {
    View,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
} from 'react-native';
import Constants from 'expo-constants';

const {width, height} = Dimensions.get('screen');
import {AntDesign, Entypo, FontAwesome} from '@expo/vector-icons';
import {t} from "../../../functions/lang";
import Textpopins from "../../../functions/screenfunctions/text";
import DropDownPicker from "react-native-dropdown-picker";
import BarcodeMask from "react-native-barcode-mask";
import {Camera} from "expo-camera";
import {StatusBar} from "expo-status-bar";
import RadioButtonRN from 'radio-buttons-react-native';
import firebase from '../../../functions/firebase/firebaseConfig';
import {makeid} from "../../../functions/standart/helper";
import DropdownAlert from "react-native-dropdownalert";

const succesImage = require('../../../../assets/images/Alert/tick.png');

export default class Barcodestarter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allMarkets: [
                {label: t("barcode.starter.selectmar"), value: null},
                {
                    label: "Bol mart",
                    value: 1
                },
                {label: "Grand mart", value: 2},
                {label: "Caremood", value: 3},
            ],
            cards: [
                {
                    label: "4169 7414 0464 9764",
                    type: "Visa",
                    id: "aU6GnXRS9FCTy8H"
                },
                {
                    label: "6272 9273 3617 172",
                    type: "Unionpay",
                    id: "zz4nOZPRG98cS5V"
                },
            ],
            selectedMarket: null,
            openQr: false,
            flashMode: "off",
            selectedCard: null,
            checkid: null
        }
    }

    setId() {
        let id = makeid(15);
        this.setState({checkid: id});
    }

    componentDidMount() {
        this.setId()
        this.startCam()
    }

    async startCam() {
        await Camera.requestPermissionsAsync();
    }

    flashToggle() {
        if (this.state.flashMode == "torch") {
            this.setState({flashMode: "off"});
        } else {
            this.setState({flashMode: "torch"});
        }
    }

    iconRender() {
        if (this.state.flashMode == "torch") {
            return (
                <Entypo
                    name="flash"
                    style={{paddingHorizontal: 5, paddingVertical: 2}}
                    size={40}
                    color="rgb(255,255,255)"
                />
            );
        } else {
            return (
                <Entypo
                    name="flash"
                    style={{paddingHorizontal: 5, paddingVertical: 2}}
                    size={40}
                    color="rgba(255,255,255,.3)"
                />
            );
        }
    }

    qrCodeScanned(item) {
        this.setState({openQr: false});
        this.setState({selectedMarket: item.barcode})
    }

    next() {
        if (this.state.selectedMarket != null && this.state.selectedCard) {
            this.props.navigation.navigate("ShoppingList", {
                checkid: this.state.checkid,
                selectedCard: this.state.selectedCard,
            });
        } else {
            this.dropDownAlertRef.alertWithType("info", t("barcode.starter.selectRetry"));
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
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
                <View style={styles.header}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: Constants.statusBarHeight
                    }}>
                        <View/>
                        <Textpopins style={styles.title}>{t("barcode.starter.selectmarketandcard")}</Textpopins>
                        <TouchableOpacity style={styles.addToCart} onPress={() => this.setState({openQr: true})}>
                            <AntDesign name="camera" size={26} color="#7c9d32"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.top}>
                        <DropDownPicker
                            arrowSize={24}
                            items={this.state.allMarkets}
                            label={t("barcode.starter.selectmar")}
                            placeholder={t("barcode.starter.selectmar")}
                            containerStyle={{height: 80, width: width - 50}}
                            dropDownMaxHeight={300}
                            searchable={true}
                            searchableStyle={styles.searchable}
                            style={{
                                backgroundColor: "#fff",
                                margin: 10,
                                height: 50,
                                borderColor: "#7c9d32",
                                flexDirection: "row",
                                justifyContent: "space-around"
                            }}
                            itemStyle={{flexDirection: "row", justifyContent: "space-around"}}
                            onChangeItem={(text) =>
                                this.setState({selectedMarket: text})}
                            activeLabelStyle={{color: "#7c9d32"}}
                            selectedLabelStyle={{color: "#7c9d32"}}
                            activeItemStyle={{color: "#7c9d32"}}
                            arrowColor="#7c9d32"
                            autoScrollToDefaultValue={Constants.statusBarHeight}
                            min={15}
                            max={100}
                        />
                    </View>
                    <View style={styles.footer}>
                        <RadioButtonRN
                            data={this.state.cards}
                            selectedBtn={(e) => this.setState({selectedCard: e.id})}
                            icon={
                                <AntDesign
                                    name="checkcircle"
                                    size={25}
                                    color="#7c9d32"
                                />
                            }
                            animationTypes={['zoomIn', 'pulse', 'shake', 'rotate']}
                            deactiveColor="#7c9d32"
                            duration={500}
                        />
                        <View style={{
                            flexDirection: "row",
                            marginTop: Constants.statusBarHeight,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center"
                        }}>
                            <TouchableOpacity
                                style={[styles.addToCart, {
                                    paddingHorizontal: Constants.statusBarHeight * 2,
                                    paddingVertical: Constants.statusBarHeight / 2,
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    alignContent: "center"
                                }]}
                                onPress={() => this.next()}
                            >
                                <Textpopins
                                    style={{
                                        color: "#7c9d32",
                                        marginRight: Constants.statusBarHeight / 3,
                                        fontSize: 20,
                                        fontWeight: "bold"
                                    }}
                                    onPress={() => this.next()}
                                >{t("form.buttons.continue")}</Textpopins>
                                <AntDesign name="arrowright" size={24} color="#7c9d32"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Modal
                    visible={this.state.openQr}
                    animated={true}
                    animationType="slide"
                    statusBarTranslucent={true}
                    hardwareAccelerated={true}
                    transparent={false}
                    presentationStyle="fullScreen"
                    supportedOrientations="portrait"
                >
                    <View style={[styles.container, styles.center]}>
                        <StatusBar hidden={true}/>

                        <Camera
                            style={{width: width, height: height}}
                            type="back"
                            videoStabilizationMode={20}
                            focusable={true}
                            onBarCodeScanned={(item) => this.qrCodeScanned(item)}
                            flashMode={this.state.flashMode}
                            autoFocus
                            ratio="portrait"
                            useCamera2Api
                        >
                            <BarcodeMask
                                outerMaskOpacity={0.6}
                                edgeBorderWidth={3}
                                edgeColor={"#7c9d32"}
                                animatedLineColor="#DD2C00"
                                animatedLineHeight={2}
                                showAnimatedLine={true}
                                animated={true}
                                animatedLineWidth={"90%"}
                                lineAnimationDuration={1400}
                                useNativeDriver={true}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                    textAlign: "center",
                                    margin: "auto",
                                    padding: "auto",
                                }}
                            />
                        </Camera>
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            top: 15,
                            width: width,
                            height: 140,
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                width: width,
                                height: 50,
                                marginTop: 30,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                alignContent: "center",
                                textAlign: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    minHeight: 45,
                                    maxHeight: 60,
                                    minWidth: 45,
                                    maxWidth: 60,
                                    marginLeft: 30,
                                    borderRadius: 5,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                    textAlign: "center",
                                    backgroundColor: "rgba(0,0,0,.5)",
                                }}
                                onPress={() => {
                                    this.setState({openQr: false});
                                }}
                            >
                                <AntDesign name="left" size={25} color="#fff"/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    minHeight: 45,
                                    maxHeight: 60,
                                    minWidth: 45,
                                    maxWidth: 60,
                                    marginRight: 30,
                                    borderRadius: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                    textAlign: "center",
                                    backgroundColor: "#7c9d32",
                                }}
                                onPress={() => {
                                    this.flashToggle();
                                }}
                            >
                                {this.iconRender()}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 15,
                            right: 0,
                            left: 0,
                            width: width,
                            height: 80,
                        }}
                    ></View>
                </Modal>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        color: 'rgba(0,0,0,.8)',
        fontWeight: 'bold',
        marginLeft: Constants.statusBarHeight * 2,
        marginTop: Constants.statusBarHeight / 4
    },
    content: {
        flex: 8,
        backgroundColor: '#ebecf0',
        borderTopLeftRadius: Constants.statusBarHeight,
        borderTopRightRadius: Constants.statusBarHeight,
    },
    top: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    },
    footer: {
        flex: 4,
        marginTop: 5,
        flexDirection: 'column',
    },
    addToCart: {
        paddingHorizontal: Constants.statusBarHeight / 2.5,
        paddingVertical: 4,
        backgroundColor: '#fff',
        borderRadius: Constants.statusBarHeight,
        borderColor: "#7c9d32",
        borderWidth: 2,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
})