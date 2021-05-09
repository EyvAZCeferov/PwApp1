import * as React from "react";
import {
    StyleSheet,
    Dimensions,
    View,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import {Button} from "native-base";
import {CommonActions} from "@react-navigation/native";
import {AntDesign} from "@expo/vector-icons";
import {t} from "../../../functions/lang";
import {QRCode as CustomQRCode} from "react-native-custom-qr-codes-expo";
import {StatusBar} from "expo-status-bar";
import Textpopins from "../../../functions/screenfunctions/text";

const {width, height} = Dimensions.get("window");
import Barcode from '@kichiyaki/react-native-barcode-generator';
import Carousel from "react-native-snap-carousel";

export default class PayThanks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: true,
            link: null,
            barcodes: [
                {
                    id: 1,
                    type: "qr",
                },
                {
                    id: 2,
                    type: "barcode",
                },
            ],
            activeIndex: 1
        };
    }

    componentDidMount() {
        const params = this.props.route.params;
        if (params.checkid != null) {
            this.setState({link: params.checkid, refresh: false});
            this.renderContent();
        }
    }

    navigationreset() {
        return this.props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    {name: "Home"},
                    {
                        name: "Home",
                    },
                ],
            })
        );
    }

    renderItem({item, index}) {
        if (item.type == "qr") {
            return (
                <CustomQRCode
                    key={index}
                    style={styles.barcode}
                    content="Content is here"
                    size={width / 1.25}
                    color="#fff"
                    codeStyle="square"
                    innerEyeStyle="square"
                    outerEyeStyle="square"
                />
            )
        } else if (item.type == "barcode") {
            return (
                <Barcode
                    key={index}
                    format="CODE128A"
                    value="0123456789012"
                    text="0123456789012"
                    style={styles.barcode}
                    size={{width: width, height: width}}
                />
            )
        }
    }

    renderContent() {
        if (this.state.refresh) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                    }}
                >
                    <ActivityIndicator
                        size="large"
                        color="#7c9d32"
                        animating={true}
                        focusable={true}
                    />
                </View>
            );
        } else {
            return (
                <View style={[styles.f1, styles.bgGreen]}>
                    <View style={styles.thanksArena}>
                        <View style={styles.barcode}>
                            <Carousel
                                layout={'default'}
                                ref={(ref) => (this.carousel = ref)}
                                data={this.state.barcodes}
                                sliderWidth={width / 1.33}
                                itemWidth={width / 1.33}
                                renderItem={this.renderItem}
                                onSnapToItem={(index) => this.setState({activeIndex: index})}
                                loop={true}
                                style={{
                                    alignItems: "center",
                                    alignContent: "center",
                                    textAlign: "center",
                                    justifyContent: "center"
                                }}
                                autoplay={true}
                                inactiveSlideScale={1}
                                activeSlideAlignment={"center"}
                                sliderHeight={width / 1.33}
                                itemHeight={width / 1.33}
                                layoutCardOffset={`18`}
                            />
                        </View>
                        <Textpopins
                            style={[styles.icon, styles.title]}
                            children={t("barcode.thanksBuying.title")}
                        />
                        <Textpopins
                            style={styles.subtitle}
                            children={t("barcode.thanksBuying.scanCode")}
                        />
                        <View style={styles.centerItems}>
                            <Button
                                rounded
                                iconLeft
                                light
                                style={styles.btn}
                                onPress={() => this.navigationreset()}
                            >
                                <AntDesign name="home" size={24} color="black"/>
                                <Textpopins
                                    style={styles.btnText}
                                    children={t("barcode.thanksBuying.returnHome")}
                                />
                            </Button>
                        </View>
                    </View>
                </View>
            );
        }
    }

    render() {
        return (
            <SafeAreaView>
                <StatusBar backgroundColor="#7c9d32" style="light"/>
                {this.renderContent()}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    bgGreen: {
        backgroundColor: "#7c9d32",
    },
    f1: {
        width,
        height,
    },
    thanksArena: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    },
    icon: {
        fontSize: 50,
        color: "#fff",
        fontWeight: "bold",
        marginVertical: 5,
    },
    barcode: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginBottom: 35,
        color: "#fff",
        width: width / 1.35
    },
    w1h1: {
        width: 500,
        height: 500,
    },
    title: {
        fontSize: 30,
        marginVertical: 10,
        marginTop: 20,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        color: "#fff",
        margin: 0,
        textAlign: "center",
    },
    centerItems: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        textAlign: "center",
    },
    btn: {
        padding: 15,
        marginTop: 20,
    },
    btnText: {
        fontSize: 15,
        fontWeight: "bold",
        paddingLeft: 5,
        color: "#010101",
    },
});
