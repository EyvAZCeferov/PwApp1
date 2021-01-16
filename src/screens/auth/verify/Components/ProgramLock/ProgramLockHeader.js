import * as React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {Thumbnail} from 'native-base';

var width = Dimensions.get('window').width;
const icon = require('../../../../../../../../../assets/icon.png');
import {StatusBar} from "expo-status-bar";
import {t} from "../../../../../../../Lang";
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

export default class ProgramLockHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            pp: null
        }
    }

    componentDidMount() {
        this.getInfo();
        setInterval(() => {
            this.getInfo();
        }, 0)
    }

    getInfo() {
        const name = this.props.userName;
        const pp = this.props.userAvatar;
        this.setState({name, pp})
        this.renderElements();
    }

    renderElements() {
        if (this.state.pp !== null) {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Thumbnail
                            rounded
                            source={{
                                uri: this.state.pp,
                            }}
                        />
                        <MyText style={styles.title} children={this.state.name}/>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Thumbnail
                            rounded
                            source={icon}
                        />
                        <MyText style={styles.title} children={t('namesurname')}/>
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar style="dark" backgroundColor="#fff"/>
                {this.renderElements()}
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
        backgroundColor: 'transparent',
        borderColor: "transparent",
        textAlign: 'center',
    },
    header: {
        width: width,
        height: "100%",
        paddingTop: '15%',
        backgroundColor: 'transparent',
        borderColor: "transparent",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        color: 'rgba(0,0,0,.6)',
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 4,
        lineHeight: 18,
        backgroundColor: "transparent",
        textAlign: 'center',
        marginTop: 18,
    },
});
