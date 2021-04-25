import React from 'react';
import {View, StyleSheet, Dimensions, Image, SafeAreaView} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {AntDesign} from '@expo/vector-icons';
import {StatusBar} from "expo-status-bar";
import Textpopins from '../../functions/screenfunctions/text';
import AsyncStorage from "@react-native-community/async-storage";

const {width, height} = Dimensions.get('window');
export default class AppSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slides: [
                {
                    title: "Pay and Win tətbiqinə xoş gəlmisiniz",
                    image: require('./images/1.png'),
                    desc: null
                },
                {
                    title: "Sürətli alış-veriş",
                    image: require('./images/2.png'),
                    desc: "Növbəsiz və Sürətli alış-veriş yalnız bir toxunuşla"
                },
                {
                    title: "Mağazaların tam kataloqu",
                    image: require('./images/3.png'),
                    desc: null
                },
                {
                    title: null,
                    image: require('./images/4.png'),
                    desc: null
                },
                {
                    title: null,
                    image: require('./images/5.png'),
                    desc: null
                },
                {
                    title: null,
                    image: require('./images/6.png'),
                    desc: null
                },
                {
                    title: null,
                    image: require('./images/7.png'),
                    desc: null
                },
                {
                    title: null,
                    image: require('./images/8.png'),
                    desc: null
                },
                {
                    title: null,
                    image: require('./images/9.png'),
                    desc: null
                },
            ]
        }
    }

    async _onDone() {
        await AsyncStorage.setItem("slider", "Ok")
        this.props.getnewCall();
    }

    _renderNextButton() {
        return (
            <View style={styles.button}>
                <AntDesign
                    style={styles.buttonIcon}
                    name="right"
                    size={24}
                    color="#fff"
                />
            </View>
        );
    }

    _renderDoneButton() {
        return (
            <View style={[styles.button, {backgroundColor: "#7c9d32"}]}>
                <AntDesign
                    style={styles.buttonIcon}
                    name="check"
                    size={24}
                    color="#fff"
                />
            </View>
        );
    }

    _renderItem({item, index}) {
        return (
            <View style={styles.slide} key={index}>
                <Image source={item.image} resizeMode="cover" style={styles.image}/>
                <View style={styles.slideContent}>
                    <Textpopins style={styles.title} children={item.title}/>
                    <Textpopins style={styles.desc} children={item.desc}/>
                </View>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" backgroundColor="#fff"/>
                <AppIntroSlider
                    renderItem={this._renderItem}
                    data={this.state.slides}
                    onDone={() => this._onDone()}
                    bottomButton={true}
                    dotStyle={{backgroundColor: "rgba(0,0,0,.9)", width: 10, height: 10}}
                    activeDotStyle={{backgroundColor: "#7c9d32", width: 20, height: 10}}
                    dotClickEnabled={false}
                    showNextButton={true}
                    showPrevButton={false}
                    showDoneButton={true}
                    renderDoneButton={this._renderDoneButton}
                    renderNextButton={this._renderNextButton}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    button: {
        flexDirection: "row",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: width / 20,
    },
    buttonIcon: {
        textAlign: "center",
        alignItems: "center",
        alignContent: "center",
        padding: 15,
    },
    buttonText: {
        color: "#7c9d32",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "left",
    },
    slide: {
        width: width,
        height: height - 100,
        justifyContent: "space-around",
        textAlign: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "#fff"
    },
    image: {
        width: 300,
        height: 300,
    },
    slideContent: {
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "transparent",
        padding: 10
    },
    title: {
        color: "#7c9d32",
        fontSize: 32,
        fontWeight: "bold",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        alignContent: "center",
    },
    desc: {
        color: "rgba(0,0,0,.4)",
        fontSize: 16,
        marginTop: 12,
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        alignContent: "center",
    }
});
